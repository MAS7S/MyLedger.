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
      revoke:'إزالة الوصول', revokeConfirm:'هل تريد إزالة الوصول لـ',
      revoked:'تمت إزالة الوصول لـ', revokeError:'تعذّرت إزالة الوصول. تأكّد من نشر قواعد Firestore المحدّثة ثم أعد المحاولة.',
      authorized:'المصرّح لهم', authorizedEmails:'الإيميلات', authorizedPhones:'أرقام الهاتف',
      listLoading:'جارٍ تحميل القائمة…', listEmpty:'ما فيه بيانات في هذه القائمة.',
      listError:'تعذّر تحميل القائمة. تأكّد من نشر قواعد Firestore الجديدة ثم أعد المحاولة.', retry:'إعادة المحاولة',
      title:'تسجيل الدخول', google:'الدخول بحساب Google', email:'البريد الإلكتروني', password:'كلمة المرور',
      signIn:'دخول بالبريد', 
      share:'منح الوصول إلى MyLedger', method:'نوع الإذن', recipient:'بريد الشخص المدعو', grant:'منح الوصول', copy:'نسخ رابط التطبيق',
      copied:'تم نسخ الرابط',
      phone:'الدخول برقم الهاتف', phoneNumber:'رقم الهاتف مع مفتاح الدولة', sendCode:'إرسال رمز التحقق',
      confirmCode:'تأكيد الرمز', code:'رمز التحقق', sent:'أدخل الرمز المرسل إلى رقمك.',
      sharePhone:'رقم الهاتف',
      close:'إغلاق', pending:'جارٍ التحقق من الدخول…', denied:'لا توجد دعوة مطابقة لهذا الحساب. استخدم البريد أو الرقم الذي وافق عليه المالك.',
      confirmEmail:'أكّد ملكية بريدك لمتابعة الدخول.', sendVerification:'إرسال رابط التأكيد',
      verificationSent:'أرسلنا رابط التأكيد. افتحه ثم اضغط «تحقّق مجددًا».', checkAgain:'تحقّق مجددًا',
      signOut:'استخدام حساب آخر', inviteFailed:'تعذّر منح الوصول.', invited:'تم منح الوصول لـ',
      origin:'افتح التطبيق من رابط HTTPS معتمد، أو استخدم محاكيات Firebase محليًا.',
      error:'تعذّر إكمال تسجيل الدخول', out:'تعذّر تسجيل الخروج'
    },
    en: {
      revoke:'Remove access', revokeConfirm:'Remove access for',
      revoked:'Access removed for', revokeError:'Could not remove access. Publish the updated Firestore rules and try again.',
      authorized:'Authorized people', authorizedEmails:'Email addresses', authorizedPhones:'Phone numbers',
      listLoading:'Loading approved entries…', listEmpty:'No approved entries in this list.',
      listError:'Could not load the list. Make sure the latest Firestore rules are published and try again.', retry:'Retry',
      title:'Sign in',google:'Sign in with Google',email:'Email',password:'Password',signIn:'Sign in by email',
      share:'Grant access to MyLedger', method:'Access method',recipient:'Invitee email',
      grant:'Grant access',copy:'Copy app link',copied:'Link copied',
      phone:'Sign in by phone', phoneNumber:'Phone number with country code', sendCode:'Send verification code',
      confirmCode:'Verify code', code:'Verification code', sent:'Enter the code sent to your phone.',
      sharePhone:'Phone number',
      close:'Close',pending:'Checking access…',denied:'No invitation matches this account. Use the email or phone number approved by the owner.',
      confirmEmail:'Verify your email address to continue.',sendVerification:'Send verification link',
      verificationSent:'Open the link in your inbox, then select Check again.',checkAgain:'Check again',
      signOut:'Use another account',inviteFailed:'Could not grant access.',invited:'Access granted to',
      origin:'Open the app on an authorized HTTPS origin or use the local Firebase emulators.',
      error:'Could not complete sign-in',out:'Could not sign out'
    }
  };
  const dialog = document.querySelector('#phone-auth');
  const emulator = ['localhost','127.0.0.1'].includes(location.hostname);
  const supported = location.protocol === 'https:' || (emulator && location.protocol === 'http:');
  let connection;
  let ownerAccess;
  let phoneVerifier;
  const phonePattern = /^[+][1-9][0-9]{7,14}$/;
  let accessCheck = 0;
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
      const services = {auth,authSdk,store,database};
      authSdk.onAuthStateChanged(auth,user => void checkAccess(services,user));
      return services;
    }).catch(error => {
      connection = undefined;
      throw error;
    });
    return connection;
  }

  function accountChanged(detail) {
    window.dispatchEvent(new CustomEvent('myledger-account',{detail}));
  }

  async function checkAccess(services,user) {
    const {auth,store,database} = services;
    const attempt = ++accessCheck;
    currentUser = user;
    ownerAccess = undefined;
    accountChanged(null);
    const copy = messages[document.documentElement.lang] || messages.ar;
    if (!user) {
      if (!dialog.open || !dialog.querySelector('#email-auth')) showSignInForm();
      return;
    }
    showAccessStatus(copy,copy.pending,services);
    try {
      const token = await user.getIdTokenResult();
      if (attempt !== accessCheck) return;
      const provider = token.signInProvider;
      const verifiedEmail = token.claims.email_verified === true;
      const phone = provider === 'phone' && token.claims.phone_number;
      if (!verifiedEmail && !phone) {
        showAccessStatus(copy,copy.confirmEmail,services,Boolean(user.email));
        return;
      }
      const owner = verifiedEmail && (await store.getDocFromServer(store.doc(database,'accessOwners',user.uid))).exists();
      const email = verifiedEmail && token.claims.email?.toLowerCase();
      const recipient = provider === 'google.com' && email && !email.includes('/') ? email : phone;
      const collection = phone ? 'accessPhoneInvites' : 'accessInvites';
      const invitation = !owner && recipient
        ? await store.getDocFromServer(store.doc(database,collection,recipient)) : null;
      if (attempt !== accessCheck) return;
      if (!owner && invitation?.data()?.allowed !== true) {
        showAccessStatus(copy,copy.denied,services);
        return;
      }
      if (owner) ownerAccess = {store,database};
      if (dialog.open) dialog.close();
      accountChanged(ledgerAdapter(store,database,auth,user.uid,owner));
    } catch (error) {
      if (attempt !== accessCheck) return;
      showAccessStatus(copy,[copy.error,error.code].filter(Boolean).join(' · '),services,false,true);
    }
  }

  function showAccessStatus(copy,text,services,unverified=false,retry=false) {
    if (dialog.open) dialog.close();
    dialog.classList.add('login-screen');
    dialog.innerHTML = `<div class="login-heading"><p class="login-brand">MyLedger</p><h1 id="phone-title">${copy.title}</h1></div>
      <p id="phone-message" role="status"></p>
      <div class="dialog-actions">
        ${unverified ? `<button class="btn primary" id="send-verification">${copy.sendVerification}</button>` : ''}
        ${unverified || retry ? `<button class="btn" id="retry-access">${copy.checkAgain}</button>` : ''}
        <button class="btn" id="other-account">${copy.signOut}</button>
      </div>`;
    dialog.setAttribute('aria-labelledby','phone-title');
    const status = dialog.querySelector('#phone-message');
    status.textContent = text;
    const {auth,authSdk} = services;
    const user = auth.currentUser;
    const onClick = (selector,work) => dialog.querySelector(selector)?.addEventListener('click',async event => {
      const button = event.currentTarget;
      button.disabled = true;
      try { await work(); }
      catch (error) { status.textContent = [copy.error,error.code].filter(Boolean).join(' · '); }
      finally { button.disabled = false; }
    });
    onClick('#other-account',() => authSdk.signOut(auth));
    onClick('#send-verification',async () => {
      await authSdk.sendEmailVerification(user);
      status.textContent = copy.verificationSent;
    });
    onClick('#retry-access',async () => {
      await authSdk.reload(user);
      await authSdk.getIdToken(user,true);
      if (auth.currentUser?.uid === user.uid) await checkAccess(services,user);
    });
    dialog.show();
  }

  function ledgerAdapter(store,database,auth,uid,canInvite) {
    const reference = store.doc(database,'users',uid,'ledger','current');
    let revision = 0;
    return {
      canInvite,
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

  const loginLanguageKey = 'myledger-login-language';
  let loginLanguage = 'en';
  try {
    if (localStorage.getItem(loginLanguageKey) === 'ar') loginLanguage = 'ar';
  } catch {}

  function showSignInForm() {
    let copy = messages[loginLanguage];
    const label = key => `<span data-login-label="${key}">${copy[key]}</span>`;
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
    }
    dialog.classList.add('login-screen');
    dialog.innerHTML = `<div class="login-heading"><div class="login-brand-row"><p class="login-brand">MyLedger</p><button type="button" class="btn" id="login-language"></button></div><h1 id="phone-title">${label('title')}</h1></div>
      <button class="btn google-sign-in" id="google-sign-in" type="button">
        <svg class="google-logo" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
          <path fill="#4285F4" d="M43.61 24.46c0-1.36-.12-2.71-.35-4.04H24v7.65h11.02a9.42 9.42 0 0 1-4.08 6.18v5.13h6.61c3.86-3.55 6.06-8.77 6.06-14.92z"/>
          <path fill="#34A853" d="M24 44c5.5 0 10.11-1.82 13.55-4.62l-6.61-5.13c-1.83 1.23-4.2 1.95-6.94 1.95-5.32 0-9.83-3.59-11.44-8.42H5.74v5.29A20 20 0 0 0 24 44z"/>
          <path fill="#FBBC05" d="M12.56 27.78a12 12 0 0 1 0-7.56v-5.29H5.74a20 20 0 0 0 0 18.14z"/>
          <path fill="#EA4335" d="M24 11.8c3 0 5.69 1.04 7.8 3.05l5.85-5.85A19.16 19.16 0 0 0 24 4 20 20 0 0 0 5.74 14.93l6.82 5.29C14.17 15.39 18.68 11.8 24 11.8z"/>
        </svg>
        <span>${label('google')}</span>
      </button>
      <form id="email-auth" class="fields">
        <label class="field full">${label('email')}<input name="email" type="email" dir="ltr" autocomplete="email" required></label>
        <label class="field full">${label('password')}<input name="password" type="password" autocomplete="current-password" required></label>
        <button class="btn primary" type="submit" value="sign-in">${label('signIn')}</button>
      </form>
      <details class="auth-phone"><summary>${label('phone')}</summary>
        <form id="phone-send" class="fields">
          <label class="field full">${label('phoneNumber')}<input name="phone" type="tel" dir="ltr" autocomplete="tel" placeholder="+16505553434" pattern="[+][1-9][0-9]{7,14}" required></label>
          <div id="phone-captcha" class="full"></div>
          <button class="btn primary" type="submit">${label('sendCode')}</button>
        </form>
        <form id="phone-verify" class="fields" hidden>
          <label class="field full">${label('code')}<input name="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" required></label>
          <button class="btn primary" type="submit">${label('confirmCode')}</button>
        </form>
      </details>
      <p role="status" id="phone-message"></p>`;
    dialog.setAttribute('aria-labelledby','phone-title');
    const message = dialog.querySelector('#phone-message');
    const google = dialog.querySelector('#google-sign-in');
    const email = dialog.querySelector('#email-auth');
    if (!supported) {
      google.disabled = true;
      email.querySelectorAll('input,button').forEach(control => { control.disabled = true; });
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
        await authSdk.signInWithEmailAndPassword(auth,email.elements.email.value.trim(),email.elements.password.value);
      } catch (error) {
        message.textContent = [copy.error,error.code].filter(Boolean).join(' · ');
      } finally {
        handling = false;
        buttons.forEach(button => { button.disabled = false; });
      }
    });
    applyLoginLanguage();
    dialog.querySelector('#login-language').addEventListener('click',() => {
      if (handling) return;
      loginLanguage = loginLanguage === 'ar' ? 'en' : 'ar';
      try { localStorage.setItem(loginLanguageKey,loginLanguage); } catch {}
      applyLoginLanguage();
      message.textContent = !supported ? copy.origin : dialog.querySelector('#phone-verify').hidden ? '' : copy.sent;
    });
    if (supported) wirePhoneForms(() => copy,message);
    else dialog.querySelector('details').hidden = true;
    dialog.show();
  }

  function wirePhoneForms(getCopy,message) {
    const send = dialog.querySelector('#phone-send');
    const verify = dialog.querySelector('#phone-verify');
    let confirmation;
    const onSubmit = (form,work) => form.addEventListener('submit',async event => {
      event.preventDefault();
      if (handling) return;
      const button = form.querySelector('button');
      handling = true;
      button.disabled = true;
      try { await work(); }
      catch (error) { message.textContent = [getCopy().error,error.code].filter(Boolean).join(' · '); }
      finally { handling = false; button.disabled = false; }
    });
    onSubmit(send,async () => {
      const {auth,authSdk} = await connect();
      if (!send.isConnected || auth.currentUser) return;
      phoneVerifier?.clear();
      phoneVerifier = new authSdk.RecaptchaVerifier(auth,'phone-captcha',{size:'invisible'});
      confirmation = await authSdk.signInWithPhoneNumber(auth,send.elements.phone.value,phoneVerifier);
      send.hidden = true;
      verify.hidden = false;
      message.textContent = getCopy().sent;
      verify.elements.code.focus();
    });
    onSubmit(verify,() => confirmation.confirm(verify.elements.code.value));
  }

  dialog.addEventListener('close',() => {
    phoneVerifier?.clear();
    phoneVerifier = undefined;
    if (!dialog.open) dialog.classList.remove('login-screen');
  });

  window.addEventListener('myledger-auth-request',async event => {
    if (handling || dialog.open) return;
    const copy = messages[event.detail] || messages.ar;
    if (!currentUser) { showSignInForm(); return; }
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
    if (!ownerAccess || location.protocol !== 'https:' || dialog.open) return;
    const copy = messages[event.detail] || messages.ar;
    const access = ownerAccess;
    const url = new URL(location.href);
    url.search = '';
    url.hash = '';
    const appUrl = url.href;
    dialog.innerHTML = `<div class="dialog-title"><h2 id="phone-title">${copy.share}</h2></div>
      <form id="invite" class="fields">
        <label class="field full">${copy.method}<select name="method">
          <option value="email">${copy.email}</option><option value="phone">${copy.sharePhone}</option>
        </select></label>
        <label class="field full" id="invite-phone-field" hidden>${copy.phoneNumber}<input name="phone" type="tel" dir="ltr" pattern="[+][1-9][0-9]{7,14}" required disabled></label>
        <label class="field full" id="invite-email-field">${copy.recipient}<input name="recipient" type="email" dir="ltr" required></label>
        <button class="btn primary" type="submit">${copy.grant}</button>
      </form>
      <div class="dialog-actions">
        <button class="btn" id="copy-link" type="button">${copy.copy}</button>
        <form method="dialog"><button class="btn">${copy.close}</button></form>
      </div>
      <p role="status" id="share-message"></p>`;
    dialog.setAttribute('aria-labelledby','phone-title');
    const form = dialog.querySelector('#invite');
    function updateInviteMethod() {
      const phone = form.elements.method.value === 'phone';
      dialog.querySelector('#invite-phone-field').hidden = !phone;
      dialog.querySelector('#invite-email-field').hidden = phone;
      form.elements.phone.disabled = !phone;
      form.elements.recipient.disabled = phone;
    }
    form.elements.method.addEventListener('change',updateInviteMethod);
    updateInviteMethod();
    form.addEventListener('submit',async event => {
      event.preventDefault();
      const button = form.querySelector('button');
      const status = dialog.querySelector('#share-message');
      const byPhone = form.elements.method.value === 'phone';
      const recipient = byPhone ? form.elements.phone.value.trim() : form.elements.recipient.value.trim().toLowerCase();
      if (ownerAccess !== access || (byPhone ? !phonePattern.test(recipient) : recipient.includes('/') || recipient.length > 254)) {
        status.textContent = copy.inviteFailed;
        return;
      }
      const {store,database} = access;
      if (button.disabled) return;
      button.disabled = true;
      try {
        await store.setDoc(store.doc(database,byPhone ? 'accessPhoneInvites' : 'accessInvites',recipient),{allowed:true});
        status.textContent = copy.invited + ' ' + recipient;
      } catch {
        status.textContent = copy.inviteFailed;
      } finally {
        button.disabled = false;
      }
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
  window.addEventListener('myledger-authorized-request',event => {
    if (!ownerAccess || dialog.open) return;
    const access = ownerAccess;
    const {store,database} = access;
    const copy = messages[event.detail] || messages.ar;
    const collections = [
      ['accessInvites',copy.authorizedEmails],
      ['accessPhoneInvites',copy.authorizedPhones]
    ];
    dialog.innerHTML = `<div class="dialog-title"><h2 id="phone-title">${copy.authorized}</h2></div>
      <p id="authorized-status" role="status"></p>
      <div id="authorized-results" class="authorized-results"></div>
      <div class="dialog-actions">
        <button type="button" id="retry-authorized" class="btn" hidden>${copy.retry}</button>
        <form method="dialog"><button class="btn">${copy.close}</button></form>
      </div>`;
    dialog.setAttribute('aria-labelledby','phone-title');
    const status = dialog.querySelector('#authorized-status');
    const results = dialog.querySelector('#authorized-results');
    const retry = dialog.querySelector('#retry-authorized');
    const stillOpen = () => ownerAccess === access && dialog.open && results.isConnected;

    async function loadAuthorized() {
      status.textContent = copy.listLoading;
      retry.hidden = true;
      try {
        const snapshots = await Promise.all(collections.map(([name]) =>
          store.getDocsFromServer(store.collection(database,name))));
        if (!stillOpen()) return;
        for (const [index,snapshot] of snapshots.entries()) {
          const section = document.createElement('section');
          const heading = document.createElement('h3');
          heading.textContent = collections[index][1];
          section.append(heading);
          const recipients = snapshot.docs.filter(entry => entry.data().allowed === true)
            .map(entry => entry.id).sort((a,b) => a.localeCompare(b));
          const list = document.createElement(recipients.length ? 'ul' : 'p');
          if (recipients.length) {
            for (const recipient of recipients) {
              const item = document.createElement('li');
              const value = document.createElement('bdi');
              value.dir = 'ltr';
              value.textContent = recipient;
              const remove = document.createElement('button');
              remove.type = 'button';
              remove.className = 'btn revoke-access';
              remove.textContent = copy.revoke;
              remove.setAttribute('aria-label', copy.revoke + ' · ' + recipient);
              remove.addEventListener('click', async () => {
                if (!stillOpen() || remove.disabled ||
                    !window.confirm(copy.revokeConfirm + ' ' + recipient + '?')) return;

                remove.disabled = true;
                status.textContent = '';
                try {
                  const [collection] = collections[index];
                  await store.deleteDoc(store.doc(database,collection,recipient));
                  if (!stillOpen()) return;
                  const next = item.nextElementSibling || item.previousElementSibling;
                  item.remove();
                  if (!list.childElementCount) {
                    const empty = document.createElement('p');
                    empty.textContent = copy.listEmpty;
                    list.replaceWith(empty);
                  }
                  const focusTarget = next?.querySelector('button') || dialog.querySelector('form[method="dialog"] button');
                  focusTarget?.focus();
                  status.textContent = copy.revoked + ' ' + recipient;
                } catch {
                  if (stillOpen()) {
                    status.textContent = copy.revokeError;
                    remove.disabled = false;
                  }
                }
              });
              item.append(value,remove);
              list.append(item);
            }
          } else {
            list.textContent = copy.listEmpty;
          }
          section.append(list);
          results.append(section);
        }
        status.textContent = '';
      } catch {
        if (!stillOpen()) return;
        results.replaceChildren();
        status.textContent = copy.listError;
        retry.hidden = false;
      }
    }
    retry.addEventListener('click',loadAuthorized);
    dialog.addEventListener('close',() => results.replaceChildren(),{once:true});
    dialog.showModal();
    void loadAuthorized();
  });
  showSignInForm();
  if (supported) void connect().catch(() => {});
})();
