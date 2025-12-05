# Remove all comments from code files
# This script removes comments from Python, JavaScript, JSX, and SQL files

$projectRoot = "c:\Users\m3332\OneDrive\المستندات\Hasan\Hasan\Development\az\az"

# Function to remove Python comments
function Remove-PythonComments {
    param([string]$content)
    
    # Remove single-line comments (# ...)
    $content = $content -replace '(?m)^\s*#.*$', ''
    
    # Remove inline comments (code # comment)
    $content = $content -replace '\s+#.*$', ''
    
    # Remove multi-line docstrings (""" ... """)
    $content = $content -replace '(?s)""".*?"""', ''
    
    # Remove multi-line docstrings (''' ... ''')
    $content = $content -replace "(?s)'''.*?'''", ''
    
    # Remove empty lines
    $content = ($content -split "`n" | Where-Object { $_.Trim() -ne '' }) -join "`n"
    
    return $content
}

# Function to remove JavaScript/JSX comments
function Remove-JSComments {
    param([string]$content)
    
    # Remove single-line comments (// ...)
    $content = $content -replace '(?m)^\s*//.*$', ''
    
    # Remove inline comments (code // comment)
    $content = $content -replace '\s+//.*$', ''
    
    # Remove multi-line comments (/* ... */)
    $content = $content -replace '(?s)/\*.*?\*/', ''
    
    # Remove empty lines
    $content = ($content -split "`n" | Where-Object { $_.Trim() -ne '' }) -join "`n"
    
    return $content
}

# Function to remove SQL comments
function Remove-SQLComments {
    param([string]$content)
    
    # Remove single-line comments (-- ...)
    $content = $content -replace '(?m)^\s*--.*$', ''
    
    # Remove inline comments (code -- comment)
    $content = $content -replace '\s+--.*$', ''
    
    # Remove multi-line comments (/* ... */)
    $content = $content -replace '(?s)/\*.*?\*/', ''
    
    # Remove empty lines
    $content = ($content -split "`n" | Where-Object { $_.Trim() -ne '' }) -join "`n"
    
    return $content
}

# Process Python files
Write-Host "Processing Python files..." -ForegroundColor Cyan
Get-ChildItem -Path "$projectRoot\backend" -Filter "*.py" -Recurse | ForEach-Object {
    Write-Host "  Processing: $($_.Name)" -ForegroundColor Yellow
    $content = Get-Content $_.FullName -Raw
    $cleaned = Remove-PythonComments $content
    Set-Content -Path $_.FullName -Value $cleaned -NoNewline
}

# Process JavaScript/JSX files
Write-Host "`nProcessing JavaScript/JSX files..." -ForegroundColor Cyan
Get-ChildItem -Path "$projectRoot\frontend\src" -Include "*.js","*.jsx" -Recurse | ForEach-Object {
    Write-Host "  Processing: $($_.Name)" -ForegroundColor Yellow
    $content = Get-Content $_.FullName -Raw
    $cleaned = Remove-JSComments $content
    Set-Content -Path $_.FullName -Value $cleaned -NoNewline
}

# Process SQL files
Write-Host "`nProcessing SQL files..." -ForegroundColor Cyan
Get-ChildItem -Path $projectRoot -Filter "*.sql" -Recurse | ForEach-Object {
    Write-Host "  Processing: $($_.Name)" -ForegroundColor Yellow
    $content = Get-Content $_.FullName -Raw
    $cleaned = Remove-SQLComments $content
    Set-Content -Path $_.FullName -Value $cleaned -NoNewline
}

Write-Host "`nDone! All comments have been removed." -ForegroundColor Green
Write-Host "WARNING: This action cannot be undone. Make sure you have a backup!" -ForegroundColor Red
