# Firestore Security Specification & Hardened Test Suite

## 1. Data Invariants
1. **User Identity Invariant**: A user document at `/users/{userId}` can only be created, read, or modified by the authenticated user whose `request.auth.uid == userId`.
2. **Immutable Identity**: The `uid` in `/users/{userId}` must strictly match `request.auth.uid` on creation and cannot be changed on update.
3. **Progress Integrity**: `diasCompletados` and `semanaActual` must be non-negative numbers.
4. **Reflection Isolation**: Any document inside `/users/{userId}/reflections/{reflectionId}` must have `userId == request.auth.uid`. No cross-user reads or writes are allowed.
5. **No Blanket Reads**: No user can list or query the entire `/users` collection.
6. **Bounded Payloads**: All strings and lists are strictly bounded in length to prevent denial of wallet attacks.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Spoofed User ID on Create**: Unauthenticated user creates `/users/user_abc`. Expect: `PERMISSION_DENIED`.
2. **Cross-User Profile Read**: `user_1` attempts to `get` `/users/user_2`. Expect: `PERMISSION_DENIED`.
3. **Cross-User Profile Update**: `user_1` attempts to modify `diasCompletados` on `/users/user_2`. Expect: `PERMISSION_DENIED`.
4. **Blanket Collection Query**: `user_1` executes `collection('users')` list query. Expect: `PERMISSION_DENIED`.
5. **Privilege Escalation via Ghost Field**: `user_1` sends `{ isAdmin: true }` in user profile update. Expect: `PERMISSION_DENIED`.
6. **Immutable Field Modification**: `user_1` attempts to change `uid` in `/users/user_1` from `user_1` to `user_hacker`. Expect: `PERMISSION_DENIED`.
7. **Negative Progress Hack**: `user_1` sets `diasCompletados: -10`. Expect: `PERMISSION_DENIED`.
8. **Invalid Path ID (ID Poisoning)**: Write to `/users/user_1/reflections/$$$###illegal!!!`. Expect: `PERMISSION_DENIED`.
9. **Orphaned Reflection Document**: `user_1` creates a reflection in `user_2`'s subcollection. Expect: `PERMISSION_DENIED`.
10. **Spoofed Reflection User ID**: `user_1` writes a reflection under `/users/user_1/reflections/r1` with `userId: "user_2"`. Expect: `PERMISSION_DENIED`.
11. **Oversized Payload (Denial of Wallet)**: `user_1` sends a 50KB string in `whatToRelease`. Expect: `PERMISSION_DENIED`.
12. **Array Flood**: `user_1` sends an array with 1,000 items in `completedDayIds`. Expect: `PERMISSION_DENIED`.
