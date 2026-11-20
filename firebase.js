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
      createAccount:'إنشاء حساب', firstTime:'أول مرة؟', setPassword:'تعيين كلمة المرور', backToSignIn:'العودة لتسجيل الدخول', orEmail:'أو استخدم البريد الإلكتروني', signupDenied:'هذا البريد غير مصرح له من قبل المالك.', useSignup:'تحقّق من كلمة المرور، أو اضغط إنشاء حساب إذا كانت هذه أول مرة. إذا سبق ودخلت بحساب Google، استخدمه مجددًا.', signupExisting:'هذا الحساب موجود. سجّل الدخول بكلمة المرور أو باستخدام Google.',
      accessRevoked:'تم إلغاء الوصول. تواصل مع المالك للحصول على صلاحية الوصول.',
      revoke:'إزالة الوصول', revokeConfirm:'هل تريد إزالة الوصول لـ',
      revoked:'تمت إزالة الوصول لـ', revokeError:'تعذّرت إزالة الوصول. تأكّد من نشر قواعد Firestore المحدّثة ثم أعد المحاولة.',
      authorized:'المصرّح لهم', authorizedEmails:'الإيميلات',
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
      accessRevoked:'Access revoked. Contact the owner for access.',
      revoke:'Remove access', revokeConfirm:'Remove access for',
      revoked:'Access removed for', revokeError:'Could not remove access. Publish the updated Firestore rules and try again.',
      authorized:'Authorized people', authorizedEmails:'Email addresses',
      listLoading:'Loading approved entries…', listEmpty:'No approved entries in this list.',
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
  let ownerAccess;
  let accessCheck = 0;
  let stopAccessWatch;
  let accessNotice;
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
    stopAccessWatch?.();
    stopAccessWatch = undefined;
    currentUser = user;
    ownerAccess = undefined;
    accountChanged(null);
    const copy = messages[document.documentElement.lang] || messages.ar;
    if (!user) {
      if (accessNotice || !dialog.open || !dialog.querySelector('#email-auth')) showSignInForm();
      return;
    }
    accessNotice = undefined;
    showAccessStatus(copy,copy.pending,services);
    try {
      const token = await user.getIdTokenResult();
      if (attempt !== accessCheck) return;
      const provider = token.signInProvider;
      if (!['google.com','password'].includes(provider)) {
        showAccessStatus(copy,copy.denied,services);
        return;
      }
      const verifiedEmail = token.claims.email_verified === true;
      if (!verifiedEmail) {
        showAccessStatus(copy,copy.confirmEmail,services,Boolean(user.email));
        return;
      }
      const ownerRef = store.doc(database,'accessOwners',user.uid);
      const owner = verifiedEmail && (await store.getDocFromServer(ownerRef)).exists();
      if (attempt !== accessCheck) return;
      const email = verifiedEmail && token.claims.email?.trim().toLowerCase();
      const recipient = email && !email.includes('/') ? email : null;
      if (!owner && !recipient) {
        showAccessStatus(copy,copy.denied,services);
        return;
      }
      const permission = owner ? ownerRef : store.doc(database,'accessInvites',recipient);
      let active = false;
      let authorized = false;

      const revoke = async () => {
        if (attempt !== accessCheck) return;
        ++accessCheck;
        stopAccessWatch?.();
        stopAccessWatch = undefined;
        ownerAccess = undefined;
        accessNotice = authorized ? 'accessRevoked' : 'signupDenied';
        accountChanged(null);
        showSignInForm();
        try { await services.authSdk.signOut(auth); }
        catch (error) {
          if (auth.currentUser?.uid === user.uid) {
            showAccessStatus(copy,copy[accessNotice],services);
          }
        }
      };
      stopAccessWatch = store.onSnapshot(permission,{includeMetadataChanges:true},snapshot => {
        if (attempt !== accessCheck || snapshot.metadata.hasPendingWrites) return;
        if (snapshot.metadata.fromCache) {
          if (active) {
            active = false;
            ownerAccess = undefined;
            accountChanged(null);
            showAccessStatus(copy,copy.pending,services,false,true);
          }
          return;
        }
        if (owner ? !snapshot.exists() : snapshot.data()?.allowed !== true) {
          void revoke();
          return;
        }
        if (active) return;
        active = authorized = true;
        if (owner) ownerAccess = {store,database};
        if (dialog.open) dialog.close();
        accountChanged(ledgerAdapter(store,database,auth,user.uid,owner));
      },error => {
        if (attempt !== accessCheck) return;
        if (error.code === 'permission-denied') {
          void revoke();
          return;
        }
        ownerAccess = undefined;
        accountChanged(null);
        showAccessStatus(copy,[copy.error,error.code].filter(Boolean).join(' · '),services,false,true);
      });
    } catch (error) {
      if (attempt !== accessCheck) return;
      showAccessStatus(copy,[copy.error,error.code].filter(Boolean).join(' · '),services,false,true);
    }
  }

  function showAccessStatus(copy,text,services,unverified=false,retry=false) {
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
    let creating = false;
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
      dialog.querySelector('#account-title').textContent = creating ? copy.createAccount : copy.title;
      dialog.querySelector('#login-submit').textContent = creating ? copy.setPassword : copy.title;
      dialog.querySelector('#login-provider').hidden = creating;
      dialog.querySelector('#first-time-label').hidden = creating;
      dialog.querySelector('#create-account-toggle').textContent = creating ? copy.backToSignIn : copy.createAccount;
      email.elements.password.autocomplete = creating ? 'new-password' : 'current-password';
    }
    dialog.classList.add('login-screen');
    dialog.innerHTML = `<div class="login-heading"><div class="login-brand-row"><p class="login-brand">MyLedger</p><button type="button" class="btn" id="login-language"></button></div><h1 id="account-title">${label('title')}</h1></div>
      <div id="login-provider">
      <button class="btn google-sign-in" id="google-sign-in" type="button">
        <svg class="google-logo" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
          <path fill="#4285F4" d="M43.61 24.46c0-1.36-.12-2.71-.35-4.04H24v7.65h11.02a9.42 9.42 0 0 1-4.08 6.18v5.13h6.61c3.86-3.55 6.06-8.77 6.06-14.92z"/>
          <path fill="#34A853" d="M24 44c5.5 0 10.11-1.82 13.55-4.62l-6.61-5.13c-1.83 1.23-4.2 1.95-6.94 1.95-5.32 0-9.83-3.59-11.44-8.42H5.74v5.29A20 20 0 0 0 24 44z"/>
          <path fill="#FBBC05" d="M12.56 27.78a12 12 0 0 1 0-7.56v-5.29H5.74a20 20 0 0 0 0 18.14z"/>
          <path fill="#EA4335" d="M24 11.8c3 0 5.69 1.04 7.8 3.05l5.85-5.85A19.16 19.16 0 0 0 24 4 20 20 0 0 0 5.74 14.93l6.82 5.29C14.17 15.39 18.68 11.8 24 11.8z"/>
        </svg>
        <span>${label('google')}</span>
      </button>
      <div class="login-divider">${label('orEmail')}</div>
      </div>
      <form id="email-auth" class="fields">
        <label class="field full">${label('email')}<input name="email" type="email" dir="ltr" autocomplete="email" required></label>
        <label class="field full">${label('password')}<input name="password" type="password" autocomplete="current-password" required></label>
        <button class="btn primary" type="submit" id="login-submit">${label('signIn')}</button>
      </form>
      <div class="login-switch"><span id="first-time-label">${label('firstTime')}</span>
        <button type="button" id="create-account-toggle">${label('createAccount')}</button>
      </div>
      <p role="status" id="account-message"></p>`;
    dialog.setAttribute('aria-labelledby','account-title');
    const message = dialog.querySelector('#account-message');
    if (accessNotice) message.textContent = copy[accessNotice];
    const google = dialog.querySelector('#google-sign-in');
    const email = dialog.querySelector('#email-auth');
    const createToggle = dialog.querySelector('#create-account-toggle');
    if (!supported) {
      google.disabled = true;
      createToggle.disabled = true;
      email.querySelectorAll('input,button').forEach(control => { control.disabled = true; });
      message.textContent = copy.origin;
    }
    createToggle.addEventListener('click',() => {
      if (handling) return;
      creating = !creating;
      email.elements.password.value = '';
      message.textContent = '';
      applyLoginLanguage();
      email.elements.email.focus();
    });
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
        const {auth,authSdk,store,database} = await connect();
        if (!dialog.open || !email.isConnected || auth.currentUser) return;
        const address = email.elements.email.value.trim().toLowerCase();
        if (creating) {
          if (!address || address.includes('/') || address.length > 254) {
            message.textContent = copy.signupDenied;
            return;
          }
          const approval = await store.getDocFromServer(store.doc(database,'accessInvites',address));
          if (approval.data()?.allowed !== true) {
            message.textContent = copy.signupDenied;
            return;
          }
          if (!email.isConnected || auth.currentUser) return;
          const result = await authSdk.createUserWithEmailAndPassword(auth,address,email.elements.password.value);
          try { await authSdk.sendEmailVerification(result.user); } catch {}
          return;
        }
        await authSdk.signInWithEmailAndPassword(auth,address,email.elements.password.value);
      } catch (error) {
        const code = error.code;
        message.textContent = code === 'auth/email-already-in-use' ? copy.signupExisting
          : ['auth/invalid-credential','auth/user-not-found','auth/wrong-password'].includes(code) ? copy.useSignup
          : [copy.error,code].filter(Boolean).join(' · ');
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
      message.textContent = !supported ? copy.origin : accessNotice ? copy[accessNotice] : '';
    });

    dialog.show();
  }

  dialog.addEventListener('close',() => {
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
      const recipient = form.elements.recipient.value.trim().toLowerCase();
      if (ownerAccess !== access || recipient.includes('/') || recipient.length > 254) {
        status.textContent = copy.inviteFailed;
        return;
      }
      if (button.disabled) return;
      button.disabled = true;
      try {
        const {store,database} = access;
        const grant = store.doc(database,'accessInvites',recipient);
        await store.runTransaction(database,async tx => {
          const code = (await tx.get(grant)).data()?.signupCode;
          if (code) tx.delete(store.doc(database,'signupInvites',code));
          tx.set(grant,{allowed:true});
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
    const collections = [
      ['accessInvites',copy.authorizedEmails]
    ];
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
                  const grant = store.doc(database,collection,recipient);
                  await store.runTransaction(database,async tx => {
                    const code = (await tx.get(grant)).data()?.signupCode;
                    if (code) tx.delete(store.doc(database,'signupInvites',code));
                    tx.delete(grant);
                  });
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
