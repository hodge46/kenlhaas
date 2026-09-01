# Tiny static file server for local preview (no Node/Python needed).
# Usage:  right-click > Run with PowerShell   — or —   powershell -ExecutionPolicy Bypass -File serve.ps1
# Then open http://localhost:8123/  (Ctrl+C to stop)

param(
  [string]$Root = $PSScriptRoot,
  [int]$Port = 8123
)

Add-Type -AssemblyName System.Web
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Serving $Root at http://localhost:$Port/"

$mime = @{
  ".html"="text/html"; ".htm"="text/html"; ".css"="text/css"; ".js"="application/javascript";
  ".json"="application/json"; ".svg"="image/svg+xml"; ".png"="image/png"; ".jpg"="image/jpeg";
  ".jpeg"="image/jpeg"; ".gif"="image/gif"; ".ico"="image/x-icon"; ".pdf"="application/pdf";
  ".woff"="font/woff"; ".woff2"="font/woff2"; ".txt"="text/plain"; ".md"="text/markdown"
}

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response
    $rel = [System.Web.HttpUtility]::UrlDecode($req.Url.AbsolutePath).TrimStart("/")
    if ([string]::IsNullOrEmpty($rel)) { $rel = "index.html" }
    $path = Join-Path $Root $rel
    if ((Test-Path $path -PathType Container)) { $path = Join-Path $path "index.html" }

    if (Test-Path $path -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($path).ToLower()
      $ct = $mime[$ext]; if (-not $ct) { $ct = "application/octet-stream" }
      $bytes = [System.IO.File]::ReadAllBytes($path)
      $res.ContentType = $ct
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $res.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $rel")
      $res.OutputStream.Write($msg, 0, $msg.Length)
    }
    $res.OutputStream.Close()
  } catch {
    Write-Host "Error: $_"
  }
}
