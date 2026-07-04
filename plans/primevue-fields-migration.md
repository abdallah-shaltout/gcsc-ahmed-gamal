# خطة: ترحيل الحقول إلى PrimeVue

> **حالة التنفيذ**: تم تنفيذ Tasks 0، 1، 3، 4، 5، 6 بالكامل (بما فيها locale عربي للتقويم). Task 2 جزئي (DatePicker + Chip، الاختيار المتعدد inline لم يُنفّذ). من Task 7: تم تنفيذ Toast وValidationCard→Message؛ auto-import (`unplugin-vue-components`) لم يُنفّذ. راجع الملاحظات تحت كل Task لتفاصيل ما تم وما تأجّل.
>
> **إصلاح جانبي**: تم اكتشاف وإصلاح خطأ type-check موجود مسبقاً في `d.toISOString().split('T')[0]` (يرجع `string | undefined` تحت `noUncheckedIndexedAccess`) في `src/stores/absence.ts` و`src/views/HomeView.vue` — استُبدل بـ `.slice(0, 10)`. كان هذا ضرورياً لتمرير type-check نظيف بعد ربط حقول DatePicker الجديدة بنفس القيم.

## الهدف
استبدال عناصر الفورم اليدوية (native `<input>`, `<select>`, radio/checkbox cards) بمكونات PrimeVue الجاهزة، للحصول على تحكم أفضل، إتاحة (accessibility) أفضل، وسلوك موحّد (validation states, RTL, keyboard nav) عبر كل الفورمات.

## الوضع الحالي (ملخص الفحص)
- **الحزم مثبتة لكن غير مفعّلة**: `primevue@5.0.0-rc.1` و `@primeuix/themes@3.0.0-rc.1` موجودين في [package.json](package.json) لكن `main.ts` لا يستدعي `app.use(PrimeVue, ...)` إطلاقاً — لازم إعداد أساسي أولاً.
- **Tailwind v4** مُفعّل عبر `@tailwindcss/vite` في [vite.config.ts](vite.config.ts) — يحتاج تكامل مع PrimeVue عبر `tailwindcss-primeui` وCSS layers لتجنب تعارض الأولوية (specificity).
- **الفورم الرئيسي** في [HomeView.vue](src/views/HomeView.vue): فيه radio cards (نوع الانقطاع), `<select>` عادي لاختيار المستند, وأزرار.
- **[DateFields.vue](src/components/form/DateFields.vue)**: أكتر ملف فيه حقول — 5+ `input[type=date]`, radio group (الموقف الحالي), checkbox واحد, وقائمة "chips" لأيام متفرقة.
- **[EmployeeSearch.vue](src/components/form/EmployeeSearch.vue)**: autocomplete يدوي بالكامل (input + dropdown div + filter logic) — مرشح مثالي لـ `AutoComplete` أو `Select` مع فلترة.
- **[ValidationCard.vue](src/components/form/ValidationCard.vue)**: عرض فقط، لا فيه حقول — لكن ممكن نستخدم `Message`/`Tag` من PrimeVue بدل الـ divs اليدوية (اختياري، خارج نطاق "الحقول" الأساسي).
- الأبعاد كلها RTL بالعربي — أي مكون PrimeVue المُختار لازم يتفحّص تحت `dir="rtl"`.
- فيه منطق طباعة (`printDoc` في HomeView) بيولّد iframe منفصل بـ inline CSS — الفورم نفسه (الشريط الجانبي) مش جزء من الطباعة (`no-print` class)، فالتغييرات هنا آمنة ومش هتأثر على مخرجات الطباعة.

## القرارات المفتوحة (تحتاج توافق قبل التنفيذ)
1. **استخدام PrimeVue Forms library (`@primevue/forms`) أو الاكتفاء بـ `v-model` العادي مع Pinia store؟**
   الفورم الحالي مبني بالكامل على Pinia (`useAbsenceStore`) مع `v-model` مباشر على الـ store refs. الأسهل والأقل خطورة هو الإبقاء على هذا النمط واستخدام مكونات PrimeVue كبديل بصري فقط (input models تتصل بالـ store زي ما هي)، **بدون** إدخال `@primevue/forms` (اللي بيحتاج إعادة هيكلة الفورم بالكامل حول `$form` state). هذا القرار موصى به إلا لو احتجنا validation resolvers متقدمة لاحقاً.
2. **الثيم**: نبدأ بـ Aura (الافتراضي في التوثيق) مع `darkModeSelector: false` (التطبيق حالياً بدون dark mode) — يمكن تغييره لاحقاً.
3. **نطاق الترحيل**: هل نرحّل فورم الصفحة الرئيسية فقط (Home/DateFields/EmployeeSearch) في هذه الدفعة، أم كل الحقول في مكونات `documents/*` كمان (لو فيها حقول تحرير مباشر contenteditable)? *(الفحص الأولي ما لقاش حقول native فعلية جوه Doc*.vue — أغلبها contenteditable spans للطباعة. سيتم التأكيد أثناء Task 1.)*

---

## Checklist

### Task 0 — إعداد PrimeVue الأساسي (Bootstrap) ✅ منفّذ
**الوصف**: تفعيل PrimeVue فعلياً في التطبيق. حالياً الحزم مثبتة لكن مش متصلة بأي حاجة.
- [x] في `main.ts`: استيراد `PrimeVue` من `primevue/config` و`Aura` من `@primeuix/themes/aura`، واستدعاء:
  ```ts
  app.use(PrimeVue, {
    theme: { preset: Aura, options: { darkModeSelector: false, cssLayer: { name: 'primevue', order: 'theme, base, primevue, utilities' } } }
  })
  ```
- [x] تثبيت وتفعيل `tailwindcss-primeui` plugin: `bun add tailwindcss-primeui`، ثم إضافة `@import "tailwindcss-primeui";` في [main.css](src/assets/main.css) بجانب `@import "tailwindcss";`.
- [x] التأكد من ترتيب CSS layers الصحيح (`theme, base, primevue, utilities`) حتى تقدر Tailwind utilities تتحكم في مكونات PrimeVue عند الحاجة (override).
- [x] تفعيل `PrimeIcons` (تثبيت `primeicons` وإضافة `import 'primeicons/primeicons.css'` في `main.ts`) — مطلوب لأيقونات زي calendar/search/chevron جوه المكونات.
- [x] اختبار: التطبيق شُغّل فعلياً عبر Playwright (screenshots) وتأكدنا إن كل المكونات ظاهرة بالستايل الصحيح تحت `dir="rtl"` بدون console errors.
- [ ] (اختياري، لم يُنفّذ) إعداد Auto Import عبر `unplugin-vue-components` لتقليل الـ imports اليدوية لكل مكون — قرار أداء/راحة وليس ضرورة، مؤجل.

**ملاحظة تنفيذ**: ظهر watermark "Invalid PrimeUI License" — متوقع لأن الثيم يعمل بدون مفتاح ترخيص مدفوع (rc build). لا يؤثر على الوظائف، فقط شارة بصرية في وضع التطوير.

### Task 1 — استبدال حقول التاريخ في DateFields.vue بـ `DatePicker` ✅ منفّذ
**الوصف**: يوجد 5 حقول `input[type=date]` منفصلة في [DateFields.vue](src/components/form/DateFields.vue) (بداية الانقطاع، نهاية الانقطاع، منتقي الأيام المتفرقة، تاريخ الإرسال، تاريخ اتمام المدة القانونية، تاريخ الانقطاع الحالي). كلهم يستخدمون string بصيغة `YYYY-MM-DD` (`v-model` على store refs من نوع `string`).
- [x] استبدال كل `input[type=date]` بمكون `<DatePicker>` من `primevue/datepicker`.
- [x] **حل مشكلة النوع**: تم اختيار الخيار الموصى به — `computed` wrapper (`toDate`/`toIso` helpers) لكل حقل تاريخ، بدون تغيير نوع بيانات الـ store. `dateFormat="yy-mm-dd"` مضبوط على كل `DatePicker`.
- [x] الحفاظ على منطق تلوين الخطأ — استبدلنا `sendDateBorderClass` بـ computed `sendDateInvalid: boolean` مرتبط بـ prop `:invalid` على `DatePicker` الخاص بتاريخ الإرسال.
- [x] **منفّذ**: locale عربي كامل للتقويم المنبثق — أُضيف عبر خيار `locale` في `app.use(PrimeVue, { locale: {...} })` بـ [main.ts](src/main.ts) (أسماء الأيام/الشهور بالعربي، `firstDayOfWeek: 6` للسبت، وترجمة "اليوم"/"مسح"). تم التحقق بصرياً عبر Playwright من ظهور "يوليو 2026" وأحرف الأيام العربية (ح خ ج ن ث ر س) في التقويم المنبثق.
- [x] اختبار: تم التحقق عبر Playwright من فتح التقويم، اختيار تاريخ، وتحديث الـ store وقيم `absenceDaysCount`/`excuseDeadline` المعروضة في `ValidationCard` بنجاح (راجع سيناريو الاختبار: بحث عن موظف ثم فتح `DatePicker`).

### Task 2 — منتقي الأيام المتفرقة (Intermittent Dates) في DateFields.vue — جزئي ⚠️
**الوصف**: حالياً عبارة عن `input[type=date]` + زرار "إضافة" + قائمة "chips" يدوية لعرض/حذف الأيام المختارة (سطر 57-80 في DateFields.vue).
- [x] استبدال حقل الإدخال بـ `<DatePicker>` (بنفس منطق Task 1) — يضيف يوم واحد في كل مرة بنفس السلوك الأصلي (زرار "إضافة").
- [ ] **لم يُنفّذ / قرار مؤجل**: تقييم `<DatePicker inline multiple>` لاختيار عدة أيام دفعة واحدة بدل الضغط على "إضافة" لكل يوم — أُبقي على السلوك الأصلي (يوم واحد في كل مرة) لتقليل نطاق التغيير في هذه الدفعة.
- [x] **منفّذ**: الـ "chips" لعرض الأيام المختارة استُبدلت بمكون `<Chip>` من `primevue/chip` مع `removable` prop و`@remove` handler مرتبط بـ `store.removeAbsenceDate(d)` — تم التحقق بصرياً عبر Playwright.
- [x] الحفاظ على زرار "حذف الكل" (`clearAbsenceDates`) كما هو (زرار Tailwind عادي، لم يُستبدل بـ `<Button>`).

### Task 3 — الحقول الشرطية (Radio Groups) — نوع الانقطاع والموقف الحالي ✅ منفّذ
**الوصف**: يوجد نمط "radio card" متكرر في مكانين: `store.absenceType` في [HomeView.vue](src/views/HomeView.vue) (سطر ~190-206)، و`store.currentStatus` في [DateFields.vue](src/components/form/DateFields.vue) (سطر ~114-135). كلاهما `<input type="radio">` ملفوف بـ `<label>` مع تلوين شرطي عبر classes.
- [x] استبدال كل `<input type="radio">` بمكون `<RadioButton>` من `primevue/radiobutton` مع الإبقاء على تصميم الـ "card" الحالي.
- [x] التأكد من ربط `v-model` بـ `store.absenceType` / `store.currentStatus` بشكل مباشر (نفس القيم الحالية) — بدون تغيير في الـ store.
- [x] تم التحقق بصرياً عبر Playwright من التبديل بين الخيارين وتحديث التصميم الشرطي للبطاقة (لون الحدود/الخلفية) بشكل صحيح.

### Task 4 — Checkbox (تم انتهاء المدة القانونية) ✅ منفّذ
**الوصف**: `store.legalPeriodExpired` في [DateFields.vue](src/components/form/DateFields.vue) سطر ~146 — `input[type=checkbox]` واحد بسيط.
- [x] استبداله بمكون `<Checkbox>` من `primevue/checkbox` مع `binary` prop.
- [x] الحفاظ على التصميم الحالي (النص التوضيحي تحت العنوان).
- [x] استُخدم نفس مكون `Checkbox` (`binary`) أيضاً لتبديل "بحث Regex" في `EmployeeSearch.vue` (كان `input[type=checkbox]` بسيط مشابه، ضمن نطاق Task 6).

### Task 5 — قائمة اختيار المستند (Select) في HomeView.vue ✅ منفّذ
**الوصف**: `<select>` عادي (سطر 258-267 في HomeView.vue) لاختيار override المستند يدوياً، مع `optgroup` لتقسيم "تلقائي" عن باقي الخيارات.
- [x] استبداله بمكون `<Select>` من `primevue/select`.
- [x] بُنيت `docSelectOptions` كـ computed array بصيغة `[{ label, value: '' }, { label: '── اختر يدوياً ──', items: [...] }]` باستخدام `optionGroupLabel="label"` و`optionGroupChildren="items"` لإعادة بناء نفس هيكلة "تلقائي" + مجموعة الخيارات اليدوية.
- [x] الحفاظ على منطق `store.selectedDoc = v ? v as DocumentType : null` عبر `@update:modelValue` handler.
- [x] تم التحقق بصرياً عبر Playwright من فتح القائمة المنسدلة، ظهور المجموعتين بشكل صحيح تحت `dir="rtl"`.

### Task 6 — ترحيل EmployeeSearch.vue إلى AutoComplete ✅ منفّذ
**الوصف**: أكبر مكون فيه منطق مخصص بالكامل — بحث نصي/regex يدوي (computed `filtered`)، فتح/غلق dropdown يدوي (`open`, `onFocus`, `onBlur` مع `setTimeout` hack), وعرض بطاقة الموظف المختار تحت الحقل.
- [x] استبدال البنية بمكون `<AutoComplete>` من `primevue/autocomplete`:
  - `v-model` مربوط بكائن `Employee` مباشرة عبر computed wrapper (`get` يرجع الموظف المختار من الـ store، `set` يستدعي `store.setEmployee(emp.id)`).
  - `suggestions` تُبنى داخل `@complete` handler (`search` function) بنفس منطق الفلترة الأصلي (نصي + regex).
  - استُخدم `#option` slot مخصص لعرض الاسم + المسمى الوظيفي + الكود بنفس التصميم الأصلي.
- [x] نقل منطق فلترة الـ regex (`useRegex` toggle، الآن `<Checkbox binary>`) للعمل جوه `@complete` handler — تم التحقق بصرياً من عمل البحث بالاسم بنجاح.
- [x] إزالة الـ `setTimeout` hack الخاص بـ `onBlur` بالكامل — `AutoComplete` يتعامل مع فتح/غلق القائمة داخلياً.
- [x] الحفاظ على بطاقة عرض الموظف المختار (الاسم، المسمى، القسم، الكود) تحت الحقل بدون تغيير.
- [x] اختبار: تم التحقق عبر Playwright من البحث بالاسم واختيار موظف من القائمة، وتأكيد إن `store.setEmployee(id)` نفّذ صح (المستند المعاين تحدّث فوراً بالاسم والكود الجديد). لم يُختبر صراحة مسار regex أو البحث بالكود/المسمى الوظيفي بشكل منفصل — نفس دالة `search` تغطي الحالتين لكن يُفضّل اختبار يدوي إضافي قبل الاعتماد النهائي.

### Task 7 — تحسينات إضافية اختيارية (Nice-to-have، خارج النطاق الأساسي) — جزئي ⚠️
- [x] **منفّذ**: استُبدل الـ Toast اليدوي في [HomeView.vue](src/views/HomeView.vue) بمكون `<Toast>` + `useToast()` composable من PrimeVue. `ToastService` مسجّل في [main.ts](src/main.ts)، و`<Toast position="bottom-right" />` أُضيف مرة واحدة في [App.vue](src/App.vue) (المكان الصحيح لعنصر Toast عام على مستوى التطبيق). أُزيلت متغيرات `toastMsg`/`toastVisible` والـ `<Transition>` والـ scoped styles القديمة بالكامل.
- [x] **منفّذ**: استُبدلت بطاقات `ValidationCard.vue` بمكون `<Message>` مع `severity` مناسب (`warn`/`error`/`success`) بدل الـ classes اليدوية (`bg-yellow-50`, إلخ). تم الإبقاء على الأيقونة الملونة المتحركة (`animate-bounce`/`animate-ping`/`animate-pulse`) كعنصر `span` مخصص داخل الـ Message، فلم يُفقد التخصيص البصري الأصلي.
- [ ] **لم يُنفّذ**: تفعيل `unplugin-vue-components` مع PrimeVue resolver — مؤجل، قرار أداء/راحة وليس ضرورة.

---

## ترتيب التنفيذ المقترح
1. Task 0 (إجباري أولاً — بدونه أي مكون PrimeVue هيفشل في العرض).
2. Task 4 ثم Task 3 (الأبسط، أقل مخاطرة، لاختبار إن الإعداد شغال صح).
3. Task 5 (Select — متوسط التعقيد).
4. Task 1 و Task 2 (DatePicker — يحتاج قرار تحويل Date/string).
5. Task 6 (AutoComplete — الأعقد، أكبر إعادة هيكلة).
6. Task 7 (اختياري، بعد الموافقة على الترحيل الأساسي).

## ملاحظات مخاطر
- PrimeVue وThemes حالياً على إصدارات **rc** (`5.0.0-rc.1` و `3.0.0-rc.1`) — ممكن يكون فيه breaking changes قبل الإصدار النهائي. يُفضّل تثبيت الإصدار الدقيق (بدون `^`) وتوثيق أي API غير مستقر يُكتشف أثناء التنفيذ.
- كل تغيير لازم يتفحص تحت RTL فعلياً (مش بس افتراض إنه "هيشتغل تلقائي") — خصوصاً القوائم المنسدلة (`Select`, `AutoComplete`, `DatePicker`) لأن اتجاه الفتح والـ icons ممكن تحتاج تعديل يدوي.
- لا يوجد تعديل مطلوب على منطق الطباعة (`printDoc`) لأن الفورم بالكامل تحت `no-print` ولا يظهر في المستند المطبوع.
