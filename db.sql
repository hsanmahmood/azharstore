-- Create translations table if it doesn't exist
CREATE TABLE IF NOT EXISTS translations (
    id SERIAL PRIMARY KEY,
    lang VARCHAR(10) NOT NULL,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    UNIQUE (lang, key)
);

-- Insert some default translations
INSERT INTO translations (lang, key, value) VALUES
('en', 'admin.nav.translations', 'Translations'),
('ar', 'admin.nav.translations', 'الترجمات'),
('en', 'admin.translations.title', 'Translations'),
('ar', 'admin.translations.title', 'الترجمات'),
('en', 'admin.translations.loading', 'Loading translations...'),
('ar', 'admin.translations.loading', 'جاري تحميل الترجمات...'),
('en', 'admin.translations.key', 'Key'),
('ar', 'admin.translations.key', 'المفتاح'),
('en', 'admin.translations.value', 'Value'),
('ar', 'admin.translations.value', 'القيمة'),
('en', 'admin.translations.edit', 'Edit'),
('ar', 'admin.translations.edit', 'تعديل'),
('en', 'admin.translations.editTitle', 'Edit Translation'),
('ar', 'admin.translations.editTitle', 'تعديل الترجمة'),
('en', 'admin.translations.save', 'Save'),
('ar', 'admin.translations.save', 'حفظ'),
('en', 'admin.translations.saving', 'Saving...'),
('ar', 'admin.translations.saving', 'جاري الحفظ...'),
('en', 'admin.translations.cancel', 'Cancel'),
('ar', 'admin.translations.cancel', 'إلغاء'),
('en', 'admin.translations.updateSuccess', 'Translation updated successfully'),
('ar', 'admin.translations.updateSuccess', 'تم تحديث الترجمة بنجاح'),
('en', 'admin.translations.updateError', 'Failed to update translation'),
('ar', 'admin.translations.updateError', 'فشل في تحديث الترجمة');
