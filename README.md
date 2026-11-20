
# MyLedger

Email and Google access use the existing Firestore records. Administrators assign
owners with `accessOwners/{uid}`. Owners invite addresses through the app, which
creates `accessInvites/{lowercaseEmail}` with `allowed: true`. An administrator
can bootstrap a new owner by inviting the address, letting the user register,
then assigning their UID in `accessOwners`.

Google Identity Services supplies a Google ID token. The backend verifies the
token for the project's Web client ID and checks Firestore before the browser
exchanges it for a Firebase session. Firebase Auth blocking functions check access
before email account creation and email or Google sign-in. The app checks access
again before sending a verification email. Email invitees must verify their
address before accessing their ledger.

## Deploy to Firebase

1. Enable Firebase Authentication with Identity Platform and confirm the project
   has the Blaze plan. Keep the Google and Email/Password providers enabled.
2. In the Web OAuth client, authorize the JavaScript origins used for Hosting,
   including `https://my-ledger-8d0b3.web.app` and
   `https://my-ledger-8d0b3.firebaseapp.com` if both are used.
3. Install server dependencies and deploy the functions before the frontend.

   ```sh
   npm ci --prefix functions
   firebase deploy --project my-ledger-8d0b3 --only functions
   firebase deploy --project my-ledger-8d0b3 --only firestore:rules,hosting
   ```

4. In Authentication settings, confirm that the creation and sign-in blocking
   functions are registered. Test an invited account, a non-invited account,
   and an existing owner. Check that a rejected registration creates no Auth
   account and that an email invitee can use the ledger after verification.
