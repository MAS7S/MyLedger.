# تفعيل حذف حسابات MyLedger من Cloudflare

هذا الدليل يخص التكامل السابق. زر «إزالة الوصول» في تطبيق MyLedger الحالي
يستخدم Firestore مباشرة، وأزيل متغير `MYLEDGER_REVOCATION_URL` من عملية
النشر. خطوات الربط والنشر أدناه مرجع للإصدارات السابقة فقط.


زر «إزالة الوصول» يحذف تصريح البريد في Firestore، ثم يحذف حسابه من **Firebase Authentication → Users**. يحتفظ MyLedger ببيانات الدفتر. إذا تعذّر حذف الحساب بعد سحب التصريح، يبقى الوصول موقوفًا ويظهر «إكمال حذف الحساب» عند إعادة فتح قائمة المصرّح لهم. حماية الزر تعتمد على رمز جلسة Firebase والتحقق من سجل المالك في Firestore.

## 1. إنشاء حساب خدمة لـ MyLedger

1. افتح [أدوار Google Cloud لمشروع MyLedger](https://console.cloud.google.com/iam-admin/roles?project=my-ledger-8d0b3). أنشئ دورًا مخصصًا، مثل **MyLedger Revoker**، وأضف الأذونات التالية.

   ```text
   firebaseauth.users.get
   firebaseauth.users.delete
   datastore.entities.get
   datastore.entities.create
   datastore.entities.update
   datastore.entities.delete
   ```

2. من [حسابات الخدمة في المشروع نفسه](https://console.cloud.google.com/iam-admin/serviceaccounts?project=my-ledger-8d0b3)، أنشئ حساب خدمة باسم `myledger-revoker` وامنحه الدور الجديد. افتح تبويب **Keys → Add key → Create new key → JSON**، واحفظ الملف في مجلد خارج المستودع. يستخدم Worker المفتاح لطلب رمز OAuth من Google.

## 2. نشر Worker وحفظ المفتاح

من PowerShell داخل مجلد مستودع **MyLedger**، وباستخدام Node.js حديث.

```powershell
cd worker
npx.cmd --yes wrangler@4 login
npx.cmd --yes wrangler@4 deploy
Get-Content -Raw "$env:USERPROFILE\Downloads\myledger-revoker.json" | npx.cmd --yes wrangler@4 secret put FIREBASE_SERVICE_ACCOUNT_JSON
```

استبدل مسار JSON بالمسار الفعلي. احتفظ بالمفتاح في **Cloudflare Secret** باسم `FIREBASE_SERVICE_ACCOUNT_JSON`. القيم العامة `FIREBASE_PROJECT_ID` و`FIREBASE_API_KEY` و`ALLOWED_ORIGIN` جاهزة في `wrangler.toml`. انسخ عنوان `workers.dev` من نتيجة النشر. [Cloudflare Workers secrets](https://developers.cloudflare.com/workers/configuration/secrets/)

## 3. ربط MyLedger بعنوان Worker

1. افتح [متغيرات GitHub Actions لمستودع MyLedger](https://github.com/MAS7S/MyLedger./settings/variables/actions). أضف **Repository variable** باسم `MYLEDGER_REVOCATION_URL` وقيمته عنوان Worker، مثل `https://myledger-revoke.example.workers.dev`.
2. افتح [Deploy MyLedger to Firebase](https://github.com/MAS7S/MyLedger./actions/workflows/firebase-deploy.yml)، ثم اضغط **Run workflow** واختر `main`. بعد نجاحه، افتح MyLedger من [الرابط المعتاد](https://my-ledger-8d0b3.web.app/).
3. للتحقق، سجّل الدخول كمالك وألغِ وصول بريد اختباري مصرح به له حساب Firebase، ثم تحقق من اختفائه من **Authentication → Users**. يستمر زر إزالة التصريح الحالي في العمل حتى إعداد عنوان Worker وإعادة النشر.
