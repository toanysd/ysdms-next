param (
    [Parameter(Mandatory=$true)]
    [string]$Version
)

$SourceDir = "f:\AntiGravity\Projects\ysdms-nextgen"
$DestDir = "f:\AntiGravity\Releases\ysdms-nextgen_releases\$Version"

Write-Host "===================================================="
Write-Host "YSDMS-NEXTGEN RELEASE PACKAGER"
Write-Host "Source: $SourceDir"
Write-Host "Target: $DestDir"
Write-Host "===================================================="

if (Test-Path $DestDir) {
    Write-Host "WARNING: Target directory already exists." -ForegroundColor Yellow
    Write-Host "Please use a new version number (Auto-Bump)." -ForegroundColor Yellow
    exit 1
}

New-Item -ItemType Directory -Force -Path $DestDir | Out-Null

# Exclude directories
$Excludes = @(".git", "node_modules", ".next", "source_data", ".agents", ".ai", "release", "docs", "migrations")

# Create robocopy command string
$RoboArgs = @(
    $SourceDir,
    $DestDir,
    "/MIR",
    "/XD"
) + $Excludes + @(
    "/XF",
    "*.rar",
    "*.zip",
    "*.py",
    "out*.txt",
    "ts_error*.txt",
    "excel_*.txt",
    "schema_*.txt",
    "create_release.bat"
)

# Run robocopy
& robocopy $RoboArgs

# Robocopy exit codes < 8 are considered successful
if ($LASTEXITCODE -lt 8) {
    Write-Host "`n[SUCCESS] Release $Version has been created at $DestDir" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n[ERROR] Robocopy failed with exit code $LASTEXITCODE." -ForegroundColor Red
    exit $LASTEXITCODE
}
