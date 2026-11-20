'use strict';

const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { beforeUserCreated, beforeUserSignedIn } = require('firebase-functions/v2/identity');
const { OAuth2Client } = require('google-auth-library');

initializeApp();
const auth = getAuth();
const database = getFirestore();
const google = new OAuth2Client();
const clientId = '572111662694-ak1lh2f7tf8ief2d011vj4kb03k1apb5.apps.googleusercontent.com';

function denied() {
  return new HttpsError('permission-denied', 'MyLedger access denied.');
}

async function requireEmailAccess(rawEmail, uid, findOwnerByEmail = false) {
  const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';
  if (email.length > 254 || !/^[^@/\s]+@[^@/\s]+$/.test(email)) throw denied();

  const invitation = await database.collection('accessInvites').doc(email).get();
  if (invitation.data()?.allowed === true) return;

  if (!uid && findOwnerByEmail) {
    try {
      uid = (await auth.getUserByEmail(email)).uid;
    } catch (error) {
      if (error.code !== 'auth/user-not-found') throw error;
    }
  }
  if (uid && (await database.collection('accessOwners').doc(uid).get()).exists) return;
  throw denied();
}

exports.checkSignupAccess = onCall(async request => {
  await requireEmailAccess(request.data?.email, undefined, true);
  return { allowed: true };
});

exports.checkVerificationAccess = onCall(async request => {
  if (!request.auth) throw denied();
  const user = await auth.getUser(request.auth.uid);
  if (user.disabled || user.email !== request.auth.token.email) throw denied();
  await requireEmailAccess(user.email, user.uid);
  return { allowed: true };
});

exports.checkGoogleAccess = onCall(async request => {
  const idToken = request.data?.credential;
  if (typeof idToken !== 'string' || idToken.length > 8192) throw denied();

  let claims;
  try {
    const ticket = await google.verifyIdToken({ idToken, audience: clientId });
    claims = ticket.getPayload();
  } catch {
    throw denied();
  }
  if (claims?.email_verified !== true) throw denied();
  await requireEmailAccess(claims.email, undefined, true);
  return { allowed: true };
});

async function enforceAccess(event) {
  const user = event.data;
  const provider = event.credential?.providerId ?? event.eventType.split(':')[1];
  if (provider === 'phone') return;
  if (provider === 'google.com' && !user?.emailVerified) throw denied();
  await requireEmailAccess(user?.email, user?.uid);
}

exports.guardAccountCreation = beforeUserCreated(enforceAccess);
exports.guardSignIn = beforeUserSignedIn(enforceAccess);
