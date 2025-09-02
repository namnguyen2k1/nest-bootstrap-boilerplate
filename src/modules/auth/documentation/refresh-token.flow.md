### Refresh Token Flow

- Client sends `{ refreshToken, userId }` to the server.

---

### Verify Refresh Token

- Verify the provided refresh token using JWT service.
- If `expired` → return **401 Unauthorized (Refresh Token expired)**.
- If `invalid` → return **401 Unauthorized (Invalid Refresh Token)**.
- If valid → extract `{ userId, deviceId }`.

---

### Validate User and Token in Database

- Fetch the user from `UserDB` by `userId`. If not found → **404 Not Found (User not found)**.
- Fetch the refresh token from `TokenDB` by `{ userId, deviceId }`. If not found → **404 Not Found (Refresh Token not found)**.
- If `revokedAt` exists or `expiredAt <= now` → delete token + set device to `INACTIVE` → return **401 Unauthorized (Refresh Token revoked/expired)**.
- Compare provided refresh token with stored hashed token. If mismatch → **401 Unauthorized (Invalid Refresh Token)**.

---

### Generate and Rotate Tokens

- Generate new access token and refresh token.
- Hash and replace the stored refresh token.
- Update `expiredAt` with a new expiry date and clear `revokedAt`.
- Return `{ accessToken, refreshToken }`.

---

### Sequence Diagram

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant User_DB as User Database
    participant Token_DB as Token Database
    participant Device_DB as Device Database

    Note over Client,Server: Request Refresh Token
    Client->>Server: POST /auth/refresh-token { userId, refreshToken }

    Note over Server,Token_DB: Verify Refresh Token
    Server->>Server: Verify JWT (refresh token)
    alt Expired
        Server-->>Client: 401 Unauthorized (Refresh Token expired)
    else Invalid
        Server-->>Client: 401 Unauthorized (Invalid Refresh Token)
    else Valid
        Server->>User_DB: Find user by userId
        alt User not found
            Server-->>Client: 404 Not Found (User not found)
        else User found
            Server->>Token_DB: Find refresh token by {userId, deviceId}
            alt Token not found
                Server-->>Client: 404 Not Found (Refresh Token not found)
            else Token found
                alt Revoked or Expired
                    Server->>Token_DB: Delete token
                    Server->>Device_DB: Set device status = INACTIVE
                    Server-->>Client: 401 Unauthorized (Refresh Token revoked/expired)
                else Token Active
                    Server->>Server: Compare provided vs stored hashed token
                    alt Not matched
                        Server-->>Client: 401 Unauthorized (Invalid Refresh Token)
                    else Matched
                        Server->>Server: Generate new tokens
                        Server->>Token_DB: Update hashed refresh token, expiredAt, clear revokedAt
                        Server-->>Client: { accessToken, refreshToken }
                    end
                end
            end
        end
    end
```
