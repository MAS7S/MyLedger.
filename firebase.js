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
      title:'الدخول بالجوال', phone:'رقم الجوال بالصيغة الدولية', code:'رمز التحقق',
      send:'إرسال الرمز', verify:'تأكيد', close:'إغلاق', pending:'جارٍ الاتصال بـ Firebase…',
      sent:'أدخل رمز التحقق. لرقم الاختبار، استخدم الرمز المحفوظ في Firebase.',
      origin:'افتح التطبيق من رابط HTTPS معتمد، أو استخدم محاكيات Firebase محليًا.',
      error:'تعذّر إكمال تسجيل الدخول', out:'تعذّر تسجيل الخروج'
    },
    en: {
      title:'Phone sign-in',phone:'Phone number in international format',code:'Verification code',
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

  function showPhoneForm(copy) {
    dialog.innerHTML = `<div class="dialog-title"><h2 id="phone-title">${copy.title}</h2></div>
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
      <p role="status" id="phone-message"></p>
      <form method="dialog" class="dialog-actions"><button class="btn">${copy.close}</button></form>`;
    dialog.setAttribute('aria-labelledby','phone-title');
    const message = dialog.querySelector('#phone-message');
    const send = dialog.querySelector('#phone-send');
    const verify = dialog.querySelector('#phone-verify');
    let confirmation;
    if (!supported) {
      send.hidden = true;
      message.textContent = copy.origin;
    }
    send.addEventListener('submit',async event => {
      event.preventDefault();
      const button = send.querySelector('button');
      if (button.disabled) return;
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
        button.disabled = false;
      }
    });
    verify.addEventListener('submit',async event => {
      event.preventDefault();
      const button = verify.querySelector('button');
      if (button.disabled) return;
      button.disabled = true;
      try {
        await confirmation.confirm(verify.elements.code.value);
      } catch (error) {
        message.textContent = [copy.error,error.code].filter(Boolean).join(' · ');
      } finally {
        button.disabled = false;
      }
    });
    dialog.showModal();
  }

  dialog.addEventListener('close',() => {
    verifier?.clear();
    verifier = undefined;
  });

  window.addEventListener('myledger-auth-request',async event => {
    if (handling || dialog.open) return;
    const copy = messages[event.detail] || messages.ar;
    if (!currentUser) { showPhoneForm(copy); return; }
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
  if (supported) void connect().catch(() => {});
})();
