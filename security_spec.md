# MingleKe Elite Security Specification

## Data Invariants
1. A user can only access their own private profile data.
2. Only activated users can access the discovery feed and matches.
3. A match can only be created if there is a mutual like between two users.
4. Messages can only be read/written by participants of that specific match.
5. Referral coins can only be earned when the referred user activates their account.

## The "Dirty Dozen" Payloads (Testing Denials)
1. Attempt to update another user's `isActivated` status to bypass payment.
2. Attempt to create a Match document directly without a mutual like.
3. Attempt to read messages from a match you are not a part of.
4. Attempt to update your own `coins` balance directly.
5. Attempt to delete another user's profile.
6. Attempt to spoof the `senderId` in a message to impersonate another user.
7. Attempt to write a message to a match that has been closed or doesn't include you.
8. Attempt to set `isVerified: true` on your own profile.
9. Attempt to read all likes in the system.
10. Attempt to inject a 2MB string into a chat message.
11. Attempt to create a referral for yourself.
12. Attempt to update the `createdAt` timestamp of a message to an old date.

## Interaction Paths
- `/users/{userId}`
- `/matches/{matchId}`
- `/matches/{matchId}/messages/{messageId}`
- `/likes/{likeId}`
- `/referrals/{referralId}`
