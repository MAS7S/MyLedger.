'use strict';

(() => {
  const config = {
    apiKey: 'AIzaSyD88lP9j0jCfoOs91fuaHn2AipUSHYe6Gk',
    authDomain: 'my-ledger-8d0b3.firebaseapp.com',
    projectId: 'my-ledger-8d0b3',
    storageBucket: 'my-ledger-8d0b3.firebasestorage.app',
    messagingSenderId: '572111662694',
    appId: '1:572111662694:web:43315347b4d875e8e5c7a7'
  };

  const googleClientId = '572111662694-ak1lh2f7tf8ief2d011vj4kb03k1apb5.apps.googleusercontent.com';

  const revocationOrigin = "__MYLEDGER_REVOCATION_URL__";
  const revocationEnabled = revocationOrigin.startsWith('https://');

  const messages = {
    ar: {
      createAccount:'إنشاء حساب', firstTime:'أول مرة؟', setPassword:'تعيين كلمة المرور', backToSignIn:'العودة لتسجيل الدخول', orEmail:'أو استخدم البريد الإلكتروني', signupDenied:'هذا البريد غير مصرح له من قبل المالك.', useSignup:'تحقّق من كلمة المرور، أو اضغط إنشاء حساب إذا كانت هذه أول مرة. إذا سبق ودخلت بحساب Google، استخدمه مجددًا.', signupExisting:'هذا الحساب موجود. سجّل الدخول بكلمة المرور أو باستخدام Google.',
      signupCheckFailed:'تعذّر التحقق من صلاحية البريد الآن. أعد المحاولة.',
      accessRevoked:'تم إلغاء الوصول. تواصل مع المالك للحصول على دعوة جديدة.',
      revoke:'إزالة الوصول', revokeConfirm:'هل تريد إزالة الوصول لـ',
      revoked:'تمت إزالة الوصول لـ', revokeError:'تعذّرت إزالة الوصول. أعد المحاولة.',
      authorized:'المصرّح لهم', invitations:'الدعوات', users:'المستخدمون',
      waiting:'قيد الانتظار', active:'نشط',
      waitingDetail:'بانتظار التحقق من البريد أو إكمال التسجيل.',
      activeDetail:'تم التحقق من البريد والموافقة على الوصول.',
      finishingRevocation:'إكمال إزالة الحساب',
      revocationPending:'تم إيقاف الوصول. لم يُحذف حساب تسجيل الدخول بعد.',
      revocationUnavailable:'خدمة إزالة الحساب غير مهيأة.',
      offlineSignIn:'اتصل بالإنترنت لتسجيل الدخول.',
      downloadUnsynced:'تنزيل نسخة احتياطية من التغييرات غير المتزامنة',
      resetPassword:'إعادة تعيين كلمة المرور', resetEmail:'أدخل بريدك الإلكتروني أولاً.',
      resetSent:'إذا كان لديك حساب مؤهّل، ستصلك رسالة إعادة تعيين كلمة المرور.',
      listLoading:'جارٍ تحميل القائمة…', listEmpty:'ما فيه بيانات في هذه القائمة.',
      listError:'تعذّر تحميل القائمة. تأكّد من نشر قواعد Firestore الجديدة ثم أعد المحاولة.', retry:'إعادة المحاولة',
      title:'تسجيل الدخول', google:'الدخول بحساب Google', email:'البريد الإلكتروني', password:'كلمة المرور',
      signIn:'دخول بالبريد',
      share:'منح الوصول إلى MyLedger', method:'نوع الإذن', recipient:'بريد الشخص المدعو', grant:'منح الوصول',

      close:'إغلاق', pending:'جارٍ التحقق من الدخول…', denied:'لا توجد دعوة مطابقة لهذا الحساب. استخدم البريد الذي وافق عليه المالك.',
      confirmEmail:'أكّد ملكية بريدك لمتابعة الدخول.', sendVerification:'إرسال رابط التأكيد',
      verificationSent:'أرسلنا رابط التأكيد. افتحه ثم اضغط «تحقّق مجددًا».', checkAgain:'تحقّق مجددًا',
      signOut:'استخدام حساب آخر', inviteFailed:'تعذّر منح الوصول.', invited:'تم منح الوصول لـ',
      origin:'افتح التطبيق من رابط HTTPS معتمد، أو استخدم محاكيات Firebase محليًا.',
      error:'تعذّر إكمال تسجيل الدخول', out:'تعذّر تسجيل الخروج'
    },
    en: {
      createAccount:'Create account', firstTime:'First time?', setPassword:'Set password', backToSignIn:'Back to sign in', orEmail:'or use email', signupDenied:'This email has not been granted access by the owner.', useSignup:'Check your password, select Create account if this is your first time, or sign in with Google if you used it before.', signupExisting:'This account already exists. Sign in with your password or with Google.',
      signupCheckFailed:'Could not check email authorization. Try again.',
      accessRevoked:'Access revoked. Contact the owner for a new invitation.',
      revoke:'Remove access', revokeConfirm:'Remove access for',
      revoked:'Access removed for', revokeError:'Could not remove access. Try again.',
      authorized:'Authorized people', invitations:'Invitations', users:'Users',
      waiting:'Pending', active:'Active',
      waitingDetail:'Awaiting email verification or completion of registration.',
      activeDetail:'Email verified and access approved.',
      finishingRevocation:'Finish removing account',
      revocationPending:'Access is blocked. The sign-in account has yet to be removed.',
      revocationUnavailable:'The account removal service is not configured.',
      offlineSignIn:'Connect to the internet to sign in.',
      downloadUnsynced:'Download backup of unsynced changes',
      resetPassword:'Reset password', resetEmail:'Enter your email address first.',
      resetSent:'If you have an eligible account, you’ll receive a password reset email.',
      listLoading:'Loading access…', listEmpty:'No entries in this list.',
      listError:'Could not load the list. Make sure the latest Firestore rules are published and try again.', retry:'Retry',
      title:'Sign in',google:'Sign in with Google',email:'Email',password:'Password',signIn:'Sign in by email',
      share:'Grant access to MyLedger', method:'Access method',recipient:'Invitee email',
      grant:'Grant access',

      close:'Close',pending:'Checking access…',denied:'No invitation matches this account. Use the email approved by the owner.',
      confirmEmail:'Verify your email address to continue.',sendVerification:'Send verification link',
      verificationSent:'Open the link in your inbox, then select Check again.',checkAgain:'Check again',
      signOut:'Use another account',inviteFailed:'Could not grant access.',invited:'Access granted to',
      origin:'Open the app on an authorized HTTPS origin or use the local Firebase emulators.',
      error:'Could not complete sign-in',out:'Could not sign out'
    }
  };
  const dialog = document.querySelector('#account-auth');
  const emulator = ['localhost','127.0.0.1'].includes(location.hostname);
  const supported = location.protocol === 'https:' || (emulator && location.protocol === 'http:');
  let connection;
  let googleLibrary;
  let ownerAccess;
  let accessNotice;
  let handling = false;
  let googleExchange;
  let session;
  const invalidAuth = new Set([
    'auth/user-not-found', 'auth/user-disabled', 'auth/user-token-expired',
    'auth/invalid-user-token', 'auth/token-expired'
  ]);

  function connect() {
    if (connection) return connection;
    const base = 'https://www.gstatic.com/firebasejs/11.10.0/';
    connection = Promise.all([
      import(base + 'firebase-app.js'),
      import(base + 'firebase-auth.js'),
      import(base + 'firebase-firestore.js')
    ]).then(([core,authSdk,store]) => {
      const firebase = core.initializeApp(config);
      const auth = authSdk.getAuth(firebase);
      const database = store.getFirestore(firebase);
      if (emulator) {
        authSdk.connectAuthEmulator(auth,'http://' + location.hostname + ':9099');
        store.connectFirestoreEmulator(database,location.hostname,8080);
      }
      const services = {auth,authSdk,store,database};
      const authChanged = user => {
        if (session?.user === user) return;
        if (session) {
          if (!user && session.checking && !session.signingOut && !session.denied && session.adapter) {
            protectDraft(session);
            accessNotice = 'accessRevoked';
          }
          leaveSession(session);
        }
        if (user) {
          accessNotice = undefined;
          session = {services,user,stops:[],exchange:googleExchange};
          void checkAccess(session);
        } else if (accessNotice || !dialog.open || !dialog.querySelector('#email-auth')) {
          showSignInForm();
        }
      };
      authSdk.onAuthStateChanged(auth,authChanged);
      return services;
    }).catch(error => {
      connection = undefined;
      throw error;
    });
    return connection;
  }

  function loadGoogleIdentity() {
    if (googleLibrary) return googleLibrary;
    googleLibrary = new Promise((resolve,reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      const failed = () => {
        script.remove();
        reject(new Error('Could not load Google Identity Services'));
      };
      script.onload = () => {
        const identity = window.google?.accounts?.id;
        if (identity) resolve(identity);
        else failed();
      };
      script.onerror = failed;
      document.head.append(script);
    }).catch(error => {
      googleLibrary = undefined;
      throw error;
    });
    return googleLibrary;
  }

  function accessDenied() {
    return Object.assign(new Error('Access denied'),{code:'myledger/access-denied'});
  }

  function normalizeEmail(value) {
    return typeof value === 'string' ? value.trim().toLowerCase() : '';
  }

  function validEmail(email) {
    return email.length <= 254 && /^[^@/\s]+@[^@/\s]+\.[^@/\s]+$/.test(email);
  }

  async function checkEmailAccess({store,database},rawEmail,signup=false) {
    const email = normalizeEmail(rawEmail);
    if (!validEmail(email)) throw accessDenied();
    try {
      const collection = signup ? 'signupChecks' : 'signinChecks';
      const check = await store.getDocFromServer(store.doc(database,collection,email));
      if (check.exists()) throw accessDenied();
    } catch (error) {
      if (error.code === 'permission-denied') throw accessDenied();
      throw error;
    }
  }

  function googleEmail(credential) {
    try {
      const segments = credential.split('.');
      if (segments.length !== 3) throw accessDenied();
      const encoded = segments[1].replace(/-/g,'+').replace(/_/g,'/');
      const bytes = Uint8Array.from(atob(encoded),character => character.charCodeAt(0));
      const claims = JSON.parse(new TextDecoder().decode(bytes));
      // These claims select the preflight lookup. Firebase validates the original credential.
      if (claims.aud === googleClientId && claims.email_verified === true) return claims.email;
    } catch {
      throw accessDenied();
    }
    throw accessDenied();
  }

  function authError(copy,error) {
    if (!navigator.onLine || error.code === 'auth/network-request-failed' || error.code === 'unavailable') {
      return copy.offlineSignIn;
    }
    return error.code === 'myledger/access-denied'
      ? copy.denied : [copy.error,error.code].filter(Boolean).join(' · ');
  }

  function accountChanged(detail) {
    window.dispatchEvent(new CustomEvent('myledger-account',{detail}));
  }

  function activeSession(state) {
    return !state.denied && session === state && state.services.auth.currentUser === state.user;
  }

  function hideAccount(state) {
    if (!state.adapter) return;
    state.adapter = undefined;
    ownerAccess = undefined;
    if (dialog.open) dialog.close();
    accountChanged(null);
  }

  function stopAccessWatches(state) {
    state.stops.splice(0).forEach(stop => stop());
  }

  function leaveSession(state) {
    session = undefined;
    stopAccessWatches(state);
    hideAccount(state);
  }

  function setSyncReady(state,ready) {
    state.ready = ready;
    if (!state.adapter) return;
    window.dispatchEvent(new CustomEvent('myledger-connection',{detail:{adapter:state.adapter,ready}}));
  }

  function protectDraft(state) {
    if (!state.owner) window.dispatchEvent(new CustomEvent('myledger-revoked',{detail:state.user.uid}));
  }

  async function denySession(state,notice) {
    if (!activeSession(state)) return;
    state.denied = true;
    accessNotice = notice;
    protectDraft(state);
    hideAccount(state);
    stopAccessWatches(state);
    const {auth,authSdk} = state.services;
    try {
      if (state.newGoogleAccount) {
        state.newGoogleAccount = false;
        try { await authSdk.deleteUser(state.user); } catch {}
      }
      if (auth.currentUser === state.user) await authSdk.signOut(auth);
    } catch {
      if (auth.currentUser === state.user) {
        const copy = messages[loginLanguage];
        showAccessStatus(copy,copy[notice],state);
      }
    }
  }

  async function removeGrant(store,database,tx,reference,grant,userSnapshot) {
    const legacyLink = /^[0-9a-f]{32}$/.test(grant.signupCode || '')
      ? await tx.get(store.doc(database,'signupInvites',grant.signupCode)) : null;
    if (userSnapshot?.data()?.email === reference.id) tx.delete(userSnapshot.ref);
    if (legacyLink?.exists()) tx.delete(legacyLink.ref);
    tx.delete(reference);
  }

  async function revokeGrant({store,database},email,shouldRemove) {
    const reference = store.doc(database,'accessInvites',email);
    return store.runTransaction(database,async tx => {
      const grant = (await tx.get(reference)).data();
      if (!grant) return false;
      const user = grant.uid ? await tx.get(store.doc(database,'users',grant.uid)) : null;
      if (!shouldRemove(grant,user?.data(),reference.id)) return false;
      await removeGrant(store,database,tx,reference,grant,user);
      return true;
    });
  }

  async function completeInvitation(state,email,profile) {
    const {store,database} = state.services;
    const reference = store.doc(database,'accessInvites',email);
    return store.runTransaction(database,async tx => {
      if (!activeSession(state)) throw accessDenied();
      const grant = (await tx.get(reference)).data();
      const user = await tx.get(profile);
      if (!grant) {
        if (user.data()?.email === email) tx.delete(profile);
        return false;
      }
      if (grant.allowed !== true) return false;
      if (grant.status === 'approved') {
        if (grant.uid === state.user.uid && user.data()?.email === email) return true;
        const previousUser = grant.uid === state.user.uid ? user
          : await tx.get(store.doc(database,'users',grant.uid));
        await removeGrant(store,database,tx,reference,grant,previousUser);
        return false;
      }
      if ((grant.status || 'pending') !== 'pending' || grant.uid || user.exists()) return false;
      tx.update(reference,{status:'approved',uid:state.user.uid});
      tx.set(profile,{email});
      return true;
    });
  }

  function watchAccess(state,references,owner) {
    const {store} = state.services;
    const confirmed = new Set();
    const copy = messages[loginLanguage];
    references.forEach(([reference,valid]) => {
      state.stops.push(store.onSnapshot(reference,{includeMetadataChanges:true},snapshot => {
        if (!activeSession(state) || snapshot.metadata.hasPendingWrites) return;
        if (snapshot.metadata.fromCache) {
          confirmed.delete(reference);
          setSyncReady(state,false);
          return;
        }
        if (!valid(snapshot)) {
          void denySession(state,'accessRevoked');
          return;
        }
        confirmed.add(reference);
        if (confirmed.size !== references.length || !navigator.onLine) return;
        if (state.adapter) {
          if (!state.ready && !state.checking) void checkAccess(state);
          return;
        }
        if (owner) ownerAccess = {...state.services};
        if (dialog.open) dialog.close();
        state.ready = true;
        state.adapter = ledgerAdapter(state,owner);
        accountChanged(state.adapter);
      },error => {
        if (!activeSession(state)) return;
        if (error.code === 'permission-denied') {
          void denySession(state,'accessRevoked');
        } else {
          state.watchFailed = true;
          setSyncReady(state,false);
          if (!state.adapter) showAccessStatus(copy,authError(copy,error),state,false,true);
        }
      }));
    });
  }

  async function checkAccess(state) {
    if (!activeSession(state)) return;
    const copy = messages[loginLanguage];
    if (!navigator.onLine) {
      setSyncReady(state,false);
      if (!state.adapter) showAccessStatus(copy,copy.offlineSignIn,state,false,true);
      return;
    }
    if (state.checking) {
      state.checkAgain = true;
      return;
    }
    const {authSdk,store,database} = state.services;
    const {user} = state;
    state.checking = true;
    if (!state.adapter) showAccessStatus(copy,copy.pending,state);
    try {
      if (state.exchange) {
        const result = await state.exchange.catch(() => null);
        state.exchange = undefined;
        state.newGoogleAccount = result?.user === user && authSdk.getAdditionalUserInfo(result)?.isNewUser;
        if (!activeSession(state)) return;
      }
      if (state.email && !state.owner && await authAccountRemoved(state)) {
        void revokeGrant(state.services,state.email,grant => grant.uid === user.uid).catch(() => {});
        await denySession(state,'accessRevoked');
        return;
      }
      await authSdk.reload(user);
      const token = await user.getIdTokenResult(true);
      if (!activeSession(state)) return;
      const email = normalizeEmail(token.claims.email);
      const verified = token.claims.email_verified === true && validEmail(email)
        && ['google.com','password'].includes(token.signInProvider);
      const profile = store.doc(database,'users',user.uid);
      const registered = (await store.getDocFromServer(profile)).data();
      if (!activeSession(state)) return;
      if (registered && (!verified || registered.email !== email)) {
        try {
          const removed = await revokeGrant(state.services,registered.email,grant => grant.uid === user.uid);
          if (!removed) await store.deleteDoc(profile);
        } finally {
          await denySession(state,'accessRevoked');
        }
        return;
      }
      if (!verified) {
        if (state.adapter) { await denySession(state,'accessRevoked'); return; }
        if (validEmail(email)) await checkEmailAccess(state.services,email,true);
        if (activeSession(state)) {
          showAccessStatus(copy,state.verificationSent ? copy.verificationSent : copy.confirmEmail,state,true);
        }
        return;
      }
      const ownerRef = store.doc(database,'accessOwners',user.uid);
      const owner = (await store.getDocFromServer(ownerRef)).exists();
      if (!activeSession(state)) return;
      if (!owner && !await completeInvitation(state,email,profile)) {
        await denySession(state,registered || state.email ? 'accessRevoked' : 'signupDenied');
        return;
      }
      if (!activeSession(state)) return;
      state.newGoogleAccount = false;
      const sameAccount = state.adapter && state.owner === owner && state.email === email;
      if (sameAccount && !state.watchFailed) {
        setSyncReady(state,navigator.onLine);
        return;
      }
      if (!sameAccount) hideAccount(state);
      stopAccessWatches(state);
      state.watchFailed = false;
      state.owner = owner;
      state.email = email;
      if (owner) {
        void store.setDoc(store.doc(database,'accessOwnerEmails',email),{uid:user.uid}).catch(() => {});
      }
      const grant = store.doc(database,'accessInvites',email);
      watchAccess(state,owner ? [[ownerRef,snapshot => snapshot.exists()]] : [
        [grant,snapshot => {
          const invite = snapshot.data();
          return invite?.allowed === true && invite.status === 'approved' && invite.uid === user.uid;
        }],
        [profile,snapshot => snapshot.data()?.email === email]
      ],owner);
      if (sameAccount) setSyncReady(state,navigator.onLine);
    } catch (error) {
      if (!activeSession(state)) return;
      setSyncReady(state,false);
      if (invalidAuth.has(error.code) || ['myledger/access-denied','permission-denied'].includes(error.code)) {
        if (state.email && !state.owner && ['auth/user-not-found','auth/user-disabled'].includes(error.code)) {
          void revokeGrant(state.services,state.email,grant => grant.uid === user.uid).catch(() => {});
        }
        await denySession(state,error.code === 'myledger/access-denied' && !state.email ? 'signupDenied' : 'accessRevoked');
      } else if (!state.adapter) {
        showAccessStatus(copy,authError(copy,error),state,false,true);
      }
    } finally {
      state.checking = false;
      if (state.checkAgain && activeSession(state)) {
        state.checkAgain = false;
        void checkAccess(state);
      }
    }
  }

  // Check the current Firebase Auth account before the SDK drops a disabled session.
  // Cleanup still uses the current user's authorization in Firestore.
  async function authAccountRemoved(state) {
    const idToken = await state.user.getIdToken();
    const base = emulator ? 'http://' + location.hostname + ':9099/identitytoolkit.googleapis.com'
      : 'https://identitytoolkit.googleapis.com';
    const response = await fetch(base + '/v1/accounts:lookup?key=' + encodeURIComponent(config.apiKey), {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({idToken})
    });
    const result = await response.json();
    if (!response.ok) return ['USER_NOT_FOUND','USER_DISABLED','EMAIL_NOT_FOUND'].includes(result.error?.message);
    if (!Array.isArray(result.users)) return false;
    const account = result.users.find(record => record.localId === state.user.uid);
    return !account || account.disabled === true;
  }

  function recheckSession() {
    if (session) void checkAccess(session);
  }
  document.addEventListener('visibilitychange',() => {
    if (document.visibilityState === 'visible') recheckSession();
  });
  window.addEventListener('online',() => {
    if (session) recheckSession();
    else if (supported) void connect().catch(() => {});
    const message = dialog.querySelector('#email-auth ~ #account-message');
    if (message?.textContent === messages[loginLanguage].offlineSignIn) {
      message.textContent = accessNotice ? messages[loginLanguage][accessNotice] : '';
    }
  });
  window.addEventListener('offline',() => {
    if (session) {
      setSyncReady(session,false);
      if (!session.adapter) void checkAccess(session);
    }
    const message = dialog.querySelector('#email-auth ~ #account-message');
    if (message) message.textContent = messages[loginLanguage].offlineSignIn;
  });
  window.setInterval(recheckSession,60000);

  function showAccessStatus(copy,text,state,unverified=false,retry=false) {
    if (dialog.open) dialog.close();
    dialog.classList.add('login-screen');
    dialog.innerHTML = `<div class="login-heading"><p class="login-brand">MyLedger</p><h1 id="account-title">${copy.title}</h1></div>
      <p id="account-message" role="status"></p>
      <div class="dialog-actions">
        ${unverified ? `<button class="btn primary" id="send-verification">${copy.sendVerification}</button>` : ''}
        ${unverified || retry ? `<button class="btn" id="retry-access">${copy.checkAgain}</button>` : ''}
        <button class="btn" id="other-account">${copy.signOut}</button>
      </div>`;
    dialog.setAttribute('aria-labelledby','account-title');
    const status = dialog.querySelector('#account-message');
    status.textContent = text;
    if (state.denied) {
      const backup = document.createElement('a');
      backup.id = 'unsynced-backup';
      backup.hidden = true;
      backup.textContent = copy.downloadUnsynced;
      dialog.append(backup);
      window.dispatchEvent(new CustomEvent('myledger-backup-link',{detail:backup}));
    }
    const {authSdk} = state.services;
    const {user} = state;
    const onClick = (selector,work) => dialog.querySelector(selector)?.addEventListener('click',async event => {
      const button = event.currentTarget;
      button.disabled = true;
      try { await work(); }
      catch (error) { status.textContent = authError(copy,error); }
      finally { button.disabled = false; }
    });
    onClick('#other-account',() => signOut(state));
    onClick('#send-verification',async () => {
      await checkEmailAccess(state.services,user.email,true);
      if (!activeSession(state) || !status.isConnected) return;
      await authSdk.sendEmailVerification(user);
      state.verificationSent = true;
      status.textContent = copy.verificationSent;
    });
    onClick('#retry-access',() => checkAccess(state));
    dialog.show();
  }

  async function signOut(state) {
    state.signingOut = true;
    try { await state.services.authSdk.signOut(state.services.auth); }
    finally { state.signingOut = false; }
  }

  function ledgerAdapter(state,canInvite) {
    const {store,database} = state.services;
    const {uid} = state.user;
    const reference = store.doc(database,'users',uid,'ledger','current');
    return {
      uid,canInvite,
      isReady: () => state.ready,
      deny: () => void denySession(state,'accessRevoked'),
      async load() {
        const snapshot = await store.getDocFromServer(reference);
        return snapshot.exists() ? snapshot.data() : {revision:0,payload:null};
      },
      async save(payload,expected) {
        return store.runTransaction(database,async transaction => {
          if (!activeSession(state) || !state.ready || !navigator.onLine) {
            throw Object.assign(new Error('Rechecking access'),{code:'myledger/access-pending'});
          }
          const snapshot = await transaction.get(reference);
          const saved = snapshot.data();
          const revision = saved?.revision ?? 0;
          if (revision === expected + 1 && saved.payload === payload) return revision;
          if (revision !== expected) {
            throw Object.assign(new Error('Ledger changed'),{code:'ledger-conflict'});
          }
          transaction.set(reference,{revision:expected + 1,payload});
          return expected + 1;
        });
      }
    };
  }

  const loginLanguageKey = 'myledger-login-language';
  let loginLanguage = 'en';
  try {
    if (localStorage.getItem(loginLanguageKey) === 'ar') loginLanguage = 'ar';
  } catch {}

  function showSignInForm(creating=false,initialEmail='') {
    let copy = messages[loginLanguage];
    const label = key => `<span data-login-label="${key}">${copy[key]}</span>`;
    const title = creating ? 'createAccount' : 'title';
    const submit = creating ? 'setPassword' : 'signIn';
    dialog.classList.add('login-screen');
    dialog.innerHTML = `<div class="login-heading"><div class="login-brand-row"><p class="login-brand">MyLedger</p><button type="button" class="btn" id="login-language"></button></div><h1 id="account-title">${label(title)}</h1></div>
      ${creating ? '' : `<div id="login-provider">
        <div id="google-sign-in" class="google-provider"></div>
        <div class="login-divider">${label('orEmail')}</div>
      </div>`}
      <form id="email-auth" class="fields">
        <label class="field full">${label('email')}<input name="email" type="email" dir="ltr" autocomplete="email" required></label>
        <label class="field full">${label('password')}<input name="password" type="password" autocomplete="${creating ? 'new-password' : 'current-password'}" required></label>
        <button class="btn primary" type="submit" id="login-submit">${label(submit)}</button>
        ${creating ? '' : `<button type="button" class="btn" id="reset-password">${label('resetPassword')}</button>`}
      </form>
      <div class="login-switch">${creating ? '' : label('firstTime')}
        <button type="button" id="create-account-toggle">${label(creating ? 'backToSignIn' : 'createAccount')}</button>
      </div>
      <p role="status" id="account-message"></p>
      <a id="unsynced-backup" hidden></a>`;
    dialog.setAttribute('aria-labelledby','account-title');
    const message = dialog.querySelector('#account-message');
    const google = dialog.querySelector('#google-sign-in');
    const form = dialog.querySelector('#email-auth');
    const address = form.elements.email;
    const createToggle = dialog.querySelector('#create-account-toggle');
    address.value = initialEmail;
    let googleIdentity;

    function applyLoginLanguage() {
      copy = messages[loginLanguage];
      document.documentElement.lang = loginLanguage;
      document.documentElement.dir = loginLanguage === 'ar' ? 'rtl' : 'ltr';
      dialog.querySelectorAll('[data-login-label]').forEach(node => {
        node.textContent = copy[node.dataset.loginLabel];
      });
      const toggle = dialog.querySelector('#login-language');
      toggle.textContent = loginLanguage === 'ar' ? 'English' : 'العربية';
      toggle.lang = loginLanguage === 'ar' ? 'en' : 'ar';
      message.textContent = !supported ? copy.origin : accessNotice ? copy[accessNotice]
        : !navigator.onLine ? copy.offlineSignIn : '';
      const backup = dialog.querySelector('#unsynced-backup');
      backup.textContent = copy.downloadUnsynced;
      window.dispatchEvent(new CustomEvent('myledger-backup-link',{detail:backup}));
    }

    function renderGoogleButton() {
      if (!googleIdentity || !google?.isConnected) return;
      google.replaceChildren();
      googleIdentity.renderButton(google,{theme:'outline',size:'large',locale:loginLanguage});
    }

    if (!supported) {
      createToggle.disabled = true;
      form.querySelectorAll('input,button').forEach(control => { control.disabled = true; });
    }

    createToggle.addEventListener('click',() => {
      if (handling) return;
      showSignInForm(!creating,address.value);
      dialog.querySelector('[name="email"]').focus();
    });

    async function withAuth(work,showError=error => authError(copy,error)) {
      if (handling) return;
      if (!navigator.onLine) { message.textContent = copy.offlineSignIn; return; }
      handling = true;
      const buttons = form.querySelectorAll('button');
      buttons.forEach(button => { button.disabled = true; });
      message.textContent = copy.pending;
      try {
        const services = await connect();
        if (!form.isConnected || services.auth.currentUser) return;
        await work(services);
      } catch (error) {
        message.textContent = showError(error);
      } finally {
        handling = false;
        buttons.forEach(button => { button.disabled = false; });
      }
    }

    if (supported && google) void loadGoogleIdentity().then(identity => {
      if (!google.isConnected) return;
      googleIdentity = identity;
      identity.initialize({
        client_id: googleClientId,
        callback: ({credential}) => {
          if (!google.isConnected || !credential) return;
          void withAuth(async services => {
            const {auth,authSdk} = services;
            await checkEmailAccess(services,googleEmail(credential));
            if (!google.isConnected || auth.currentUser) return;
            googleExchange = authSdk.signInWithCredential(auth,authSdk.GoogleAuthProvider.credential(credential));
            try { await googleExchange; }
            finally { googleExchange = undefined; }
          });
        }
      });
      renderGoogleButton();
    }).catch(error => {
      if (google.isConnected && !handling && !accessNotice) message.textContent = authError(copy,error);
    });

    form.addEventListener('submit',event => {
      event.preventDefault();
      const email = normalizeEmail(address.value);
      const password = form.elements.password.value;
      void withAuth(async services => {
        const {auth,authSdk} = services;
        await checkEmailAccess(services,email,creating);
        if (!form.isConnected || auth.currentUser) return;
        if (!creating) {
          await authSdk.signInWithEmailAndPassword(auth,email,password);
          return;
        }
        const {user} = await authSdk.createUserWithEmailAndPassword(auth,email,password);
        try {
          await checkEmailAccess(services,user.email,true);
          if (auth.currentUser !== user) return;
          await authSdk.sendEmailVerification(user);
          if (session?.user === user && auth.currentUser === user) {
            session.verificationSent = true;
            const status = dialog.querySelector('#account-message');
            if (dialog.querySelector('#send-verification')) status.textContent = copy.verificationSent;
          }
        } catch {
          // The verification screen lets the user retry sending the message.
        }
      },error => {
        const code = error.code;
        if (code === 'auth/email-already-in-use') return copy.signupExisting;
        if (['auth/invalid-credential','auth/user-not-found','auth/wrong-password'].includes(code)) return copy.useSignup;
        return authError(copy,error);
      });
    });

    dialog.querySelector('#reset-password')?.addEventListener('click',() => {
      const email = normalizeEmail(address.value);
      if (!validEmail(email)) {
        message.textContent = copy.resetEmail;
        address.focus();
        return;
      }
      void withAuth(async services => {
        try {
          await checkEmailAccess(services,email);
          await services.authSdk.sendPasswordResetEmail(services.auth,email);
        } catch (error) {
          if (!['myledger/access-denied','auth/user-not-found'].includes(error.code)) throw error;
        }
        message.textContent = copy.resetSent;
      });
    });

    applyLoginLanguage();
    dialog.querySelector('#login-language').addEventListener('click',() => {
      if (handling) return;
      loginLanguage = loginLanguage === 'ar' ? 'en' : 'ar';
      try { localStorage.setItem(loginLanguageKey,loginLanguage); } catch {}
      applyLoginLanguage();
      renderGoogleButton();
    });

    if (!dialog.open) dialog.show();
  }

  dialog.addEventListener('close',() => {
    if (!dialog.open) dialog.classList.remove('login-screen');
  });

  window.addEventListener('myledger-auth-request',async event => {
    if (handling || dialog.open) return;
    const copy = messages[event.detail] || messages.ar;
    if (!session) { showSignInForm(); return; }
    handling = true;
    try {
      await signOut(session);
    } catch {
      document.querySelector('#status').textContent = copy.out;
    } finally {
      handling = false;
    }
  });
  window.addEventListener('myledger-share-request',event => {
    if (!ownerAccess || dialog.open) return;
    const copy = messages[event.detail] || messages.ar;
    const access = ownerAccess;
    dialog.innerHTML = `<div class="dialog-title"><h2 id="account-title">${copy.share}</h2></div>
      <form id="invite" class="fields">
        <label class="field full" id="invite-email-field">${copy.recipient}<input name="recipient" type="email" dir="ltr" required></label>
        <button class="btn primary" type="submit">${copy.grant}</button>
      </form>
      <div class="dialog-actions">
        <form method="dialog"><button class="btn">${copy.close}</button></form>
      </div>
      <p role="status" id="share-message"></p>`;
    dialog.setAttribute('aria-labelledby','account-title');
    const form = dialog.querySelector('#invite');
    form.addEventListener('submit',async event => {
      event.preventDefault();
      const button = form.querySelector('button');
      const status = dialog.querySelector('#share-message');
      const recipient = normalizeEmail(form.elements.recipient.value);
      if (ownerAccess !== access || !validEmail(recipient)) {
        status.textContent = copy.inviteFailed;
        return;
      }
      if (button.disabled) return;
      button.disabled = true;
      try {
        const {store,database} = access;
        const grant = store.doc(database,'accessInvites',recipient);
        await store.runTransaction(database,async tx => {
          if ((await tx.get(grant)).exists()) return;
          const revocation = store.doc(database,'accessRevocations',recipient);
          if ((await tx.get(revocation)).exists()) throw new Error('Account removal pending');
          tx.set(grant,{allowed:true,status:'pending'});
        });
        status.textContent = copy.invited + ' ' + recipient;
      } catch {
        status.textContent = copy.inviteFailed;
      } finally {
        button.disabled = false;
      }
    });
    dialog.showModal();
  });
  window.addEventListener('myledger-authorized-request',event => {
    if (!ownerAccess || dialog.open) return;
    const access = ownerAccess;
    const {store,database} = access;
    const copy = messages[event.detail] || messages.ar;
    dialog.innerHTML = `<div class="dialog-title"><h2 id="account-title">${copy.authorized}</h2></div>
      <p id="authorized-status" role="status"></p>
      <div id="authorized-results" class="authorized-results"></div>
      <div class="dialog-actions">
        <button type="button" id="retry-authorized" class="btn" hidden>${copy.retry}</button>
        <form method="dialog"><button class="btn">${copy.close}</button></form>
      </div>`;
    dialog.setAttribute('aria-labelledby','account-title');
    const status = dialog.querySelector('#authorized-status');
    const results = dialog.querySelector('#authorized-results');
    const retry = dialog.querySelector('#retry-authorized');
    const stillOpen = () => ownerAccess === access && dialog.open && results.isConnected;
    const busy = new Set();
    const reconciling = new Set();
    let stops = [];
    let invites;
    let users;
    let revocations;

    async function removeAccess(email) {
      if (!revocationEnabled) throw new Error('revocation-unavailable');
      const token = await access.auth.currentUser.getIdToken(true);
      if (ownerAccess !== access) throw new Error('Account changed');
      const response = await fetch(revocationOrigin + '/revoke',{
        method:'POST',
        redirect:'error',
        headers:{Authorization:'Bearer ' + token,'Content-Type':'application/json'},
        body:JSON.stringify({email})
      });
      const result = await response.json();
      if (!response.ok || typeof result.accountDeleted !== 'boolean') throw new Error('Revocation failed');
    }

    function stopList() {
      stops.forEach(stop => stop());
      stops = [];
    }

    function section(title,recipients,stateLabel,stateDetail,removing=false) {
      const block = document.createElement('section');
      const heading = document.createElement('h3');
      heading.textContent = title;
      block.append(heading);
      if (!recipients.length) {
        const empty = document.createElement('p');
        empty.textContent = copy.listEmpty;
        block.append(empty);
        return block;
      }
      const list = document.createElement('ul');
      for (const recipient of recipients) {
        const item = document.createElement('li');
        const value = document.createElement('bdi');
        value.textContent = recipient;
        const state = document.createElement('span');
        state.className = 'access-state';
        const label = document.createElement('strong');
        label.textContent = stateLabel;
        const detail = document.createElement('small');
        detail.textContent = stateDetail;
        state.append(label,detail);
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'btn revoke-access';
        remove.textContent = removing ? copy.finishingRevocation : copy.revoke;
        remove.disabled = busy.has(recipient);
        remove.setAttribute('aria-label',remove.textContent + ' · ' + recipient);
        remove.addEventListener('click',async () => {
          if (!stillOpen() || busy.has(recipient)
              || !window.confirm(copy.revokeConfirm + ' ' + recipient + '?')) return;
          busy.add(recipient);
          remove.disabled = true;
          try {
            await removeAccess(recipient);
            if (stillOpen()) {
              status.textContent = copy.revoked + ' ' + recipient;
              dialog.querySelector('form[method="dialog"] button')?.focus();
            }
          } catch (error) {
            if (stillOpen()) status.textContent = error.message === 'revocation-unavailable'
              ? copy.revocationUnavailable : copy.revokeError;
          } finally {
            busy.delete(recipient);
            if (stillOpen()) renderList();
          }
        });
        item.append(value,state,remove);
        list.append(item);
      }
      block.append(list);
      return block;
    }

    function renderList() {
      if (!stillOpen() || !invites || !users || !revocations) return;
      const pending = [];
      const active = [];
      for (const entry of invites.docs) {
        const grant = entry.data();
        if (grant.allowed !== true || revocations.has(entry.id)) continue;
        if (grant.status !== 'approved') {
          pending.push(entry.id);
        } else if (users.get(grant.uid) === entry.id) {
          active.push(entry.id);
        } else if (!reconciling.has(entry.id) && !busy.has(entry.id)) {
          reconciling.add(entry.id);
          void revokeGrant(access,entry.id,(current,profile,email) =>
            current.status === 'approved' && current.uid === grant.uid && profile?.email !== email
          ).catch(() => {
            if (stillOpen()) {
              status.textContent = copy.revokeError;
              retry.hidden = false;
            }
          }).finally(() => reconciling.delete(entry.id));
        }
      }
      results.replaceChildren(
        section(copy.invitations,pending,copy.waiting,copy.waitingDetail),
        section(copy.users,active,copy.active,copy.activeDetail)
      );
      if (revocations.size) {
        results.append(section(copy.revoke,[...revocations],copy.finishingRevocation,copy.revocationPending,true));
      }
    }

    function loadAuthorized() {
      stopList();
      invites = users = undefined;
      revocations = revocationEnabled ? undefined : new Set();
      status.textContent = copy.listLoading;
      retry.hidden = true;
      const watch = (collection,receive) =>
        store.onSnapshot(store.collection(database,collection),{includeMetadataChanges:true},snapshot => {
          if (!stillOpen() || snapshot.metadata.fromCache || snapshot.metadata.hasPendingWrites) return;
          receive(snapshot);
          if (invites && users && revocations && status.textContent === copy.listLoading) status.textContent = '';
          renderList();
        },() => {
          if (!stillOpen()) return;
          results.replaceChildren();
          status.textContent = copy.listError;
          retry.hidden = false;
        });
      stops = [
        watch('accessInvites',snapshot => { invites = snapshot; }),
        watch('users',snapshot => { users = new Map(snapshot.docs.map(doc => [doc.id,doc.data().email])); })
      ];
      if (revocationEnabled) {
        stops.push(watch('accessRevocations',snapshot => { revocations = new Set(snapshot.docs.map(doc => doc.id)); }));
      }
    }

    retry.addEventListener('click',loadAuthorized);
    dialog.addEventListener('close',stopList,{once:true});
    dialog.showModal();
    loadAuthorized();
  });
  showSignInForm();
  if (supported) void connect().catch(() => {});
})();
