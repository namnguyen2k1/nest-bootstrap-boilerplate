### Authorization flow

- Client sends request to service → token → `[userId, deviceId]` + `request IP`

---

### 1. Device validation

- `userId → User` → `status == "BLOCK", "VERIFYING"` → error
- `[ip, userId]` → `Device → {status, deviceId}`
- if `status == "BLOCK"` → error
- if `deviceId != deviceId (from token)` → error

---

### 2. Token validation

- `deviceId `→ `Token.revokedAt`
- if `revokedAt < Date.now()` → error

---

### 3. User authorization

- From Controller → `[requiredRoles, requiredPermissions]`
- `userId → User → roleId`
  - Compare `roleKey`:
    - `roleId → Role → roleKey == requiredRoles` → `validRoleKey = true`

  - Compare `permissions`:
    - `roleId → RolePermission → permissions (1)`
    - `userId → UserPermission (not expired) → permissions (2)`
    - `permissions(1 + 2) == requiredPermissions` → `validPermission = true`

---

### 4. Attach authorized context to request

- If `validRoleKey || validPermission`:

```ts
request.authContext = {
  role: roleKey,
  user: {...user},
  permissions: string[]
};
```

---

### 5. Resource ownership validation (inside controller code)

- Example: User who created a post has permission to edit or delete that post.

---

## Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Service
    participant AuthService
    participant UserDB
    participant DeviceDB
    participant TokenDB
    participant RoleDB
    participant PermissionDB

    Client->>Service: Request + Token [userId, deviceId] + IP
    Service->>AuthService: Validate request

    Note over AuthService: 1. Device validation
    AuthService->>UserDB: Get User by userId
    UserDB-->>AuthService: User {status}
    alt status == BLOCK or VERIFYING
        AuthService-->>Service: Error: User status invalid
        Service-->>Client: 403 Forbidden
    else
        AuthService->>DeviceDB: Get Device by [ip, userId]
        DeviceDB-->>AuthService: Device {status, deviceId}
        alt status == BLOCK
            AuthService-->>Service: Error: Device blocked
            Service-->>Client: 403 Forbidden
        else
            alt token.deviceId != device.deviceId
                AuthService-->>Service: Error: Device mismatch
                Service-->>Client: 403 Forbidden
            else
                Note over AuthService: 2. Token validation
                AuthService->>TokenDB: Get Token by deviceId
                TokenDB-->>AuthService: Token {revokedAt}
                alt revokedAt < now
                    AuthService-->>Service: Error: Token revoked
                    Service-->>Client: 401 Unauthorized
                else
                    Note over AuthService: 3. User authorization
                    Service->>AuthService: requiredRoles, requiredPermissions
                    AuthService->>RoleDB: Get Role by roleId
                    RoleDB-->>AuthService: roleKey, rolePermissions
                    AuthService->>PermissionDB: Get UserPermissions (unexpired)
                    PermissionDB-->>AuthService: userPermissions
                    AuthService->>AuthService: Validate roleKey & permissions
                    alt invalid role & permission
                        AuthService-->>Service: Error: Permission denied
                        Service-->>Client: 403 Forbidden
                    else
                        Note over AuthService: 4. Attach authContext to request
                        AuthService-->>Service: request.authContext = {role, user, permissions}
                        Service-->>Client: Response (OK)
                    end
                end
            end
        end
    end
```
