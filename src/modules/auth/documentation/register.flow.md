### Register

- Client sends `{ email, name, password, phone }` to the server.

---

### Validate Email

- Check if the email already exists in `UserDB`.
- If status = `VERIFYING` → return **409 Conflict (Need to verify email)**.
- If status = `ACTIVE` → return **409 Conflict (User already exists)**.

---

### Create User in VERIFYING Status

- Hash the password.
- Assign default role = `CLIENT`.
- Create a new User with `{ status: VERIFYING }`.

---

### Generate OTP for Registration

- Generate a numeric OTP code.
- Upsert OTP in `OtpDB` with `{ userId, type: VERIFY_REGISTER, code, expiredAt }`.

---

### Send OTP via Email

- Send OTP email to the user with `{ email, code, username, type, expiredAt }`.
- Return `{ message: "Enter OTP from email" }`.

---

### Verify OTP

- Client submits `{ otp, deviceId }` to the server.
- Server validates OTP:
  - Must match code.
  - Must not be expired.
  - Must have type = `VERIFY_REGISTER`.

- If valid → update User `{ status: ACTIVE }`.
- Return `{ message: "Register successfully" }`.

---

### Sequence Diagram

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server
    participant U as User Database
    participant O as OTP Database
    participant E as Email Service

    Note over C,S: Request Registration
    C->>S: POST /register {email, name, password, phone}
    S->>U: Check if user exists by email
    alt User already ACTIVE
        S-->>C: 409 Conflict (User already exists)
    else User VERIFYING
        S-->>C: 409 Conflict (Need to verify email)
    else Not exists
        S->>U: Create User {status: VERIFYING}
        S->>O: Upsert OTP {type: VERIFY_REGISTER, code, expiredAt}
        S->>E: Send OTP email
        S-->>C: {message: "Enter OTP from email"}
    end

    Note over C,S: Verify OTP
    C->>S: POST /verify-otp {otp, deviceId}
    S->>O: Validate OTP (match, not expired, type=VERIFY_REGISTER)
    alt OTP invalid
        S-->>C: 401 Unauthorized (Invalid or expired OTP)
    else OTP valid
        S->>U: Update User {status: ACTIVE}
        S-->>C: {message: "Register successfully"}
    end
```
