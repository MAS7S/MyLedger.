# MyLedger

The browser checks the exact normalized email in Firestore before email
sign-in, password account creation, verification email delivery, or Google
Identity Services sign-in. Firebase Authentication validates the original
Google credential. The application checks Firebase Auth and Firestore again
when opening or rechecking a session.

Owners grant access in MyLedger. An invitation is stored in
`accessInvites/{lowercaseEmail}` as pending. After verified sign-in, a
Firestore transaction binds it to the Firebase UID and creates `users/{uid}`.
The owner’s Users list and the Firestore ledger rules require both records to
match. Invitations from earlier releases without a status are treated as
pending until their first verified sign-in with this release.

Removing access deletes the invitation, its matching user record, and any
old signup link in one transaction. The ledger remains under its original UID.
A verified sign-in with a different UID cannot use the old invitation. The app
checks for inconsistent bindings and removes them when it has permission to do
so. An owner can explicitly invite the email again.

Firebase Auth can create a record before the email is verified. This record
becomes a MyLedger user only after verified sign-in. The Firebase Auth client
can inspect its current account. If deletion or disabling has already
invalidated its credentials, it cannot write cleanup to Firestore. In that
case, use MyLedger’s **Remove access** when deleting or disabling the account
in the Firebase console. Automatic cleanup of accounts with no valid client
session requires an administrative integration.

Owner privileges come from administrator-assigned `accessOwners/{uid}`
records. Verified owners also register `accessOwnerEmails/{lowercaseEmail}`
for sign-in preflight. To bootstrap an existing owner, an administrator can
create that mapping with the already assigned owner UID.

Leave `signupChecks` and `signinChecks` empty. Single-address lookups reveal
eligibility for the applicable action. Collection queries and direct reads of
private authorization records are restricted.

## Deploy to Firebase Hosting

Keep the Google and Email/Password providers enabled. Authorize the Hosting
origins you use in the project's Google Web OAuth client, including
`https://my-ledger-8d0b3.web.app` and
`https://my-ledger-8d0b3.firebaseapp.com` if you use both.

```sh
firebase deploy --project my-ledger-8d0b3 --only firestore:rules,hosting
```
