$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Posts = Get-Content -LiteralPath (Join-Path $Root 'june-2026-posts.json') -Raw | ConvertFrom-Json
$ImageDir = Join-Path $Root 'featured-images'
New-Item -ItemType Directory -Force -Path $ImageDir | Out-Null

function Split-Lines {
  param(
    [System.Drawing.Graphics]$Graphics,
    [string]$Text,
    [System.Drawing.Font]$Font,
    [int]$MaxWidth
  )
  $words = $Text -split '\s+'
  $lines = New-Object System.Collections.Generic.List[string]
  $line = ''
  foreach ($word in $words) {
    $candidate = if ($line) { "$line $word" } else { $word }
    $size = $Graphics.MeasureString($candidate, $Font)
    if ($size.Width -le $MaxWidth -or -not $line) {
      $line = $candidate
    } else {
      $lines.Add($line)
      $line = $word
    }
  }
  if ($line) { $lines.Add($line) }
  return $lines
}

function New-FeaturedImage {
  param(
    [string]$Path,
    [string]$Title,
    [string]$Focus,
    [int]$Index
  )

  $width = 1200
  $height = 1200
  $bmp = New-Object System.Drawing.Bitmap $width, $height
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  $palettes = @(
    @('#102542', '#0f8b8d', '#f5d547'),
    @('#252422', '#eb5e28', '#fffcf2'),
    @('#12372a', '#436850', '#fbfada'),
    @('#2f2d52', '#687eff', '#98e4ff'),
    @('#0b132b', '#3a506b', '#6fffe9'),
    @('#331832', '#d81e5b', '#f4d35e')
  )
  $palette = $palettes[$Index % $palettes.Count]
  $c1 = [System.Drawing.ColorTranslator]::FromHtml($palette[0])
  $c2 = [System.Drawing.ColorTranslator]::FromHtml($palette[1])
  $accent = [System.Drawing.ColorTranslator]::FromHtml($palette[2])
  $white = [System.Drawing.Color]::FromArgb(248, 250, 252)

  $rect = New-Object System.Drawing.Rectangle 0, 0, $width, $height
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, $c1, $c2, 35
  $g.FillRectangle($brush, $rect)

  $gridPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(30, 255, 255, 255)), 2
  for ($i = -200; $i -lt 1400; $i += 96) {
    $g.DrawLine($gridPen, $i, 0, $i + 400, $height)
    $g.DrawLine($gridPen, 0, $i, $width, $i + 240)
  }

  $shapeBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(48, $accent))
  $shapePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(120, $accent)), 4
  for ($i = 0; $i -lt 7; $i++) {
    $x = 720 + (($i * 71) % 350)
    $y = 150 + (($i * 113) % 520)
    $g.FillEllipse($shapeBrush, $x, $y, 190, 190)
    $g.DrawEllipse($shapePen, $x, $y, 190, 190)
  }

  $panelBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(168, 0, 0, 0))
  $g.FillRectangle($panelBrush, 0, 0, 760, $height)

  $titleFont = New-Object System.Drawing.Font 'Segoe UI Semibold', 50
  $focusFont = New-Object System.Drawing.Font 'Segoe UI', 25
  $smallFont = New-Object System.Drawing.Font 'Segoe UI Semibold', 22
  $whiteBrush = New-Object System.Drawing.SolidBrush $white
  $accentBrush = New-Object System.Drawing.SolidBrush $accent

  $g.FillRectangle($accentBrush, 78, 96, 142, 12)
  $g.DrawString('June 2026', $smallFont, $whiteBrush, 78, 130)

  $titleLines = Split-Lines -Graphics $g -Text $Title -Font $titleFont -MaxWidth 620
  $y = 250
  foreach ($line in $titleLines) {
    if ($y -gt 720) { break }
    $g.DrawString($line, $titleFont, $whiteBrush, 78, $y)
    $y += 68
  }

  $focusLines = Split-Lines -Graphics $g -Text $Focus -Font $focusFont -MaxWidth 620
  $y = 880
  foreach ($line in $focusLines) {
    if ($y -gt 1030) { break }
    $g.DrawString($line, $focusFont, $whiteBrush, 78, $y)
    $y += 38
  }

  $footerPen = New-Object System.Drawing.Pen $accent, 6
  $g.DrawLine($footerPen, 78, 1080, 520, 1080)

  $OutDir = Split-Path -Parent $Path
  New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
  if (Test-Path -LiteralPath $Path) { Remove-Item -LiteralPath $Path -Force }

  $stream = New-Object System.IO.MemoryStream
  $bmp.Save($stream, [System.Drawing.Imaging.ImageFormat]::Png)
  [System.IO.File]::WriteAllBytes($Path, $stream.ToArray())
  $stream.Dispose()
  $g.Dispose()
  $bmp.Dispose()
}

$i = 0
foreach ($post in $Posts) {
  New-FeaturedImage -Path $post.imageFile -Title $post.title -Focus $post.focus -Index $i
  $i += 1
}

Write-Output "Generated $($Posts.Count) square featured images in $ImageDir"
