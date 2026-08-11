#!/usr/bin/env pwsh
# Git extension: create-pr.ps1
# Stage changes, ensure isolated branch with proper naming convention (FEATURE, BUG, FIX, TODO),
# audit TODO-TREE tags, push to remote origin, and open a Pull Request (PR).
[CmdletBinding()]
param(
    [ValidateSet('feature', 'bug', 'fix', 'todo', 'refactor', 'docs', 'FEATURE', 'BUG', 'FIX', 'TODO')]
    [string]$Type = 'feature',
    [string]$Title = '',
    [string]$Description = '',
    [string]$BaseBranch = 'main',
    [switch]$DryRun,
    [switch]$Json,
    [switch]$Help
)

$ErrorActionPreference = 'Stop'

if ($Help) {
    Write-Host "Usage: ./create-pr.ps1 [-Type <feature|bug|fix|todo|refactor|docs>] [-Title <title>] [-Description <text>] [-BaseBranch <branch>] [-DryRun] [-Json]"
    exit 0
}

function Find-ProjectRoot {
    param([string]$StartDir)
    $current = Resolve-Path $StartDir
    while ($true) {
        foreach ($marker in @('.specify', '.git')) {
            if (Test-Path (Join-Path $current $marker)) {
                return $current
            }
        }
        $parent = Split-Path $current -Parent
        if ($parent -eq $current) { return $null }
        $current = $parent
    }
}

$repoRoot = Find-ProjectRoot -StartDir $PSScriptRoot
if (-not $repoRoot) { $repoRoot = Get-Location }
Set-Location $repoRoot

# Check if git is available
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "Error: Git is not installed or available in PATH."
    exit 1
}

# Check inside work tree
$savedEAP = $ErrorActionPreference
$ErrorActionPreference = 'Continue'
try {
    git rev-parse --is-inside-work-tree 2>$null | Out-Null
    $isRepo = ($LASTEXITCODE -eq 0)
} finally {
    $ErrorActionPreference = $savedEAP
}

if (-not $isRepo) {
    Write-Error "Error: Current directory is not a Git repository."
    exit 1
}

# Determine current branch
$currentBranch = ''
$savedEAP = $ErrorActionPreference
$ErrorActionPreference = 'Continue'
try {
    $currentBranch = (git rev-parse --abbrev-ref HEAD 2>$null).Trim()
} finally {
    $ErrorActionPreference = $savedEAP
}
$workType = $Type.ToLower()

# Standard prefixes
$standardPrefixes = @('feature/', 'bug/', 'fix/', 'todo/', 'refactor/', 'docs/', 'FEATURE/', 'BUG/', 'FIX/', 'TODO/')
$hasStandardPrefix = $false
foreach ($prefix in $standardPrefixes) {
    if ($currentBranch.StartsWith($prefix, [System.StringComparison]::OrdinalIgnoreCase)) {
        $hasStandardPrefix = $true
        break
    }
}

# If current branch is main/master or doesn't have standard prefix, prompt/create isolated branch
$targetBranch = $currentBranch
if (-not $hasStandardPrefix -or $currentBranch -eq 'main' -or $currentBranch -eq 'master') {
    $slug = if ($Title) {
        $Title.ToLower() -replace '[^a-z0-9]', '-' -replace '-{2,}', '-' -replace '^-', '' -replace '-$', ''
    } else {
        "update-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    }
    if ($slug.Length -gt 40) { $slug = $slug.Substring(0, 40) }
    
    $targetBranch = "$workType/$slug"
    
    if (-not $DryRun) {
        Write-Host "[specify] Creating isolated branch '$targetBranch'..." -ForegroundColor Cyan
        $savedEAP = $ErrorActionPreference
        $ErrorActionPreference = 'Continue'
        try {
            git checkout -b $targetBranch 2>$null | Out-Null
            if ($LASTEXITCODE -ne 0) {
                git checkout $targetBranch 2>$null | Out-Null
            }
        } finally {
            $ErrorActionPreference = $savedEAP
        }
    }
}

# Scan working tree for TODO-TREE tags
$todoTreeTags = @()
$modifiedFiles = @()
$untrackedFiles = @()

$savedEAP = $ErrorActionPreference
$ErrorActionPreference = 'Continue'
try {
    $modifiedFiles = git diff --name-only HEAD 2>$null
    $untrackedFiles = git ls-files --others --exclude-standard 2>$null
} finally {
    $ErrorActionPreference = $savedEAP
}

$allFilesToAudit = @($modifiedFiles; $untrackedFiles) | Where-Object { $_ } | Select-Object -Unique

foreach ($file in $allFilesToAudit) {
    $filePath = Join-Path $repoRoot $file
    if (Test-Path $filePath -PathType Leaf) {
        # Check text extension
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        if ($ext -match '\.(js|ts|jsx|tsx|py|cs|java|go|cpp|c|h|rs|php|rb|swift|kt|css|scss|html|md|json|yml|yaml|sql)$') {
            $lineNumber = 0
            Get-Content $filePath -ErrorAction SilentlyContinue | ForEach-Object {
                $lineNumber++
                if ($_ -match '\b(TODO|FIXME|BUG|HACK|XXX|REVIEW):\s*(.+)$') {
                    $todoTreeTags += [PSCustomObject]@{
                        Tag         = $matches[1]
                        File        = $file
                        Line        = $lineNumber
                        Description = $matches[2].Trim()
                    }
                }
            }
        }
    }
}

# Stage and Commit changes if any exist
$hasChanges = $false
$savedEAP = $ErrorActionPreference
$ErrorActionPreference = 'Continue'
try {
    git diff --quiet HEAD 2>$null; $d1 = $LASTEXITCODE
    git diff --cached --quiet 2>$null; $d2 = $LASTEXITCODE
    $untracked = git ls-files --others --exclude-standard 2>$null
} finally {
    $ErrorActionPreference = $savedEAP
}

if ($d1 -ne 0 -or $d2 -ne 0 -or $untracked) {
    $hasChanges = $true
}

if ($hasChanges -and -not $DryRun) {
    $commitTitle = if ($Title) { $Title } else { "Complete $workType implementation" }
    $commitMsg = "[$Type] $commitTitle"
    
    Write-Host "[specify] Staging and committing changes..." -ForegroundColor Cyan
    $savedEAP = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        git add . 2>$null | Out-Null
        git commit -m $commitMsg 2>&1 | Out-Null
    } finally {
        $ErrorActionPreference = $savedEAP
    }
}

# Audit Summary Markdown
$todoAuditLines = @()
if ($todoTreeTags.Count -gt 0) {
    $todoAuditLines += ''
    $todoAuditLines += '### TODO-TREE Audit Summary'
    $todoAuditLines += ''
    $todoAuditLines += '| Tag | File | Line | Description |'
    $todoAuditLines += '|-----|------|------|-------------|'
    foreach ($item in $todoTreeTags) {
        $tagStr = $item.Tag
        $fileStr = $item.File
        $lineStr = $item.Line
        $descStr = $item.Description
        $todoAuditLines += "| **$tagStr** | ``$fileStr`` | $lineStr | $descStr |"
    }
} else {
    $todoAuditLines += ''
    $todoAuditLines += '### TODO-TREE Audit Summary'
    $todoAuditLines += ''
    $todoAuditLines += 'No open TODO/FIXME tags found in modified code.'
}
$todoAuditSummary = $todoAuditLines -join "`n"

# Construct PR Body
$prTitle = if ($Title) { "[$Type] $Title" } else { "[$Type] Implementation update on $targetBranch" }
$prBodyLines = @(
    '## Pull Request Overview',
    '',
    "**Work Type**: $workType",
    "**Branch**: $targetBranch",
    "**Base Branch**: $BaseBranch",
    '',
    '### Summary of Changes',
    $Description,
    $todoAuditSummary
)
$prBody = $prBodyLines -join "`n"

# Push to remote and Create PR
$hasGhCli = $false
if (Get-Command gh -ErrorAction SilentlyContinue) {
    $savedEAP = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        gh auth status 2>$null | Out-Null
        $hasGhCli = ($LASTEXITCODE -eq 0)
    } finally {
        $ErrorActionPreference = $savedEAP
    }
}

if (-not $DryRun) {
    Write-Host "[specify] Pushing branch '$targetBranch' to remote origin..." -ForegroundColor Cyan
    $savedEAP = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        git push -u origin $targetBranch 2>&1 | Out-Null
    } finally {
        $ErrorActionPreference = $savedEAP
    }
}

$prUrl = ""
if ($hasGhCli -and -not $DryRun) {
    Write-Host "[specify] Creating GitHub Pull Request..." -ForegroundColor Green
    $savedEAP = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        $prUrl = gh pr create --base $BaseBranch --head $targetBranch --title $prTitle --body $prBody 2>&1
        Write-Host "[OK] Pull Request created successfully! $prUrl" -ForegroundColor Green
    } catch {
        Write-Warning "[specify] Could not create PR via gh CLI: $_"
    } finally {
        $ErrorActionPreference = $savedEAP
    }
}

if ($Json) {
    [PSCustomObject]@{
        BRANCH_NAME = $targetBranch
        TYPE        = $workType
        PR_TITLE    = $prTitle
        PR_URL      = $prUrl
        HAS_GH      = $hasGhCli
        TODOS_FOUND = $todoTreeTags.Count
    } | ConvertTo-Json -Compress
} else {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "  PULL REQUEST SUMMARY & DETAILS" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "Branch: $targetBranch"
    Write-Host "Title:  $prTitle"
    if ($prUrl) {
        Write-Host "PR URL: $prUrl" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "PR Description Preview:" -ForegroundColor Yellow
        Write-Host $prBody
    }
}
