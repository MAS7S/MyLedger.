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

  const messages = {
    ar: {
      title:'تسجيل الدخول', google:'الدخول بحساب Google', email:'البريد الإلكتروني', password:'كلمة المرور',
      signIn:'دخول بالبريد', create:'إنشاء حساب', phoneTitle:'الدخول بالجوال',
      share:'مشاركة MyLedger', recipient:'بريد الشخص المدعو', draft:'فتح رسالة الدعوة', copy:'نسخ رابط التطبيق',
      copied:'تم نسخ الرابط', subject:'جرّب MyLedger',
      invitation:'جرّب MyLedger لتسجيل مصاريفك. افتح الرابط وأنشئ حسابك الخاص:',
      phone:'رقم الجوال بالصيغة الدولية', code:'رمز التحقق',
      send:'إرسال الرمز', verify:'تأكيد', close:'إغلاق', pending:'جارٍ الاتصال بـ Firebase…',
      sent:'أدخل رمز التحقق. لرقم الاختبار، استخدم الرمز المحفوظ في Firebase.',
      origin:'افتح التطبيق من رابط HTTPS معتمد، أو استخدم محاكيات Firebase محليًا.',
      error:'تعذّر إكمال تسجيل الدخول', out:'تعذّر تسجيل الخروج'
    },
    en: {
      title:'Sign in',google:'Sign in with Google',email:'Email',password:'Password',signIn:'Sign in by email',
      create:'Create account',phoneTitle:'Phone sign-in',share:'Share MyLedger',recipient:'Invitee email',
      draft:'Open invitation email',copy:'Copy app link',copied:'Link copied',subject:'Try MyLedger',
      invitation:'Try MyLedger to track your expenses. Open this link and create your own account:',
      phone:'Phone number in international format',code:'Verification code',
      send:'Send code',verify:'Verify',close:'Close',pending:'Connecting to Firebase…',
      sent:'Enter the verification code. For a test phone number, use the code saved in Firebase.',
      origin:'Open the app on an authorized HTTPS origin or use the local Firebase emulators.',
      error:'Could not complete sign-in',out:'Could not sign out'
    }
  };
  const dialog = document.querySelector('#phone-auth');
  const emulator = ['localhost','127.0.0.1'].includes(location.hostname);
  const supported = location.protocol === 'https:' || (emulator && location.protocol === 'http:');
  let connection;
  let verifier;
  let handling = false;
  let currentUser;

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
      authSdk.onAuthStateChanged(auth,user => {
        currentUser = user;
        if (user && dialog.open) dialog.close();
        window.dispatchEvent(new CustomEvent('myledger-account', {
          detail: user ? ledgerAdapter(store,database,auth,user.uid) : null
        }));
        if (!user && !dialog.open) showSignInForm(messages[document.documentElement.lang] || messages.ar);
      });
      return {auth,authSdk};
    }).catch(error => {
      connection = undefined;
      throw error;
    });
    return connection;
  }

  function ledgerAdapter(store,database,auth,uid) {
    const reference = store.doc(database,'users',uid,'ledger','current');
    let revision = 0;
    return {
      async load() {
        const snapshot = await store.getDocFromServer(reference);
        revision = snapshot.exists() ? snapshot.data().revision : 0;
        return snapshot.exists() ? snapshot.data().payload : null;
      },
      async save(payload) {
        if (new TextEncoder().encode(payload).length > 700000) {
          throw Object.assign(new Error('Ledger too large'),{code:'ledger-limit'});
        }
        const expected = revision;
        await store.runTransaction(database,async transaction => {
          if (auth.currentUser?.uid !== uid) throw new Error('Account changed');
          const snapshot = await transaction.get(reference);
          if ((snapshot.exists() ? snapshot.data().revision : 0) !== expected) {
            throw Object.assign(new Error('Ledger changed'),{code:'ledger-conflict'});
          }
          transaction.set(reference,{revision:expected + 1,payload});
        });
        revision = expected + 1;
      }
    };
  }

  function showSignInForm(copy) {
    dialog.classList.add('login-screen');
    dialog.innerHTML = `<div class="login-heading"><p class="login-brand">MyLedger</p><h1 id="phone-title">${copy.title}</h1></div>
      <button class="btn google-sign-in" id="google-sign-in" type="button">
        <svg class="google-logo" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
          <path fill="#4285F4" d="M43.61 24.46c0-1.36-.12-2.71-.35-4.04H24v7.65h11.02a9.42 9.42 0 0 1-4.08 6.18v5.13h6.61c3.86-3.55 6.06-8.77 6.06-14.92z"/>
          <path fill="#34A853" d="M24 44c5.5 0 10.11-1.82 13.55-4.62l-6.61-5.13c-1.83 1.23-4.2 1.95-6.94 1.95-5.32 0-9.83-3.59-11.44-8.42H5.74v5.29A20 20 0 0 0 24 44z"/>
          <path fill="#FBBC05" d="M12.56 27.78a12 12 0 0 1 0-7.56v-5.29H5.74a20 20 0 0 0 0 18.14z"/>
          <path fill="#EA4335" d="M24 11.8c3 0 5.69 1.04 7.8 3.05l5.85-5.85A19.16 19.16 0 0 0 24 4 20 20 0 0 0 5.74 14.93l6.82 5.29C14.17 15.39 18.68 11.8 24 11.8z"/>
        </svg>
        <span>${copy.google}</span>
      </button>
      <form id="email-auth" class="fields">
        <label class="field full">${copy.email}<input name="email" type="email" dir="ltr" autocomplete="email" required></label>
        <label class="field full">${copy.password}<input name="password" type="password" autocomplete="current-password" required></label>
        <button class="btn primary" type="submit" value="sign-in">${copy.signIn}</button>
        <button class="btn" type="submit" value="create">${copy.create}</button>
      </form>
      <details class="auth-phone"><summary>${copy.phoneTitle}</summary>
      <form id="phone-send" class="fields">
        <label class="field full">${copy.phone}<input type="tel" name="phone" dir="ltr"
          autocomplete="tel" placeholder="+16505553434" pattern="\\+[1-9][0-9]{7,14}" required></label>
        <div class="full" id="phone-captcha"></div>
        <button class="btn primary" type="submit">${copy.send}</button>
      </form>
      <form id="phone-verify" class="fields" hidden>
        <label class="field full">${copy.code}<input name="code" dir="ltr" inputmode="numeric"
          autocomplete="one-time-code" pattern="[0-9]{6}" required></label>
        <button class="btn primary" type="submit">${copy.verify}</button>
      </form>
      </details>
      <p role="status" id="phone-message"></p>`;
    dialog.setAttribute('aria-labelledby','phone-title');
    const message = dialog.querySelector('#phone-message');
    const google = dialog.querySelector('#google-sign-in');
    const email = dialog.querySelector('#email-auth');
    const send = dialog.querySelector('#phone-send');
    const verify = dialog.querySelector('#phone-verify');
    let confirmation;
    if (!supported) {
      google.disabled = true;
      email.querySelectorAll('input,button').forEach(control => { control.disabled = true; });
      dialog.querySelector('details').hidden = true;
      message.textContent = copy.origin;
    }
    google.addEventListener('click',async () => {
      if (handling || !supported) return;
      handling = true;
      google.disabled = true;
      message.textContent = copy.pending;
      try {
        const {auth,authSdk} = await connect();
        if (!dialog.open || !google.isConnected || auth.currentUser) return;
        await authSdk.signInWithPopup(auth,new authSdk.GoogleAuthProvider());
      } catch (error) {
        message.textContent = error.code === 'auth/popup-closed-by-user'
          ? '' : [copy.error,error.code].filter(Boolean).join(' · ');
      } finally {
        handling = false;
        google.disabled = false;
      }
    });
    email.addEventListener('submit',async event => {
      event.preventDefault();
      if (handling) return;
      handling = true;
      const buttons = email.querySelectorAll('button');
      buttons.forEach(button => { button.disabled = true; });
      message.textContent = copy.pending;
      try {
        const {auth,authSdk} = await connect();
        if (!dialog.open || !email.isConnected || auth.currentUser) return;
        const method = event.submitter?.value === 'create'
          ? authSdk.createUserWithEmailAndPassword : authSdk.signInWithEmailAndPassword;
        await method(auth,email.elements.email.value.trim(),email.elements.password.value);
      } catch (error) {
        message.textContent = [copy.error,error.code].filter(Boolean).join(' · ');
      } finally {
        handling = false;
        buttons.forEach(button => { button.disabled = false; });
      }
    });
    send.addEventListener('submit',async event => {
      event.preventDefault();
      const button = send.querySelector('button');
      if (handling) return;
      handling = true;
      button.disabled = true;
      message.textContent = copy.pending;
      try {
        const {auth,authSdk} = await connect();
        if (!dialog.open || !send.isConnected || auth.currentUser) return;
        verifier = new authSdk.RecaptchaVerifier(auth,'phone-captcha',{size:'invisible'});
        confirmation = await authSdk.signInWithPhoneNumber(auth,send.elements.phone.value,verifier);
        send.hidden = true;
        verify.hidden = false;
        message.textContent = copy.sent;
        verify.elements.code.focus();
      } catch (error) {
        verifier?.clear();
        verifier = undefined;
        message.textContent = [copy.error,error.code].filter(Boolean).join(' · ');
      } finally {
        handling = false;
        button.disabled = false;
      }
    });
    verify.addEventListener('submit',async event => {
      event.preventDefault();
      const button = verify.querySelector('button');
      if (handling) return;
      handling = true;
      button.disabled = true;
      try {
        await confirmation.confirm(verify.elements.code.value);
      } catch (error) {
        message.textContent = [copy.error,error.code].filter(Boolean).join(' · ');
      } finally {
        handling = false;
        button.disabled = false;
      }
    });
    dialog.show();
  }

  dialog.addEventListener('close',() => {
    dialog.classList.remove('login-screen');
    verifier?.clear();
    verifier = undefined;
  });

  window.addEventListener('myledger-auth-request',async event => {
    if (handling || dialog.open) return;
    const copy = messages[event.detail] || messages.ar;
    if (!currentUser) { showSignInForm(copy); return; }
    handling = true;
    try {
      const {auth,authSdk} = await connect();
      await authSdk.signOut(auth);
    } catch {
      document.querySelector('#status').textContent = copy.out;
    } finally {
      handling = false;
    }
  });
  window.addEventListener('myledger-share-request',event => {
    if (!currentUser || location.protocol !== 'https:' || dialog.open) return;
    const copy = messages[event.detail] || messages.ar;
    const url = new URL(location.href);
    url.search = '';
    url.hash = '';
    const appUrl = url.href;
    dialog.innerHTML = `<div class="dialog-title"><h2 id="phone-title">${copy.share}</h2></div>
      <form id="invite" class="fields">
        <label class="field full">${copy.recipient}<input name="recipient" type="email" dir="ltr" required></label>
        <button class="btn primary" type="submit">${copy.draft}</button>
      </form>
      <div class="dialog-actions">
        <button class="btn" id="copy-link" type="button">${copy.copy}</button>
        <form method="dialog"><button class="btn">${copy.close}</button></form>
      </div>
      <p role="status" id="share-message"></p>`;
    dialog.setAttribute('aria-labelledby','phone-title');
    const form = dialog.querySelector('#invite');
    form.addEventListener('submit',event => {
      event.preventDefault();
      const to = encodeURIComponent(form.elements.recipient.value.trim());
      const subject = encodeURIComponent(copy.subject);
      const body = encodeURIComponent(copy.invitation + '\n\n' + appUrl);
      location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    });
    dialog.querySelector('#copy-link').addEventListener('click',async () => {
      const status = dialog.querySelector('#share-message');
      try {
        await navigator.clipboard.writeText(appUrl);
        status.textContent = copy.copied;
      } catch {
        status.textContent = appUrl;
      }
    });
    dialog.showModal();
  });
  showSignInForm(messages[document.documentElement.lang] || messages.ar);
  if (supported) void connect().catch(() => {});
})();
