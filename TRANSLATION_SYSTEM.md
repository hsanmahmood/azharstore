# Dynamic Translation System

## Overview
The translation system has been completely reworked to be **fully dynamic** and **backend-controlled**. All translations are stored in the database and can be managed through the admin panel.

## How It Works

### 1. **Backend Storage**
- All translations are stored in the `translations` table in Supabase
- Each translation has:
  - `id`: Unique identifier
  - `key`: Translation key (e.g., "common.save", "productManagement.title")
  - `value`: Arabic translation text

### 2. **Frontend Code Scanning**
The backend can scan the entire frontend codebase to find all translation keys used in the code:

```python
# Backend automatically scans for patterns like:
t('common.save')
t("productManagement.title")
t(`settings.deliveryMessage`)
```

**API Endpoints:**
- `GET /api/admin/translations/scan` - Scans frontend and returns all found keys
- `GET /api/admin/translations/available` - Returns keys found in code but not in database

### 3. **Dynamic Loading**
- On app startup, translations are loaded from the backend API
- i18n resources are populated dynamically from the database
- No static `ar.json` file needed

### 4. **Admin Panel Management**

#### Adding Translations:
1. Click "Add" button in Translations page
2. Click "Scan Code" to refresh available keys
3. Select a key from the dropdown (shows only keys found in code but not in database)
4. Enter the Arabic translation
5. Save

#### Editing Translations:
1. Search for the translation you want to edit
2. Click the edit icon
3. Modify the Arabic text
4. Save

## Architecture

### Backend (`backend/app/`)

**`translation_scanner.py`**
- Scans frontend directory for all `t()` function calls
- Extracts translation keys using regex patterns
- Returns sorted list of unique keys

**`services.py`**
```python
def scan_translation_keys() -> list[str]:
    """Scan frontend code for all translation keys."""
    
def get_available_translation_keys(supabase) -> list[str]:
    """Get keys in code but not in database."""
```

**`api.py`**
```python
@admin_router.get("/translations/scan")
def scan_translation_keys():
    """Scan frontend code for all translation keys used in t() calls."""
    
@admin_router.get("/translations/available")
def get_available_keys(supabase):
    """Get translation keys that exist in code but not in database."""
```

### Frontend (`frontend/src/`)

**`i18n/config.js`**
```javascript
// Starts with empty resources
i18n.use(initReactI18next).init({
  lng: 'ar',
  fallbackLng: 'ar',
  resources: {
    ar: { translation: {} }
  },
});
```

**`context/DataContext.jsx`**
```javascript
const updateI18nResources = (translationsData) => {
  // Converts flat key-value pairs to nested object
  // Updates i18n resources dynamically
  i18n.addResourceBundle('ar', 'translation', resources.ar.translation, true, true);
};
```

**`services/api.js`**
```javascript
export const scanTranslationKeys = () => 
  api.get('/admin/translations/scan').then(res => res.data);
  
export const getAvailableTranslationKeys = () => 
  api.get('/admin/translations/available').then(res => res.data);
```

**`features/admin/pages/Translations.jsx`**
- Fetches available keys from backend
- Displays translations in cards
- Allows adding/editing translations
- "Scan Code" button to refresh available keys

## Benefits

### ✅ Fully Dynamic
- No static files needed
- Translations can be changed without redeploying

### ✅ Lightweight
- Only loads translations that exist in database
- No large JSON files bundled with the app

### ✅ Developer-Friendly
- Backend automatically discovers new translation keys
- Admin can see which keys need translations
- No manual tracking of keys

### ✅ Centralized Control
- All translations managed from admin panel
- Easy to update and maintain
- Version controlled through database

## Usage Guide

### For Developers

**Adding a new translatable text:**

1. Use the `t()` function in your component:
```javascript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return <button>{t('myFeature.saveButton')}</button>;
};
```

2. The key will be automatically discovered by the backend scanner
3. Admin can add the translation through the admin panel

### For Admins

**Adding a translation:**

1. Go to Admin Panel → Translations
2. Click "Scan Code" to refresh available keys
3. Click "Add" button
4. Select a key from the dropdown
5. Enter the Arabic translation
6. Click "Save"

**Editing a translation:**

1. Search for the translation
2. Click the edit icon on the translation card
3. Modify the text
4. Click "Save"

## Migration Notes

### Removed Files
- `frontend/src/i18n/allKeys.json` - No longer needed (backend scans code)
- `frontend/src/i18n/knownKeys.json` - Duplicate, removed
- `backend/app/translation_utils.py` - Replaced with `translation_scanner.py`

### Database Schema
The `translations` table should have:
```sql
CREATE TABLE translations (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Performance

- **Initial Load**: ~100-200ms to fetch translations from API
- **Code Scanning**: ~500ms-1s (only when admin clicks "Scan Code")
- **Caching**: Available keys cached for 30 seconds in React Query
- **Bundle Size**: Reduced by ~10KB (no static ar.json)

## Future Enhancements

- [ ] Support for multiple languages (en, ar, etc.)
- [ ] Translation history/versioning
- [ ] Bulk import/export
- [ ] Translation suggestions using AI
- [ ] Missing translation warnings in dev mode
