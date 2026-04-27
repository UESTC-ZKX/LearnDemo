$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$stdoutLog = Join-Path $projectRoot 'devserver.log'
$stderrLog = Join-Path $projectRoot 'devserver.err.log'
$pidFile = Join-Path $projectRoot 'devserver.pid'
$hostAddress = '0.0.0.0'
$port = 5173

function Test-PortListening {
  param([int]$TargetPort)

  $connection = Get-NetTCPConnection -State Listen -LocalPort $TargetPort -ErrorAction SilentlyContinue |
    Select-Object -First 1

  return $null -ne $connection
}

function Reset-LogFile {
  param(
    [string]$LogPath,
    [string]$LogName
  )

  try {
    Set-Content -LiteralPath $LogPath -Value ''
  }
  catch {
    Write-Warning "Unable to reset ${LogName} at ${LogPath}. $($_.Exception.Message)"
  }
}

if (Test-PortListening -TargetPort $port) {
  Write-Output "Dev server is already listening at http://${hostAddress}:${port}/"
  exit 0
}

Reset-LogFile -LogPath $stdoutLog -LogName 'stdout log'
Reset-LogFile -LogPath $stderrLog -LogName 'stderr log'

$process = Start-Process `
  -FilePath 'cmd.exe' `
  -ArgumentList '/c', 'npm.cmd run dev -- --host 0.0.0.0' `
  -WorkingDirectory $projectRoot `
  -WindowStyle Hidden `
  -RedirectStandardOutput $stdoutLog `
  -RedirectStandardError $stderrLog `
  -PassThru

Set-Content -LiteralPath $pidFile -Value $process.Id

Start-Sleep -Milliseconds 1200

if (Test-PortListening -TargetPort $port) {
  Write-Output "Started hidden dev server at http://${hostAddress}:${port}/"
  exit 0
}

Write-Output 'Dev server process started, but port 5173 is not ready yet. Check devserver.log for status.'
exit 0
