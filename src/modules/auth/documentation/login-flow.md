# Login Flow

---

### 1. Check user existence & status

- Query `User` by `email`.
- If user not found → throw `User not found`.
- If `status == BLOCK` → reject login with `User not found (blocked)`.

---

### 2. Validate password

- Compare `dto.password` with stored `hashPassword` using `hashingService.compare`.
- If invalid → throw `Invalid password`.

---

### 3. Check maximum device login limit

- Fetch `Role` of user → read `maxDeviceLogin`.
- Count devices with `status = ACTIVE`.
- If `activeDeviceCount >= maxDeviceLogin` → throw `Maximum device login reached`.

---

### 4. Check if 2FA is enabled

- If `enable2FA = true`:
  - Generate OTP (`type = VERIFY_2FA`).
  - Store or update OTP (`code`, `expiredAt`) for `userId`.
  - Send OTP via email.
  - Return `{ enable2FA: true, message: "enter OTP from your email" }`.
  - Client must call `POST /verify-otp` with `{ code }` before receiving tokens.

---

### 5. Create or update device record

- If 2FA is disabled:
  - Create/Update device with `userId`, `ip`, `userAgent`.
  - Mark `status = ACTIVE` and update `lastLogin`.

---

### 6. Generate tokens

- Create `accessToken` + `refreshToken` with payload `{ userId, deviceId }`.

---

### 7. Store refresh token

- Hash `refreshToken` value.
- Save or update record in `Token` collection with:
  - `userId`
  - `deviceId`
  - `refreshToken (hashed)`
  - `expiredAt`

---

### 8. Return response

- If 2FA disabled → return `{ enable2FA: false, data: { accessToken, refreshToken } }`.
- If 2FA enabled → return `{ enable2FA: true }` and wait for OTP verification.

---

## Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Service
    participant AuthService
    participant UserDB
    participant RoleDB
    participant DeviceDB
    participant OTPDB
    participant TokenDB

    Client->>Service: POST /login [email, password]
    Service->>AuthService: Handle login

    Note over AuthService: 1. Validate user
    AuthService->>UserDB: Find user by email
    UserDB-->>AuthService: User {status, passwordHash, enable2FA}
    alt user not found or status == BLOCK
        AuthService-->>Service: Error: Invalid user
        Service-->>Client: 401 Unauthorized
    else
        AuthService->>AuthService: Compare password hash
        alt password mismatch
            AuthService-->>Service: Error: Invalid password
            Service-->>Client: 401 Unauthorized
        else
            Note over AuthService: 2. Check device limit
            AuthService->>RoleDB: Get Role by userId
            RoleDB-->>AuthService: Role {maxDeviceLogin}
            AuthService->>DeviceDB: Count active devices by userId
            alt activeDevices >= maxDeviceLogin
                AuthService-->>Service: Error: Max devices reached
                Service-->>Client: 403 Forbidden
            else
                Note over AuthService: 3. Two-Factor Authentication
                alt enable2FA == true
                    AuthService->>OTPDB: Create/Update OTP {type=VERIFY_2FA}
                    AuthService-->>Client: Prompt OTP
                    Client->>Service: Submit OTP
                    Service->>AuthService: Validate OTP
                    AuthService->>OTPDB: Get OTP by userId
                    OTPDB-->>AuthService: OTP {code, expiredAt}
                    alt OTP invalid or expired
                        AuthService-->>Service: Error: OTP invalid
                        Service-->>Client: 401 Unauthorized
                    else
                        Note over AuthService: 4. Issue token & device
                        AuthService->>DeviceDB: Create/Update Device {status=ACTIVE}
                        AuthService->>TokenDB: Save refreshToken (hashed)
                        AuthService-->>Service: {token, refreshToken}
                        Service-->>Client: {token, refreshToken}
                    end
                else
                    Note over AuthService: 4. Issue token & device (no 2FA)
                    AuthService->>DeviceDB: Create/Update Device {status=ACTIVE}
                    AuthService->>TokenDB: Save refreshToken (hashed)
                    AuthService-->>Service: {token, refreshToken}
                    Service-->>Client: {token, refreshToken}
                end
            end
        end
    end
```
