-- Missing translation keys for the new Translations page
INSERT INTO translations (key, value) VALUES ('admin.translations.add', 'إضافة') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
INSERT INTO translations (key, value) VALUES ('admin.translations.addTitle', 'إضافة ترجمة') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
INSERT INTO translations (key, value) VALUES ('admin.translations.adding', 'جاري الإضافة...') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
INSERT INTO translations (key, value) VALUES ('admin.translations.addSuccess', 'تم إضافة الترجمة بنجاح') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
INSERT INTO translations (key, value) VALUES ('admin.translations.addError', 'فشل في إضافة الترجمة') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
INSERT INTO translations (key, value) VALUES ('admin.translations.searchPlaceholder', 'ابحث عن ترجمة...') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
INSERT INTO translations (key, value) VALUES ('common.toggleSidebar', 'تبديل الشريط الجانبي') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
INSERT INTO translations (key, value) VALUES ('orderManagement.notifications.added', 'تم إضافة الطلب بنجاح') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
INSERT INTO translations (key, value) VALUES ('orderManagement.notifications.updated', 'تم تحديث الطلب بنجاح') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
INSERT INTO translations (key, value) VALUES ('orderManagement.notifications.deleted', 'تم حذف الطلب بنجاح') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
INSERT INTO translations (key, value) VALUES ('orderManagement.errors.delete', 'فشل في حذف الطلب') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
