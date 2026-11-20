# MyLedger

The browser checks the exact normalized email in Firestore before creating a
password account, sending a verification email, or exchanging a Google Identity
Services credential for a Firebase session. Firebase Authentication validates
the original Google credential. Verified Firebase sessions still need an
active invitation or an owner UID to access ledger data under Firestore rules.

Owners grant email access through the app. Firestore checks
`accessInvites/{lowercaseEmail}` for an active invitation. Owner privileges
come from administrator-assigned `accessOwners/{uid}` records. A verified owner
session also registers `accessOwnerEmails/{lowercaseEmail}` with the owner's
`uid` for the before-sign-in check. To provision an existing owner who cannot
sign in yet, the administrator can create that mapping using the verified
email and its existing owner UID.

`signupChecks/{lowercaseEmail}` is a rules-only lookup. Leave that collection
empty. It exposes whether an exact address is eligible, while collection
queries and direct reads of private authorization records remain restricted.
A client using Firebase Authentication directly can skip the app's preflight.
Firestore still enforces authorization for ledger access.

## Deploy to Firebase Hosting

Keep the Google and Email/Password providers enabled. Authorize the Hosting
origins you use in the project's Google Web OAuth client, including
`https://my-ledger-8d0b3.web.app` and `https://my-ledger-8d0b3.firebaseapp.com`
if you use both.

```sh
firebase deploy --project my-ledger-8d0b3 --only firestore:rules,hosting
```
