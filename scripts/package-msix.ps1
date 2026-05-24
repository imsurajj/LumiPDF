param(
  [string]$OutputPath = "store-package\LumiPDF.msix",
  [string]$PfxPath = "store-package\lumipdf_cert.pfx",
  [string]$PfxPassword = $env:LUMIPDF_PFX_PASSWORD
)

$ErrorActionPreference = 'Stop'

function Get-LatestSdkToolPath {
  param(
    [Parameter(Mandatory = $true)]
    [string]$ToolName
  )

  $sdkRoot = "C:\Program Files (x86)\Windows Kits\10\bin"
  $tools = Get-ChildItem $sdkRoot -Recurse -Filter "$ToolName.exe" -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -match '\\x64\\' } |
    Sort-Object FullName -Descending

  if (-not $tools) {
    throw "Could not find $ToolName.exe under $sdkRoot. Install the Windows SDK."
  }

  return $tools[0].FullName
}

if (-not $PfxPassword) {
  throw 'Set LUMIPDF_PFX_PASSWORD before running this script.'
}

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $repoRoot

Write-Host 'Building frontend...'
npm run build

Write-Host 'Building Rust release binary...'
cargo build --release --manifest-path src-tauri\Cargo.toml

$releaseExe = Join-Path $repoRoot 'src-tauri\target\release\lumipdf.exe'
if (-not (Test-Path $releaseExe)) {
  throw "Release binary not found: $releaseExe"
}

$stagingRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("lumipdf-msix-" + [Guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Force -Path $stagingRoot | Out-Null

try {
  Copy-Item $releaseExe (Join-Path $stagingRoot 'lumipdf.exe') -Force
  Copy-Item (Join-Path $repoRoot 'Package.appxmanifest') (Join-Path $stagingRoot 'AppxManifest.xml') -Force
  Copy-Item (Join-Path $repoRoot 'Assets') (Join-Path $stagingRoot 'Assets') -Recurse -Force

  $makeAppx = Get-LatestSdkToolPath -ToolName 'makeappx'
  $signtool = Get-LatestSdkToolPath -ToolName 'signtool'

  New-Item -ItemType Directory -Force -Path (Split-Path $OutputPath) | Out-Null

  Write-Host "Packaging MSIX to $OutputPath..."
  & $makeAppx pack /d $stagingRoot /p $OutputPath /o | Out-Host

  if (-not (Test-Path $PfxPath)) {
    throw "PFX not found: $PfxPath"
  }

  Write-Host 'Signing MSIX...'
  & $signtool sign /fd SHA256 /td SHA256 /tr http://timestamp.digicert.com /f $PfxPath /p $PfxPassword $OutputPath | Out-Host

  Write-Host 'Verifying signature...'
  Get-AuthenticodeSignature $OutputPath | Format-List Status,StatusMessage,SignerCertificate,TimeStamperCertificate
}
finally {
  if (Test-Path $stagingRoot) {
    Remove-Item $stagingRoot -Recurse -Force
  }
}
