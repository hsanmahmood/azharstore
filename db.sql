-- Create translations table if it doesn't exist
CREATE TABLE IF NOT EXISTS translations (
    id SERIAL PRIMARY KEY,
    lang VARCHAR(10) NOT NULL,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    UNIQUE (lang, key)
);

-- Insert new translations for the add/edit modal
INSERT INTO translations (lang, key, value) VALUES
('en', 'admin.translations.addTitle', 'Add New Translation'),
('ar', 'admin.translations.addTitle', 'إضافة ترجمة جديدة'),
('en', 'admin.translations.add', 'Add'),
('ar', 'admin.translations.add', 'إضافة'),
('en', 'admin.translations.adding', 'Adding...'),
('ar', 'admin.translations.adding', 'جاري الإضافة...'),
('en', 'admin.translations.addSuccess', 'Translation added successfully'),
('ar', 'admin.translations.addSuccess', 'تمت إضافة الترجمة بنجاح'),
('en', 'admin.translations.addError', 'Failed to add translation'),
('ar', 'admin.translations.addError', 'فشل في إضافة الترجمة'),
('en', 'admin.translations.searchPlaceholder', 'Search translations...'),
('ar', 'admin.translations.searchPlaceholder', 'ابحث في الترجمات...');

INSERT INTO translations (lang, key, value) VALUES ('ar', 'Login', 'تسجيل الدخول');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'Logout', 'تسجيل الخروج');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'Dashboard', 'لوحة التحكم');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'Products', 'المنتجات');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'Categories', 'الفئات');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'Admin Panel', 'لوحة الإدارة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'common.search', 'بحث');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'common.save', 'حفظ');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'common.cancel', 'إلغاء');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'common.delete', 'حذف');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'common.edit', 'تعديل');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'common.add', 'إضافة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'common.confirm', 'تأكيد');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'common.create', 'إنشاء');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'common.saveChanges', 'حفظ التغييرات');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'common.actions', 'الإجراءات');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'common.currency', 'د.ب');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'common.notAvailable', 'غير متوفر');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'common.allCategories', 'جميع الفئات');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'common.filterByCategory', 'التصفية حسب الفئة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'common.allCustomers', 'جميع العملاء');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'common.filterByCustomer', 'التصفية حسب العميل');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'common.allProducts', 'جميع المنتجات');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'common.filterByProduct', 'التصفية حسب المنتج');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'common.productsWithOrders', 'المنتجات المطلوبة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'common.productsWithoutOrders', 'المنتجات غير المطلوبة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'common.filterByOrders', 'التصفية حسب الطلبات');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'settings.title', 'الإعدادات');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'settings.deliverySettings', 'إعدادات التوصيل');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'settings.freeDeliveryThreshold', 'الحد الأدنى للتوصيل المجاني');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'settings.deliveryAreas', 'مناطق التوصيل');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'settings.addArea', 'إضافة منطقة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'settings.editArea', 'تعديل منطقة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'settings.areaName', 'اسم المنطقة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'settings.deliveryPrice', 'سعر التوصيل');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'settings.confirmDeleteArea', 'هل أنت متأكد من حذف منطقة التوصيل هذه؟');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'settings.deliveryArea', 'منطقة التوصيل');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'settings.selectArea', 'اختر منطقة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'settings.delivery', 'التوصيل');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'settings.messages', 'الرسائل');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'settings.deliveryMessage', 'رسالة التوصيل');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'settings.pickupMessage', 'رسالة الاستلام');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'settings.areaUpdatedSuccess', 'تم تحديث المنطقة بنجاح');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'settings.areaAddedSuccess', 'تم إضافة المنطقة بنجاح');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'settings.areaSaveError', 'فشل في حفظ المنطقة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'settings.areaDeletedSuccess', 'تم حذف المنطقة بنجاح');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'settings.areaDeleteError', 'فشل في حذف المنطقة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'settings.deliverySettingsSaved', 'تم حفظ إعدادات التوصيل');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'settings.deliverySettingsError', 'فشل في حفظ إعدادات التوصيل');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'settings.messagesSaved', 'تم حفظ الرسائل');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'settings.messagesError', 'فشل في حفظ الرسائل');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.title', 'إدارة المنتجات');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.addProduct', 'إضافة منتج');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.editProduct', 'تعديل منتج');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.confirmDelete', 'هل أنت متأكد من حذف هذا المنتج؟');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.form.name', 'اسم المنتج');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.form.description', 'الوصف');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.form.price', 'السعر');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.form.category', 'الفئة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.form.selectCategory', 'اختر فئة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.form.stock', 'الكمية');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.form.images', 'الصور');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.form.primaryImage', 'الصورة الأساسية');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.form.galleryImages', 'صور المعرض');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.form.image', 'الصورة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.form.variants', 'الخيارات');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.form.addVariant', 'إضافة خيار');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.form.variantName', 'اسم الخيار');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.form.totalStock', 'إجمالي المخزون');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.form.imagesSelected', '{{count}} صور مختارة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.form.clickToUpload', 'انقر لتحميل الصور');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.form.draftName', 'منتج جديد (مسودة)');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.form.downloadAll', 'تحميل الكل');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.imageAlt', 'صورة المنتج');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.primaryBadge', 'الأساسية');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.tooltips.viewImage', 'عرض الصورة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.tooltips.setAsPrimary', 'تعيين كأساسية');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.tooltips.downloadImage', 'تحميل الصورة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.tooltips.removeImage', 'إزالة الصورة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.actions.view', 'عرض');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.actions.setAsPrimary', 'تعيين كأساسية');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.actions.download', 'تحميل');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.actions.remove', 'إزالة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.imagePreview', 'معاينة الصورة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.tabs.details', 'التفاصيل');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.tabs.images', 'الصور');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.tabs.variants', 'الخيارات');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.saving', 'جاري الحفظ...');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.uploadingImages', 'جاري رفع الصور...');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.errors.fetch', 'فشل في تحميل المنتجات');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.errors.add', 'فشل في إضافة المنتج');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.errors.update', 'فشل في تحديث المنتج');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.errors.delete', 'فشل في حذف المنتج');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.errors.draftError', 'فشل في إنشاء مسودة المنتج');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.errors.uploadError', 'فشل في تحميل الصور');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.errors.addVariantError', 'فشل في إضافة الخيار');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.errors.updateVariantError', 'فشل في تحديث الخيار');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.errors.variantInUse', 'لا يمكن حذف الخيار لأنه مستخدم في طلب حالي.');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.errors.saveVariantFirst', 'يرجى حفظ الخيار أولاً');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.errors.variantNameRequired', 'اسم الخيار مطلوب');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.errors.downloadFailed', 'فشل التحميل');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.errors.noImagesToDownload', 'لا توجد صور للتحميل');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.errors.unexpected', 'حدث خطأ غير متوقع');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.notifications.productAdded', 'تم إضافة المنتج بنجاح');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.notifications.productUpdated', 'تم تحديث المنتج بنجاح');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.notifications.productDeleted', 'تم حذف المنتج بنجاح');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.notifications.variantAdded', 'تم إضافة الخيار بنجاح');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.notifications.variantUpdated', 'تم تحديث الخيار بنجاح');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'productManagement.notifications.variantImageUploaded', 'تم رفع صورة الخيار بنجاح');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'categoryManagement.title', 'إدارة الفئات');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'categoryManagement.addCategory', 'إضافة فئة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'categoryManagement.editCategory', 'تعديل فئة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'categoryManagement.confirmDelete', 'هل أنت متأكد من حذف هذه الفئة؟');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'categoryManagement.form.name', 'اسم الفئة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'categoryManagement.errors.fetch', 'فشل في تحميل الفئات');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'categoryManagement.errors.add', 'فشل في إضافة الفئة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'categoryManagement.errors.update', 'فشل في تحديث الفئة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'categoryManagement.errors.delete', 'فشل في حذف الفئة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'categoryManagement.notifications.added', 'تم إضافة الفئة بنجاح');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'categoryManagement.notifications.updated', 'تم تحديث الفئة بنجاح');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'categoryManagement.notifications.deleted', 'تم حذف الفئة بنجاح');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'admin.nav.products', 'المنتجات');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'admin.nav.categories', 'الفئات');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'admin.nav.customers', 'العملاء');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'admin.nav.home', 'الرئيسية');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'admin.nav.translations', 'الترجمات');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'admin.translations.title', 'الترجمات');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'admin.translations.loading', 'جاري تحميل الترجمات...');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'admin.translations.key', 'المفتاح');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'admin.translations.value', 'القيمة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'admin.translations.edit', 'تعديل');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'admin.translations.editTitle', 'تعديل الترجمة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'admin.translations.save', 'حفظ');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'admin.translations.saving', 'جاري الحفظ...');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'admin.translations.cancel', 'إلغاء');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'admin.translations.updateSuccess', 'تم تحديث الترجمة بنجاح');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'admin.translations.updateError', 'فشل في تحديث الترجمة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'customerManagement.title', 'إدارة العملاء');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'customerManagement.addCustomer', 'إضافة عميل');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'customerManagement.editCustomer', 'تعديل عميل');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'customerManagement.confirmDelete', 'هل أنت متأكد من حذف هذا العميل؟');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'customerManagement.table.name', 'الاسم');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'customerManagement.table.phone', 'رقم الهاتف');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'customerManagement.table.town', 'المدينة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'customerManagement.table.address', 'العنوان');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'customerManagement.form.name', 'الاسم');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'customerManagement.form.phone', 'رقم الهاتف');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'customerManagement.form.town', 'المدينة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'customerManagement.form.addressHome', 'المنزل');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'customerManagement.form.addressRoad', 'الطريق');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'customerManagement.form.addressBlock', 'المجمع');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'customerManagement.form.address', 'العنوان');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'customerManagement.form.phoneHint', 'يجب أن يتكون رقم الهاتف من 8 أرقام');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'customerManagement.form.phoneValidationError', 'لم يستوفِ رقم الهاتف متطلبات الطول');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'customerManagement.errors.fetch', 'فشل في تحميل العملاء');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'customerManagement.errors.submit', 'فشل في حفظ العميل');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'customerManagement.errors.delete', 'فشل في حذف العميل');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'customerManagement.notifications.added', 'تم إضافة العميل بنجاح');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'customerManagement.notifications.updated', 'تم تحديث العميل بنجاح');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'customerManagement.notifications.deleted', 'تم حذف العميل بنجاح');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.title', 'إدارة الطلبات');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.addOrder', 'إضافة طلب');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.editOrder', 'تعديل طلب');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.confirmDelete', 'هل أنت متأكد من حذف هذا الطلب؟');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.table.orderId', 'رقم الطلب');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.table.customer', 'العميل');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.table.status', 'الحالة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.table.shippingMethod', 'طريقة الشحن');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.table.total', 'المجموع');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.table.date', 'التاريخ');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.form.customer', 'العميل');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.form.selectCustomer', 'اختر عميل');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.form.products', 'المنتجات');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.form.addProduct', 'إضافة منتج');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.form.shippingMethod', 'طريقة الشحن');
INSERT INTO translations (lang, aney, value) VALUES ('ar', 'orderManagement.form.selectShippingMethod', 'اختر طريقة الشحن');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.form.status', 'الحالة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.form.selectStatus', 'اختر الحالة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.form.comments', 'ملاحظات');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.form.orderItems', 'عناصر الطلب');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.form.noVariants', 'لا توجد خيارات');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.form.selectProduct', 'اختر منتج');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.form.selectVariant', 'اختر خيار');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.form.productNotFound', 'المنتج غير موجود');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.form.total', 'المجموع');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.form.subtotal', 'المجموع الفرعي');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.form.freeDeliveryApplied', 'تم تطبيق التوصيل المجاني');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.form.unitPrice', 'سعر الوحدة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.form.quantity', 'الكمية');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.freeDeliveryApplied', 'تم تطبيق التوصيل المجاني');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.status.processing', 'قيد المعالجة');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.status.ready', 'جاهز');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.status.shipped', 'تم الشحن');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.status.delivered', 'تم التوصيل');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.status.cancelled', 'تم الإلغاء');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.shipping.delivery', 'توصيل');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.shipping.pick_up', 'استلام');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.errors.fetch', 'فشل في تحميل الطلبات');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.errors.submit', 'فشل في حفظ الطلب');
INSERT INTO translations (lang, key, value) VALUES ('ar', 'orderManagement.errors.freeDeliveryApplied', 'تم تطبيق التوصيل المجاني');
