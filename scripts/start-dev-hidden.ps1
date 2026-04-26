$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$stdoutLog = Join-Path $projectRoot 'devserver.log'
$stderrLog = Join-Path $projectRoot 'devserver.err.log'
$pidFile = Join-Path $projectRoot 'devserver.pid'
$hostAddress = '127.0.0.1'
$port = 5173

function Test-PortListening {
  param([int]$TargetPort)

  $connection = Get-NetTCPConnection -State Listen -LocalPort $TargetPort -ErrorAction SilentlyContinue |
    Select-Object -First 1

  return $null -ne $connection
}

if (Test-PortListening -TargetPort $port) {
  Write-Output "Dev server is already listening at http://${hostAddress}:${port}/"
  exit 0
}

Set-Content -LiteralPath $stdoutLog -Value ''
Set-Content -LiteralPath $stderrLog -Value ''

$process = Start-Process `
  -FilePath 'cmd.exe' `
  -ArgumentList '/c', 'npm.cmd run dev -- --host 127.0.0.1' `
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
