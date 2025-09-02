# Forgot Password

When a user forgets their password, the system provides a reset mechanism using OTP verification.
After the password is updated, all existing sessions and tokens are revoked.

---

### Request OTP

- Client selects method to receive OTP: **email** or **phone**
- Server generates an OTP with `type="VERIFY_FORGOT_PASSWORD"`
- Server responds:

```json
{ "message": "Enter your OTP sent to your email/phone" }
```

---

### Submit OTP and new password

- Client sends request: `{ email, otp, newPassword }`
- Server processing:
  - Validate OTP (must match, correct type, not expired)
  - Find user by email
    - If not found → return error

  - Hash the new password and update user record
  - Invalidate all user sessions:
    - Delete tokens for all devices
    - Delete devices associated with the user

- Server responds:

```json
{ "message": "Change password successfully" }
```

---

### Error Cases

- Invalid or expired OTP:

```json
{ "error": "Invalid or expired OTP" }
```

- User not found:

```json
{ "error": "User not found" }
```

---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant OTP_DB as OTP Database
    participant User_DB as User Database
    participant Device_DB as Device Database
    participant Token_DB as Token Database

    Note over Client,Server: Request OTP
    Client->>Server: POST /forgot-password { email | phone }
    Server->>OTP_DB: Create OTP(type="VERIFY_FORGOT_PASSWORD")
    Server-->>Client: { message: "Enter your OTP sent to your email/phone" }

    Note over Client,Server: Submit OTP & new password
    Client->>Server: POST /forgot-password/verify { email, otp, newPassword }

    Note over Server,OTP_DB: OTP validation
    Server->>OTP_DB: Validate OTP (match code, type, not expired)
    alt OTP invalid/expired
        Server-->>Client: { error: "Invalid or expired OTP" }
    else OTP valid
        Note over Server,User_DB: Find user by email
        Server->>User_DB: Get user by email
        alt User not found
            Server-->>Client: { error: "User not found" }
        else User exists
            Note over Server,User_DB: Update password
            Server->>User_DB: Update user password (hashed)

            Note over Server,Device_DB: Invalidate sessions
            Server->>Device_DB: Find devices by userId
            Device_DB-->>Server: [deviceId...]
            par Delete tokens
                loop For each deviceId
                    Server->>Token_DB: Delete tokens for userId+deviceId
                end
            and Delete devices
                Server->>Device_DB: Delete all devices by userId
            end

            Server-->>Client: { message: "Change password successfully" }
        end
    end
```
