# STEP 5 - VERIFY (PostToolUse hook)
#
# Runs AFTER every Edit/Write. If a C# file changed, run the test suite.
# The edit has already happened, so exit 2 cannot undo it - instead stderr is
# fed back to the agent as "your change broke these tests", and it must react.
#
# This is evidence the agent cannot talk its way around: the harness runs the
# tests, not the agent.

try {
    $call = [Console]::In.ReadToEnd() | ConvertFrom-Json
    $path = [string]$call.tool_input.file_path
} catch {
    exit 0   # can't tell what changed; don't block the session over it
}

if ($path -notmatch '\.(cs|csproj)$') { exit 0 }

$root = if ($env:CLAUDE_PROJECT_DIR) { $env:CLAUDE_PROJECT_DIR } else { (Get-Location).Path }
# 'Continue' matters: in Windows PowerShell 5.1, 'Stop' + 2>&1 turns dotnet's
# stderr into a terminating error, and the hook would exit 1 instead of 2.
$ErrorActionPreference = 'Continue'
$output = & dotnet test "$root" --nologo -v q 2>&1 | Out-String

if ($LASTEXITCODE -ne 0) {
    $tail = ($output -split "`r?`n" | Where-Object { $_ -match 'error|Failed|Assert|Expected|Actual' } | Select-Object -First 30) -join "`n"
    [Console]::Error.WriteLine("Tests FAILED after editing $path`n$tail")
    exit 2
}

exit 0
