'use strict';

const labels = {
  filter:['تصفية سريعة','Quick filter'], all:['الكل','All'], kind:['نوع العملية','Transaction type'],
  incomeType:['دخل','Income'], expenseType:['مصروف','Expense'], method:['طريقة الدفع أو الاستلام','Payment or receipt method'],
  resetFilter:['مسح التصفية','Clear filters'], pdf:['حفظ PDF','Save PDF'], csv:['تصدير Excel (CSV)','Export Excel (CSV)'],
  exportBackup:['حفظ نسخة احتياطية','Export backup'], importBackup:['استيراد نسخة احتياطية','Import backup'],
  replaceBackup:['سيستبدل الاستيراد كل البيانات الحالية ببيانات النسخة الاحتياطية. هل تريد المتابعة؟','Importing replaces all current data with this backup. Continue?'],
  invalidBackup:['لم يُستورد الملف. اختر نسخة احتياطية صالحة من هذا التطبيق.','Choose a valid backup exported from this app.'],
  imported:['تم استيراد النسخة الاحتياطية','Backup imported'], noMatches:['لا توجد عمليات مطابقة للتصفية.','No transactions match the filters.'],
  matchCount:['عدد العمليات','Transaction count'], monthReport:['تقرير العمليات','Transaction report'],
  currencyLabel:['العملة','Currency'],
  signIn:['تسجيل الدخول','Sign in'], share:['منح الوصول','Grant access'], authorized:['المصرّح لهم','Authorized people'], signOut:['تسجيل الخروج','Sign out'],
  cloudLoading:['جارٍ فتح بيانات الحساب…','Loading account data…'],
  cloudReadError:['تعذّر تحميل الحساب. أعد المحاولة أو سجّل الخروج.','Could not load your account. Retry or sign out.'],
  waitingToSync:['بانتظار الاتصال للمزامنة','Waiting for connection to sync'],
  syncing:['جارٍ مزامنة التغييرات…','Syncing changes…'],
  discardDraft:['ستُستبدل التغييرات غير المتزامنة بالبيانات السحابية. هل تريد المتابعة؟','Replace your unsynced changes with the cloud data?'],
  cloudSaveError:['تعذّر الحفظ في Firebase. حاول مرة أخرى.','Could not save to Firebase. Try again.'],
  cloudConflict:['تغيّرت البيانات على جهاز آخر. أعد تحميل الحساب قبل تعديلها.','Data changed on another device. Reload the account before editing.'],
  cloudLimit:['حجم البيانات يتجاوز سعة المزامنة. احفظ نسخة احتياطية.','Data exceeds sync capacity. Export a backup.'],
  reloadCloud:['إعادة تحميل الحساب','Reload account'],
  title:['حساباتي الشخصية','My Personal Accounts'], demo:['بيانات تجريبية','Demo data'],
  overview:['نظرة عامة','Overview'], intro:['تابع أرصدتك ودخلك ومصاريفك في مكان واحد.','Track your balances, income, and expenses in one place.'],
  total:['إجمالي الرصيد المتاح','Total available balance'], cash:['الكاش','Cash'], bank:['البنك','Bank'],
  cashBalance:['رصيد الكاش','Cash balance'], bankBalance:['رصيد البنك','Bank balance'],
  opening:['رصيد البداية','Opening balances'], addIncome:['إضافة دخل','Add income'],
  addExpense:['إضافة مصروف','Add expense'], transfer:['تحويل بين حساباتي','Transfer between accounts'],
  card:['بطاقة ائتمان','Credit card'], debt:['المستحق على البطاقة','Credit card due'], pay:['سداد البطاقة','Pay credit card'],
  summary:['ملخص الشهر','Monthly summary'], income:['دخل الشهر','Monthly income'], expense:['مصاريف الشهر','Monthly expenses'],
  net:['الصافي','Net income'], categories:['أكثر فئات الصرف','Top spending categories'], breakdown:['الصرف حسب طريقة الدفع','Spending by payment method'],
  ledger:['عمليات الشهر','Monthly activity'], noEntries:['لا توجد عمليات لهذا الشهر.','No activity this month.'],
  noExpenses:['لا توجد مصاريف لهذا الشهر.','No expenses this month.'], month:['الشهر','Month'], previous:['الشهر السابق','Previous month'],
  next:['الشهر التالي','Next month'], amount:['المبلغ','Amount'], date:['التاريخ','Date'],
  receive:['طريقة الاستلام','Received via'], payment:['طريقة الدفع','Payment method'], source:['مصدر الدخل','Income source'],
  category:['فئة الصرف','Category'], customSource:['إضافة مصدر خاص','Add a custom source'], customCategory:['إضافة فئة خاصة','Add a custom category'],
  customName:['الاسم الجديد','New name'], note:['ملاحظة (اختياري)','Note (optional)'], recipient:['اسم المستلم (اختياري)','Recipient (optional)'],
  fees:['رسوم التحويل (اختياري)','Transfer fee (optional)'], deduction:['إجمالي الخصم','Total charged'], direction:['اتجاه التحويل','Transfer direction'],
  bankCash:['من البنك إلى الكاش','Bank to cash'], cashBank:['من الكاش إلى البنك','Cash to bank'],
  edit:['تعديل العملية','Edit transaction'], remove:['حذف العملية','Delete transaction'], confirm:['هل تريد حذف هذه العملية؟','Delete this transaction?'],
  save:['حفظ','Save'], cancel:['إلغاء','Cancel'], saved:['تم الحفظ','Saved'], deleted:['تم الحذف','Deleted'],
  debtError:['مبلغ السداد يتجاوز المستحق، أو سيجعل سدادًا لاحقًا أكبر من المستحق في تاريخه.','This would make a card payment exceed the balance due on its date.'],
  storageError:['تعذّر الحفظ في هذا المتصفح.','Could not save in this browser.'], nameError:['أدخل اسمًا للفئة أو المصدر.','Enter a name for the category or source.'],
  salary:['راتب','Salary'], overtime:['ساعات إضافية','Overtime'], side:['عمل جانبي','Side work'], commission:['عمولة','Commission'], gift:['هدية','Gift'],
  rent:['إيجار','Rent'], bills:['فواتير','Bills'], groceries:['بقالة','Groceries'], dining:['مطاعم','Dining'], fuel:['بنزين','Fuel'],
  car:['سيارة','Car'], subscriptions:['اشتراكات','Subscriptions'], health:['صحة','Health'], intl:['تحويل دولي','International transfer'], other:['غيره','Other']
};

const paths = {
  wallet:'M3 6h16a2 2 0 0 1 2 2v11H5a2 2 0 0 1-2-2V6Zm0 0 13-3v3m5 5h-6v5h6m-3-2.5h.01',
  cash:'M3 6h18v12H3zM3 10a4 4 0 0 0 4-4m14 4a4 4 0 0 1-4-4M3 14a4 4 0 0 1 4 4m14-4a4 4 0 0 0-4 4M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z',
  bank:'m3 9 9-5 9 5H3Zm2 11h14M7 11v6m5-6v6m5-6v6',
  card:'M3 5h18v14H3zM3 10h18M7 15h3',
  income:'M5 15l5-5 4 4 5-7m-5 0h5v5',
  expense:'M5 8l5 5 4-4 5 7m-5 0h5v-5',
  net:'M4 17h16M7 13V9m5 4V6m5 7V3',
  transfer:'M4 8h16m-4-4 4 4-4 4m4 4H4m4-4-4 4 4 4',
  people:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-4m-6-6a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm4-4a4 4 0 0 1 0 8',
  share:'M7 12h.01m10-6h.01m0 12h.01M9 11l6-4m-6 6 6 4M5 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm10-6a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm0 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z',
  download:'M12 3v12m-4-4 4 4 4-4M4 17v4h16v-4',
  upload:'M12 16V4m-4 4 4-4 4 4M4 17v4h16v-4',
  filter:'M4 6h16M7 12h10m-7 6h4',
  plus:'M12 5v14M5 12h14', left:'m15 6-6 6 6 6', right:'m9 6 6 6-6 6',
  edit:'m4 16 12-12 4 4L8 20H4v-4Zm10-10 4 4',
  trash:'M4 7h16m-10-3h4M6 7l1 13h10l1-13m-8 3v7m4-7v7',
  close:'m6 6 12 12M6 18 18 6', globe:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-9 9h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z'
};

const sources = ['salary','overtime','side','commission','gift','other'];
const categories = ['rent','bills','groceries','dining','fuel','car','subscriptions','health','intl','other'];
const key = 'personal-accounts-v1';
const app = document.querySelector('#app');
const editor = document.querySelector('#editor');
const status = document.querySelector('#status');
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const icon = name => '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="' + paths[name] + '"/></svg>';
const button = (action, glyph, title, css = 'btn', compact = false) =>
  `<button type="button" class="${css}" data-action="${action}" ${compact ? `aria-label="${title}" title="${title}"` : ''}>${icon(glyph)}${compact ? '' : title}</button>`;

function localDate(date = new Date()) {
  return [String(date.getFullYear()).padStart(4, '0'), date.getMonth() + 1, date.getDate()].map(n => String(n).padStart(2, '0')).join('-');
}
function moveMonth(month, step) {
  const [year, number] = month.split('-').map(Number);
  const date = new Date();
  date.setFullYear(year, number - 1 + step, 1);
  return localDate(date).slice(0, 7);
}
const today = localDate();
const currentMonth = today.slice(0,7);
let month = currentMonth;
let filters = {type:'all',method:'all'};
const filterMethods = ['all','cash','bank','card','bankCash','cashBank'];
const typeLabel = type => ({income:'incomeType',expense:'expenseType'}[type] || type);
function visibleEntries() {
  return data.entries.filter(entry => entry.date.startsWith(month) &&
    (filters.type === 'all' || filters.type === entry.type) &&
    (filters.method === 'all' || filters.method === entry.method))
    .slice().reverse().sort((a,b) => b.date.localeCompare(a.date));
}

function demoData() {
  const items = [
    ['income',6800,'bank','salary',1], ['expense',2200,'bank','rent',2],
    ['expense',340,'cash','groceries',3], ['income',780,'cash','side',4],
    ['expense',218,'bank','bills',5], ['expense',145,'card','dining',6],
    ['expense',120,'cash','fuel',7], ['expense',500,'bank','intl',8,18],
    ['transfer',300,'bankCash','',9], ['expense',85,'card','subscriptions',10],
    ['pay',100,'bank','',11]
  ];
  const periods = [moveMonth(currentMonth,-1),currentMonth];
  const entries = periods.flatMap((period, index) => items.map(([type, amount, method, category, day, fee = 0], row) => ({
    id: `demo-${index}-${row}`, type, amount: (amount - (index === 0 && category === 'side' ? 200 : 0)) * 100,
    fee: fee * 100, method, category, date: `${period}-${String(index ? Math.min(day, Number(today.slice(-2))) : day).padStart(2,'0')}`
  })));
  return {opening:{cash:45000,bank:120000}, entries, custom:{income:[],expense:[]}, lang:'ar'};
}

let data;
try { data = JSON.parse(localStorage.getItem(key)) || demoData(); }
catch { data = demoData(); }
let localData = data;
let cloud = null;
let cloudState = 'local';
let cloudOnline = false;
let cloudVersion = 0;
let cloudPayload;
let syncing = false;
const draftKey = uid => key + ':draft:' + uid;
let session = 0;
const cloudEnabled = document.body.hasAttribute('data-firebase');

function emptyAccount() {
  return {opening:{cash:0,bank:0},entries:[],custom:{income:[],expense:[]},lang:localData.lang};
}

function readDraft(uid) {
  try {
    const draft = JSON.parse(localStorage.getItem(draftKey(uid)));
    if (Number.isSafeInteger(draft?.base) && draft.base >= 0 && parseBackup(draft.payload)
        && (!draft.sending || parseBackup(draft.sending))) return draft;
  } catch {}
  return null;
}

function writeDraft(uid,draft) {
  localStorage.setItem(draftKey(uid),JSON.stringify(draft));
}

function showSyncStatus() {
  const indicator = app.querySelector('#sync-status');
  if (!indicator) return;
  indicator.textContent = !cloudOnline ? t('waitingToSync')
    : syncing || readDraft(cloud.uid) ? t('syncing') : '';
}

async function loadAccount(adapter,discardDraft=false) {
  const attempt = ++session;
  const previous = {data,state:cloudState};
  const discarded = discardDraft ? localStorage.getItem(draftKey(adapter.uid)) : null;
  cloud = adapter;
  syncing = false;
  cloudOnline = Boolean(adapter?.isReady() && navigator.onLine);
  if (editor.open) editor.close();
  cloudState = adapter ? 'loading' : 'local';
  data = adapter ? emptyAccount() : localData;
  render();
  if (!adapter) return;
  try {
    const {payload,revision} = await adapter.load();
    if (attempt !== session) return;
    const loaded = payload === null ? emptyAccount() : parseBackup(payload);
    if (!loaded) throw new Error('Invalid ledger');
    if (discardDraft && localStorage.getItem(draftKey(adapter.uid)) === discarded) {
      localStorage.removeItem(draftKey(adapter.uid));
    }
    const draft = readDraft(adapter.uid);
    cloudVersion = revision;
    cloudPayload = draft?.payload;
    data = draft ? parseBackup(draft.payload) : loaded;
    cloudState = 'ready';
  } catch (error) {
    if (attempt !== session) return;
    if (error.code === 'permission-denied') { adapter.deny(); return; }
    cloudState = discardDraft ? previous.state : 'error';
    if (discardDraft) data = previous.data;
  }
  render();
  void syncDraft();
}

async function syncDraft() {
  if (!cloud || !cloudOnline || !navigator.onLine || syncing || cloudState !== 'ready') return;
  const adapter = cloud;
  const attempt = session;
  let draft = readDraft(adapter.uid);
  if (!draft || draft.payload !== cloudPayload) return;
  syncing = true;
  showSyncStatus();
  try {
    while (draft && attempt === session && cloudOnline && navigator.onLine) {
      const sending = draft.sending || draft.payload;
      // Persist the attempted payload so a lost response can be reconciled on retry.
      writeDraft(adapter.uid,{...draft,sending});
      const revision = await adapter.save(sending,draft.base);
      if (attempt !== session) return;
      cloudVersion = revision;
      const latest = readDraft(adapter.uid);
      if (latest?.base !== draft.base || latest.sending !== sending) break;
      draft = latest.payload === sending ? null
        : {base:revision,payload:latest.payload,owner:latest.owner};
      if (draft) writeDraft(adapter.uid,draft);
      else localStorage.removeItem(draftKey(adapter.uid));
    }
  } catch (error) {
    if (attempt !== session) return;
    if (error.code === 'permission-denied') { adapter.deny(); return; }
    if (error.code === 'ledger-conflict') {
      cloudState = 'conflict';
      if (editor.open) editor.close();
      render();
    } else if (error.code !== 'myledger/access-pending') {
      cloudOnline = false;
    }
  } finally {
    if (attempt === session) {
      syncing = false;
      showSyncStatus();
    }
  }
}

if (cloudEnabled) {
  window.addEventListener('myledger-account', event => void loadAccount(event.detail));
  window.addEventListener('myledger-connection', event => {
    if (cloud !== event.detail.adapter) return;
    cloudOnline = event.detail.ready;
    showSyncStatus();
    if (cloudOnline && cloudState === 'error') void loadAccount(cloud);
    else if (cloudOnline) void syncDraft();
  });
  window.addEventListener('myledger-revoked',event => {
    const uid = event.detail;
    const draft = readDraft(uid);
    if (!draft || draft.owner === true) return;
    const backup = {payload:draft.payload};
    if (backupUrl) URL.revokeObjectURL(backupUrl);
    backupUrl = undefined;
    unsyncedBackup = backup;
    try { sessionStorage.setItem(backupKey,JSON.stringify(backup)); } catch {}
    try { download(backupName,'application/json',backup.payload); } catch {}
    try { localStorage.removeItem(draftKey(uid)); } catch {}
  });
}
const backupKey = 'myledger-revocation-backup';
const backupName = 'myledger-unsynced-backup.json';
let unsyncedBackup;
let backupUrl;
try { unsyncedBackup = JSON.parse(sessionStorage.getItem(backupKey)); } catch {}
window.addEventListener('myledger-backup-link', event => {
  if (typeof unsyncedBackup?.payload !== 'string') return;
  const link = event.detail;
  backupUrl ||= URL.createObjectURL(new Blob([unsyncedBackup.payload],{type:'application/json'}));
  link.href = backupUrl;
  link.download = backupName;
  link.hidden = false;
});
const t = name => labels[name]?.[data.lang === 'ar' ? 0 : 1] ?? name;
const locale = () => data.lang === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en';
const number = cents => new Intl.NumberFormat(locale(), {minimumFractionDigits:2,maximumFractionDigits:2}).format(cents / 100);
const currency = 'USD';
const money = cents => `<bdi>${number(cents)} <small>${currency}</small></bdi>`;
const cost = entry => entry.amount + (entry.fee || 0);
const cardChange = entry => entry.type === 'pay' ? -entry.amount : entry.type === 'expense' && entry.method === 'card' ? cost(entry) : 0;
const categoryName = (type, category) => labels[category] && (type === 'income' ? sources : categories).includes(category)
  ? t(category) : data.custom[type]?.find(item => item.id === category)?.name || '';
const entryName = entry => ['income','expense'].includes(entry.type) ? categoryName(entry.type,entry.category) : t(entry.type);
const entryMethod = entry => t(entry.type === 'pay' ? 'bank' : entry.method);
const dateLabel = date => new Intl.DateTimeFormat(locale(),{day:'numeric',month:'short'}).format(new Date(date+'T12:00:00'));

function totals(entries) {
  const balances = {...data.opening, card:0};
  for (const entry of entries) {
    if (entry.type === 'income') balances[entry.method] += entry.amount;
    if (entry.type === 'expense' && entry.method !== 'card') balances[entry.method] -= cost(entry);
    if (entry.type === 'transfer') {
      const from = entry.method === 'bankCash' ? 'bank' : 'cash';
      balances[from] -= entry.amount;
      balances[from === 'bank' ? 'cash' : 'bank'] += entry.amount;
    }
    if (entry.type === 'pay') balances.bank -= entry.amount;
    balances.card += cardChange(entry);
  }
  return balances;
}
function tile(glyph, color = '') {
  return `<span class="tile ${color}">${icon(glyph)}</span>`;
}
function card(label, value, glyph, css='', tone='') {
  return `<article class="card ${css}"><div class="card-title">${tile(glyph, tone)}<span>${t(label)}</span></div><strong class="value ${tone === 'green' ? 'positive' : ''}">${money(value)}</strong></article>`;
}
function bar(value,total) {
  return `<div class="bar" aria-hidden="true"><span style="width:${total ? 100*value/total : 0}%"></span></div>`;
}
function render() {
  app.hidden = cloudEnabled && !cloud;
  if (app.hidden) {
    app.replaceChildren();
    return;
  }
  document.documentElement.lang = data.lang;
  document.documentElement.dir = data.lang === 'ar' ? 'rtl' : 'ltr';
  document.title = t('title');
  const balances = totals(data.entries);
  const entries = data.entries.filter(entry => entry.date.startsWith(month));
  const income = entries.filter(entry => entry.type === 'income').reduce((sum, entry) => sum + entry.amount, 0);
  const spending = {cash:0,bank:0,card:0};
  const byCategory = new Map();
  for (const entry of entries.filter(entry => entry.type === 'expense')) {
    spending[entry.method] += cost(entry);
    byCategory.set(entry.category,(byCategory.get(entry.category) || 0) + cost(entry));
  }
  const expense = spending.cash + spending.bank + spending.card;
  const ranking = [...byCategory].sort((a,b) => b[1]-a[1]);
  const visible = visibleEntries();
  const filtered = filters.type !== 'all' || filters.method !== 'all';
  const rtl = data.lang === 'ar';
  const unavailable = ['loading','error','conflict'].includes(cloudState);
  app.innerHTML = `
    <header><div class="top">
      <div class="brand"><span class="mark">${icon('wallet')}</span><span>${t('title')}</span></div>
      <div class="tools">${!cloud && !cloudEnabled ? `<span class="demo">${t('demo')}</span>` : ''}
        ${cloud?.canInvite ? button('cloud-share','share',t('share')) + button('cloud-authorized','people',t('authorized')) : ''}
        ${cloudEnabled ? button('cloud-auth','globe',t(cloud ? 'signOut' : 'signIn')) : ''}${button('language','globe',rtl ? 'English' : 'العربية')}</div>
    </div></header>
    ${unavailable ? `<main><div class="card" role="status">
      <p>${t(cloudState === 'loading' ? 'cloudLoading' : cloudState === 'conflict' ? 'cloudConflict' : 'cloudReadError')}</p>
      ${cloudState === 'loading' ? '' : button('reload-cloud','wallet',t('reloadCloud'))}
      ${cloudState === 'conflict' ? button('export-backup','download',t('exportBackup')) : ''}
    </div></main>` : `<main>
      <div class="heading"><div><h1>${t('overview')}</h1><p class="subtitle">${t('intro')}</p></div>
        ${button('opening','wallet',t('opening'))}
      </div>
      ${cloud ? '<p id="sync-status" role="status" class="subtitle"></p>' : ''}
      <section class="overview" aria-label="${t('overview')}">
        ${card('total',balances.cash+balances.bank,'wallet','hero')}
        ${card('cashBalance',balances.cash,'cash')}
        ${card('bankBalance',balances.bank,'bank')}
      </section>
      <div class="actions">
        ${button('new-income','plus',t('addIncome'),'btn primary')}
        ${button('new-expense','expense',t('addExpense'))}
        ${button('new-transfer','transfer',t('transfer'))}
        <div class="debt">${icon('card')} <span>${t('debt')}</span> <strong>${money(balances.card)}</strong> ${button('new-pay','card',t('pay'))}</div>
      </div>
      <section aria-labelledby="summary">
        <div class="heading"><h2 id="summary">${t('summary')}</h2>
          <div class="month">
            ${button('previous',rtl ? 'right' : 'left',t('previous'),'icon-btn',true)}
            <input type="month" id="month" aria-label="${t('month')}" value="${month}">
            ${button('next',rtl ? 'left' : 'right',t('next'),'icon-btn',true)}
          </div>
        </div>
        <div class="metrics">
          ${card('income',income,'income','','green')}
          ${card('expense',expense,'expense')}
          ${card('net',income-expense,'net','',income >= expense ? 'green' : '')}
        </div>
        <div class="panels">
          <article class="card"><h2>${t('categories')}</h2><div class="bars">
            ${ranking.map(([category,value]) => `<div><div class="analytics-label"><span>${esc(categoryName('expense',category))}</span><strong>${money(value)}</strong></div>${bar(value,expense)}</div>`).join('') || `<p class="empty">${t('noExpenses')}</p>`}
          </div></article>
          <article class="card payment"><h2>${t('breakdown')}</h2>
            ${Object.entries(spending).map(([method,value]) => `<div class="split"><span>${t(method)}</span><strong>${money(value)}</strong></div>${bar(value,expense)}`).join('')}
          </article>
        </div>
        <article class="card ledger"><h2>${t('ledger')}</h2>
          <div class="print-context"><strong>${t('title')} · ${t('monthReport')}</strong><br>
            <bdi>${month}</bdi> · ${t(typeLabel(filters.type))} · ${t(filters.method)} · ${currency}</div>
          <div class="report-tools">
            <div class="report-actions">
              ${button('pdf','download',t('pdf'))}
              ${button('csv','download',t('csv'))}
              ${button('export-backup','download',t('exportBackup'))}
              ${button('import-backup','upload',t('importBackup'))}
              <input id="backup-file" type="file" accept=".json,application/json" hidden>
            </div>
            <details id="filters" ${filtered ? 'open' : ''}>
              <summary>${icon('filter')}${t('filter')}</summary>
              <div class="filter-fields">
                ${field('kind',`<select id="filter-type">${['all','income','expense','transfer','pay'].map(type => option(type,t(typeLabel(type)),filters.type)).join('')}</select>`)}
                ${field('method',select('method',filterMethods,filters.method).replace('<select','<select id="filter-method"'))}
                ${button('clear-filters','close',t('resetFilter'))}
              </div>
            </details>
            <small>${t('matchCount')} · <bdi>${visible.length}</bdi></small>
          </div>
          <div>${visible.map(entry => {
            const detail = [dateLabel(entry.date),entryMethod(entry),entry.recipient,entry.note].filter(Boolean).map(esc).join(' · ');
            const fee = entry.fee ? `<small>${t('amount')} ${money(entry.amount)} · ${t('fees').split(' (')[0]} ${money(entry.fee)}</small>` : '';
            return `<div class="transaction">${tile(entry.type === 'pay' ? 'card' : entry.type, entry.type === 'income' ? 'green' : '')}
              <div class="details"><strong>${esc(entryName(entry))}</strong><small>${detail}</small>${fee}</div>
              <span ${entry.fee ? `title="${t('deduction')}"` : ''} class="entry-price ${entry.type === 'income' ? 'positive' : entry.type === 'expense' ? 'negative' : ''}">${entry.type === 'income' ? '+' : entry.type === 'expense' ? '−' : ''}${money(cost(entry))}</span>
              <div class="row-actions">${button('edit:'+entry.id,'edit',t('edit'),'icon-btn',true)}${button('remove:'+entry.id,'trash',t('remove'),'icon-btn',true)}</div>
            </div>`;
          }).join('') || `<p class="empty">${t(filtered ? 'noMatches' : 'noEntries')}</p>`}</div>
        </article>
      </section>
    </main>`}`;
  showSyncStatus();
}

const typeTitle = {income:'addIncome',expense:'addExpense',transfer:'transfer',pay:'pay',opening:'opening'};
const groups = {income:sources,expense:categories};
const field = (label, input, full=false) => `<label class="field ${full ? 'full' : ''}"><span>${t(label)}</span>${input}</label>`;
const moneyInput = (name, value, min, required=true) => `<span class="money-input"><input name="${name}" type="number" inputmode="decimal" min="${min}" max="999999999.99" step="0.01" value="${value === '' ? '' : value/100}" ${required ? 'required' : ''}><small>${currency}</small></span>`;
const textInput = (name,value,max=120) => `<input name="${name}" maxlength="${max}" value="${esc(value)}">`;
const option = (key,label,selected) => `<option value="${key}" ${key === selected ? 'selected' : ''}>${esc(label)}</option>`;
const select = (name, values, selected) => `<select name="${name}">${values.map(value => option(value,t(value),selected)).join('')}</select>`;
const defaultDate = () => month === currentMonth ? today : month+'-01';

function openEditor(type, entry) {
  const chosen = entry || {};
  const methods = type === 'transfer' ? ['bankCash','cashBank'] : type === 'expense' ? ['cash','bank','card'] : ['cash','bank'];
  const methodLabel = {income:'receive',expense:'payment',transfer:'direction'};
  let fields;
  if (type === 'opening') {
    fields = field('cash',moneyInput('cash',data.opening.cash,0)) + field('bank',moneyInput('bank',data.opening.bank,0));
  } else {
    fields = field('amount',moneyInput('amount',chosen.amount ?? '',0.01)) +
      field('date',`<input name="date" type="date" min="0001-01-01" max="9999-12-31" value="${chosen.date || defaultDate()}" required>`);
    if (methodLabel[type]) fields += field(methodLabel[type],select('method',methods,chosen.method),true);
    if (groups[type]) {
      const customLabel = type === 'income' ? 'customSource' : 'customCategory';
      const options = groups[type].map(id => option(id,t(id),chosen.category))
        .concat(data.custom[type].map(item => option(item.id,item.name,chosen.category)));
      fields += field(type === 'income' ? 'source' : 'category',`<select name="category">${options.join('')}${option('custom',t(customLabel))}</select>`,true);
      fields += `<div class="full" id="custom-field" hidden>${field('customName',textInput('customName','',60))}</div>`;
    }
    if (type === 'expense') {
      fields += `<div id="international" class="fields full" hidden>
        ${field('recipient',textInput('recipient',chosen.recipient))}
        ${field('fees',moneyInput('fee',chosen.fee || '',0,false))}
        <div class="split full"><strong>${t('deduction')}</strong><output id="deduction"></output></div>
        </div>`;
    }
    fields += field('note',textInput('note',chosen.note),true);
  }
  editor.innerHTML = `<div class="dialog-title"><h2 id="editor-title">${t(entry ? 'edit' : typeTitle[type])}</h2>
    ${button('close','close',t('cancel'),'icon-btn',true)}</div>
    <form><div class="fields">${fields}</div><p class="error" role="alert"></p>
    <div class="dialog-actions"><button class="btn" type="button" data-action="close">${t('cancel')}</button>
    <button class="btn primary" type="submit">${t('save')}</button></div></form>`;
  editor.setAttribute('aria-labelledby','editor-title');
  const form = editor.querySelector('form');
  const input = name => form.elements.namedItem(name);
  const cents = name => Math.round(Number(input(name)?.value || 0)*100);
  const synchronize = () => {
    const category = input('category')?.value;
    if (groups[type]) {
      editor.querySelector('#custom-field').hidden = category !== 'custom';
      input('customName').required = category === 'custom';
    }
    if (type === 'expense') {
      editor.querySelector('#international').hidden = category !== 'intl';
      input('fee').disabled = category !== 'intl';
      editor.querySelector('#deduction').innerHTML = money(cents('amount') + cents('fee'));
    }
  };
  form.addEventListener('input',synchronize);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const candidate = structuredClone(data);
    const error = editor.querySelector('.error');
    if (type === 'opening') {
      candidate.opening = {cash:cents('cash'),bank:cents('bank')};
    } else {
      let category = input('category')?.value ?? '';
      if (category === 'custom') {
        const name = input('customName').value.trim();
        if (!name) { error.textContent = t('nameError'); return; }
        const existing = candidate.custom[type].find(item => item.name === name);
        const item = existing || {id:newId(),name};
        if (!existing) candidate.custom[type].push(item);
        category = item.id;
      }
      const record = {
        id:entry?.id ?? newId(), type, category, date:input('date').value,
        amount:cents('amount'), method:input('method')?.value ?? 'bank', note:input('note').value.trim(),
        fee:category === 'intl' ? cents('fee') : 0,
        recipient:category === 'intl' ? input('recipient').value.trim() : ''
      };
      const index = candidate.entries.findIndex(item => item.id === record.id);
      if (index === -1) candidate.entries.push(record);
      else candidate.entries[index] = record;
      if (!validCard(candidate.entries)) { error.textContent = t('debtError'); return; }
    }
    const period = input('date')?.value.slice(0,7);
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    const failure = await persist(candidate);
    submit.disabled = false;
    if (failure) { if (failure !== 'session') error.textContent = t(failure); return; }
    if (period) month = period;
    editor.close();
    render();
    announce(t('saved'));
  });
  synchronize();
  editor.showModal();
}

function newId() {
  return 'entry-' + Array.from(crypto.getRandomValues(new Uint32Array(4)), number => number.toString(36)).join('-');
}
function validCard(entries) {
  const sorted = entries.slice().sort((a,b) => a.date.localeCompare(b.date) || cardChange(b)-cardChange(a));
  let due = 0;
  return sorted.every(entry => (due += cardChange(entry)) >= 0);
}

async function persist(candidate) {
  if (!cloud) {
    try { localStorage.setItem(key,JSON.stringify(candidate)); }
    catch { return 'storageError'; }
    data = localData = candidate;
    return null;
  }
  if (cloudState !== 'ready') return 'cloudSaveError';
  const payload = JSON.stringify({version:1,data:candidate});
  if (new TextEncoder().encode(payload).length > 700000) return 'cloudLimit';
  const draft = readDraft(cloud.uid);
  if (draft && draft.payload !== cloudPayload) {
    data = parseBackup(draft.payload);
    cloudState = 'conflict';
    if (editor.open) editor.close();
    render();
    return 'cloudConflict';
  }
  try { writeDraft(cloud.uid,{...(draft || {base:cloudVersion}),payload,owner:cloud.canInvite}); }
  catch { return 'storageError'; }
  data = candidate;
  cloudPayload = payload;
  void syncDraft();
  return null;
}
let timer;
function announce(message) {
  status.textContent = message;
  clearTimeout(timer);
  timer = setTimeout(() => { status.textContent = ''; },3000);
}

document.addEventListener('click',async event => {
  const control = event.target.closest('[data-action]');
  if (!control) return;
  const [action,id] = control.dataset.action.split(':');
  if (['cloud-auth','cloud-share','cloud-authorized'].includes(action)) {
    window.dispatchEvent(new CustomEvent(action.replace('cloud-','myledger-') + '-request',{detail:data.lang}));
    return;
  }
  if (action === 'reload-cloud') {
    const discardDraft = cloudState === 'conflict';
    if (!discardDraft || window.confirm(t('discardDraft'))) await loadAccount(cloud,discardDraft);
    return;
  }
  if (action === 'close') { editor.close(); return; }
  if (action === 'language') {
    if (['loading','error','conflict'].includes(cloudState)) return;
    const failure = await persist({...data,lang:data.lang === 'ar' ? 'en' : 'ar'});
    if (!failure) {
      render();
      app.querySelector('[data-action="language"]').focus();
    } else if (failure !== 'session') announce(t(failure));
    return;
  }
  if (action === 'previous' || action === 'next') {
    if ((action === 'previous' && month === '0001-01') || (action === 'next' && month === '9999-12')) return;
    month = moveMonth(month,action === 'previous' ? -1 : 1);
    render();
    app.querySelector(`[data-action="${action}"]`).focus();
    return;
  }
  if (action === 'pdf') { window.print(); return; }
  if (action === 'csv') { exportCsv(); return; }
  if (action === 'export-backup') {
    download('myledger-backup-' + localDate() + '.json','application/json',JSON.stringify({version:1,data},null,2));
    return;
  }
  if (action === 'import-backup') { app.querySelector('#backup-file').click(); return; }
  if (action === 'clear-filters') {
    filters = {type:'all',method:'all'};
    renderFilters('#filter-type');
    return;
  }
  if (action === 'opening') { openEditor('opening'); return; }
  if (action.startsWith('new-')) { openEditor(action.slice(4)); return; }
  const entry = data.entries.find(item => item.id === id);
  if (!entry) return;
  if (action === 'edit') { openEditor(entry.type,entry); return; }
  if (action === 'remove' && window.confirm(t('confirm'))) {
    const candidate = {...data,entries:data.entries.filter(item => item.id !== id)};
    if (!validCard(candidate.entries)) announce(t('debtError'));
    else {
      const failure = await persist(candidate);
      if (!failure) { render(); announce(t('deleted')); }
      else if (failure !== 'session') announce(t(failure));
    }
  }
});
app.addEventListener('change',event => {
  const {id,value,files} = event.target;
  if (id === 'backup-file' && files?.[0]) {
    const file = files[0];
    event.target.value = '';
    void importBackup(file);
    return;
  }
  if (id === 'filter-type' || id === 'filter-method') {
    filters[id === 'filter-type' ? 'type' : 'method'] = value;
    renderFilters('#' + id);
    return;
  }
  if (event.target.id !== 'month') return;
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(event.target.value) || event.target.value.startsWith('0000')) {
    event.target.value = month;
    return;
  }
  month = event.target.value;
  render();
  app.querySelector('#month').focus();
});
render();

function renderFilters(focus) {
  render();
  app.querySelector('#filters').open = true;
  app.querySelector(focus).focus();
}

function download(name, type, contents) {
  const url = URL.createObjectURL(new Blob([contents],{type}));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url),1000);
}

function csvCell(value) {
  let cell = String(value ?? '');
  // Keep user-provided text from being interpreted as spreadsheet formulas.
  if (/^[=+\-@\t\r\n]/.test(cell.trimStart()) || /^[\t\r\n]/.test(cell)) cell = "'" + cell;
  return '"' + cell.replaceAll('"','""') + '"';
}

function exportCsv() {
  const header = ['date','kind','category','method','amount','fees','deduction','currencyLabel','recipient','note'].map(t);
  const decimal = cents => (cents / 100).toFixed(2);
  const rows = visibleEntries().map(entry => [
    entry.date, t(typeLabel(entry.type)), categoryName(entry.type,entry.category),
    entryMethod(entry), decimal(entry.amount), decimal(entry.fee || 0), decimal(cost(entry)),
    currency, entry.recipient, entry.note
  ]);
  const contents = '\uFEFF' + [header,...rows].map(row => row.map(csvCell).join(',')).join('\r\n');
  download('myledger-' + month + '.csv','text/csv;charset=utf-8',contents);
}

function parseBackup(contents) {
  const {version,data:state} = JSON.parse(contents);
  const cents = value => Number.isSafeInteger(value) && value >= 0 && value <= 99999999999;
  const id = value => typeof value === 'string' && /^[a-zA-Z0-9-]{1,100}$/.test(value);
  const optionalText = value => value === undefined || (typeof value === 'string' && value.length <= 120);
  if (version !== 1 || !['ar','en'].includes(state?.lang) ||
      !cents(state.opening?.cash) || !cents(state.opening?.bank) || !Array.isArray(state.entries)) return null;
  const allowedCategories = {};
  for (const type of ['income','expense']) {
    const items = state.custom?.[type];
    if (!Array.isArray(items) || !items.every(item => item && id(item.id) && item.id.startsWith('entry-') &&
        typeof item.name === 'string' && item.name.trim() && item.name.length <= 60)) return null;
    const categoryIds = new Set(items.map(item => item.id));
    if (categoryIds.size !== items.length) return null;
    allowedCategories[type] = new Set([...groups[type],...categoryIds]);
  }

  const methods = {income:['cash','bank'],expense:['cash','bank','card'],transfer:['bankCash','cashBank'],pay:['bank']};
  const ids = new Set();
  for (const entry of state.entries) {
    if (!entry || !Object.hasOwn(methods,entry.type) || !methods[entry.type].includes(entry.method) ||
        !id(entry.id) || ids.has(entry.id) || !cents(entry.amount) || entry.amount === 0 || !cents(entry.fee ?? 0) ||
        !optionalText(entry.note) || !optionalText(entry.recipient) ||
        typeof entry.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(entry.date) || entry.date.startsWith('0000')) return null;
    const date = new Date(entry.date + 'T00:00:00Z');
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0,10) !== entry.date) return null;
    if (Object.hasOwn(groups,entry.type) ? !allowedCategories[entry.type].has(entry.category) : entry.category !== '') return null;
    if (entry.category !== 'intl' && (entry.fee || entry.recipient)) return null;
    ids.add(entry.id);
  }
  return validCard(state.entries) ? state : null;
}

async function importBackup(file) {
  const attempt = session;
  let candidate;
  try {
    candidate = file.size <= 10 * 1024 * 1024 ? parseBackup(await file.text()) : null;
  } catch {
    candidate = null;
  }
  if (attempt !== session) return;
  if (!candidate) { announce(t('invalidBackup')); return; }
  if (!window.confirm(t('replaceBackup'))) return;
  const failure = await persist(candidate);
  if (failure) { if (failure !== 'session') announce(t(failure)); return; }
  filters = {type:'all',method:'all'};
  month = candidate.entries.reduce((latest,entry) => {
    const period = entry.date.slice(0,7);
    return period > latest ? period : latest;
  },'') || currentMonth;
  render();
  announce(t('imported'));
}
