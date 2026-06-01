param(
  [string]$GeneratedStartFile = "$env:TEMP\technijian_june_imagegen_start.txt"
)

$ErrorActionPreference = "Stop"

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = (Resolve-Path (Join-Path $scriptRoot "..\..\..\..\..")).Path
$postsPath = Join-Path $scriptRoot "june-2026-posts.json"
$imageDir = Join-Path $scriptRoot "featured-images"
$uploadImageDir = Join-Path $scriptRoot "featured-images-upload"
$archiveImageDir = Join-Path $repoRoot "clients\TECH\technijian.com\Website Blogs\June_2026_Blogs\featured-images"
$archiveUploadImageDir = Join-Path $repoRoot "clients\TECH\technijian.com\Website Blogs\June_2026_Blogs\featured-images-upload"
$manifestPath = Join-Path $scriptRoot "june-2026-chatgpt-image-replacement.json"

$titleTextBySlug = @{
  "mfa-patient-data-oc-healthcare-2026" = "MFA for Patient Data"
  "azure-vs-aws-socal-enterprise-2026" = "Azure vs AWS"
  "fix-duplicate-content-oc-seo-2026" = "Fix Duplicate Content"
  "gemini-business-use-cases-orange-county-2026" = "Gemini for Business"
  "google-ai-mode-ai-overviews-oc-seo-2026" = "Google AI Mode SEO"
  "downtime-costs-oc-businesses-it-risk-2026" = "Downtime Risk"
  "ai-agents-supply-chain-socal-2026" = "AI Agents Supply Chain"
  "seo-oc-hvac-companies-2026" = "SEO for OC HVAC"
  "ai-predictive-maintenance-orange-county-2026" = "AI Predictive Maintenance"
  "cisa-ransomware-guidance-oc-small-businesses-2026" = "CISA Ransomware Guidance"
  "pci-compliance-orange-county-retailers-2026" = "PCI Compliance"
  "real-time-dashboard-development-2026" = "Real-Time Dashboards"
  "how-chatgpt-recommends-businesses-oc-brands-2026" = "ChatGPT Business Visibility"
  "choose-ai-consulting-partner-orange-county-2026" = "Choose an AI Partner"
  "microsoft-365-copilot-governance-before-rollout-2026" = "Copilot Governance"
  "remote-work-security-oc-healthcare-2026" = "Remote Work Security"
  "evaluate-software-development-partner-2026-scorecard" = "Software Partner Scorecard"
}

if (!(Test-Path $GeneratedStartFile)) {
  throw "Generated image marker file not found: $GeneratedStartFile"
}

$generatedSince = [DateTimeOffset]::Parse((Get-Content $GeneratedStartFile -Raw).Trim()).LocalDateTime
$generatedRoot = Join-Path $env:USERPROFILE ".codex\generated_images"
$generatedImages = Get-ChildItem -Path $generatedRoot -Recurse -File -Filter *.png |
  Where-Object { $_.LastWriteTime -gt $generatedSince } |
  Sort-Object LastWriteTime |
  Select-Object -First 17

if ($generatedImages.Count -ne 17) {
  throw "Expected 17 generated images after $generatedSince, found $($generatedImages.Count)."
}

New-Item -ItemType Directory -Force -Path $imageDir | Out-Null
New-Item -ItemType Directory -Force -Path $uploadImageDir | Out-Null
New-Item -ItemType Directory -Force -Path $archiveImageDir | Out-Null
New-Item -ItemType Directory -Force -Path $archiveUploadImageDir | Out-Null

Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Windows.Forms

function Get-Font {
  param([float]$Size, [System.Drawing.FontStyle]$Style)

  $families = [System.Drawing.FontFamily]::Families.Name
  $name = if ($families -contains "Segoe UI Semibold") {
    "Segoe UI Semibold"
  } elseif ($families -contains "Segoe UI") {
    "Segoe UI"
  } else {
    "Arial"
  }

  return [System.Drawing.Font]::new($name, $Size, $Style, [System.Drawing.GraphicsUnit]::Pixel)
}

function Save-Png {
  param(
    [System.Drawing.Bitmap]$Bitmap,
    [string]$Path
  )

  $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/png" } | Select-Object -First 1
  $params = [System.Drawing.Imaging.EncoderParameters]::new(1)
  $params.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::ColorDepth, 32L)
  $Bitmap.Save($Path, $codec, $params)
}

function Save-Jpeg {
  param(
    [System.Drawing.Bitmap]$Bitmap,
    [string]$Path,
    [long]$Quality = 86
  )

  $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" } | Select-Object -First 1
  $params = [System.Drawing.Imaging.EncoderParameters]::new(1)
  $params.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, $Quality)
  $Bitmap.Save($Path, $codec, $params)
}

function Render-FeaturedImage {
  param(
    [string]$SourcePath,
    [string]$DestinationPath,
    [string]$UploadPath,
    [string]$TitleText
  )

  $source = [System.Drawing.Image]::FromFile($SourcePath)
  $canvas = [System.Drawing.Bitmap]::new(1200, 1200, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($canvas)

  try {
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    $scale = [Math]::Max(1200 / $source.Width, 1200 / $source.Height)
    $drawWidth = [int][Math]::Ceiling($source.Width * $scale)
    $drawHeight = [int][Math]::Ceiling($source.Height * $scale)
    $drawX = [int][Math]::Floor((1200 - $drawWidth) / 2)
    $drawY = [int][Math]::Floor((1200 - $drawHeight) / 2)
    $graphics.DrawImage($source, $drawX, $drawY, $drawWidth, $drawHeight)

    $gradientRect = [System.Drawing.Rectangle]::new(0, 550, 1200, 650)
    $gradient = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
      $gradientRect,
      [System.Drawing.Color]::FromArgb(0, 5, 12, 22),
      [System.Drawing.Color]::FromArgb(230, 5, 12, 22),
      [System.Drawing.Drawing2D.LinearGradientMode]::Vertical
    )
    $graphics.FillRectangle($gradient, $gradientRect)
    $gradient.Dispose()

    $panelBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(118, 4, 18, 33))
    $graphics.FillRectangle($panelBrush, [System.Drawing.Rectangle]::new(0, 760, 1200, 440))
    $panelBrush.Dispose()

    $accentBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 48, 196, 181))
    $graphics.FillRectangle($accentBrush, [System.Drawing.Rectangle]::new(78, 772, 118, 8))
    $accentBrush.Dispose()

    $layout = [System.Drawing.SizeF]::new(1044, 330)
    $format = [System.Drawing.StringFormat]::new()
    $format.Alignment = [System.Drawing.StringAlignment]::Near
    $format.LineAlignment = [System.Drawing.StringAlignment]::Near
    $format.Trimming = [System.Drawing.StringTrimming]::Word

    $fontSize = 74.0
    $font = $null
    do {
      if ($font) { $font.Dispose() }
      $font = Get-Font -Size $fontSize -Style ([System.Drawing.FontStyle]::Bold)
      $measured = $graphics.MeasureString($TitleText, $font, $layout, $format)
      if ($measured.Height -le 270 -and $measured.Width -le 1044) { break }
      $fontSize -= 2
    } while ($fontSize -ge 48)

    $textRect = [System.Drawing.RectangleF]::new(76, 815, 1044, 330)
    $shadowBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(180, 0, 0, 0))
    $whiteBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 255, 255, 255))

    $shadowRect = [System.Drawing.RectangleF]::new($textRect.X + 4, $textRect.Y + 5, $textRect.Width, $textRect.Height)
    $graphics.DrawString($TitleText, $font, $shadowBrush, $shadowRect, $format)
    $graphics.DrawString($TitleText, $font, $whiteBrush, $textRect, $format)

    $shadowBrush.Dispose()
    $whiteBrush.Dispose()
    $font.Dispose()
    $format.Dispose()

    Save-Png -Bitmap $canvas -Path $DestinationPath
    Save-Jpeg -Bitmap $canvas -Path $UploadPath
  } finally {
    $graphics.Dispose()
    $canvas.Dispose()
    $source.Dispose()
  }
}

$posts = Get-Content $postsPath -Raw | ConvertFrom-Json
$results = New-Object System.Collections.Generic.List[object]

for ($i = 0; $i -lt $posts.Count; $i++) {
  $post = $posts[$i]
  $slug = [string]$post.slug
  if (!$titleTextBySlug.ContainsKey($slug)) {
    throw "Missing title overlay text for slug: $slug"
  }

  $sourcePath = $generatedImages[$i].FullName
  $destinationPath = Join-Path $imageDir "$slug.png"
  $uploadPath = Join-Path $uploadImageDir "$slug.jpg"
  $archivePath = Join-Path $archiveImageDir "$slug.png"
  $archiveUploadPath = Join-Path $archiveUploadImageDir "$slug.jpg"
  $titleText = $titleTextBySlug[$slug]

  Render-FeaturedImage -SourcePath $sourcePath -DestinationPath $destinationPath -UploadPath $uploadPath -TitleText $titleText
  Copy-Item -LiteralPath $destinationPath -Destination $archivePath -Force
  Copy-Item -LiteralPath $uploadPath -Destination $archiveUploadPath -Force

  $destItem = Get-Item -LiteralPath $destinationPath
  $uploadItem = Get-Item -LiteralPath $uploadPath
  $results.Add([pscustomobject]@{
    slug = $slug
    title = $post.title
    titleText = $titleText
    generatedSource = $sourcePath
    finalImage = $destinationPath
    uploadImage = $uploadPath
    archiveImage = $archivePath
    archiveUploadImage = $archiveUploadPath
    finalBytes = $destItem.Length
    uploadBytes = $uploadItem.Length
    generatedAt = $generatedImages[$i].LastWriteTime.ToString("o")
  })
}

$manifest = [pscustomobject]@{
  generatedSince = $generatedSince.ToString("o")
  generatedRoot = $generatedRoot
  generationMode = "ChatGPT-generated background artwork with controlled local title/topic overlay"
  imageRequirements = @(
    "1:1 square featured images",
    "No persona text",
    "No Technijian text",
    "Only approved topic/title overlay text"
  )
  count = $results.Count
  images = $results
}

$manifest | ConvertTo-Json -Depth 6 | Set-Content -Path $manifestPath -Encoding UTF8

$archiveManifestPath = Join-Path (Split-Path $archiveImageDir -Parent) "june-2026-chatgpt-image-replacement.json"
Copy-Item -LiteralPath $manifestPath -Destination $archiveManifestPath -Force

Write-Host "Rendered $($results.Count) ChatGPT featured images."
Write-Host "Manifest: $manifestPath"
