$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Posts = Get-Content -LiteralPath (Join-Path $Root 'week15-posts.json') -Raw | ConvertFrom-Json
$ImageDir = Join-Path $Root 'featured-images'
New-Item -ItemType Directory -Force -Path $ImageDir | Out-Null

function New-FeaturedImage {
  param(
    [string]$Path,
    [string]$Title,
    [string]$Focus,
    [int]$Index
  )

  $width = 1200
  $height = 630
  $bmp = New-Object System.Drawing.Bitmap $width, $height
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  $palettes = @(
    @('#09243a', '#19a7ce', '#72e5d1'),
    @('#101827', '#5fb3ff', '#f2c94c'),
    @('#0b302a', '#30d5a0', '#f5f7fa'),
    @('#1f2440', '#7b61ff', '#00d4ff'),
    @('#171717', '#ffb703', '#8ecae6')
  )
  $palette = $palettes[$Index % $palettes.Count]
  $c1 = [System.Drawing.ColorTranslator]::FromHtml($palette[0])
  $c2 = [System.Drawing.ColorTranslator]::FromHtml($palette[1])
  $accent = [System.Drawing.ColorTranslator]::FromHtml($palette[2])
  $white = [System.Drawing.Color]::FromArgb(245, 248, 250)

  $rect = New-Object System.Drawing.Rectangle 0, 0, $width, $height
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, $c1, $c2, 25
  $g.FillRectangle($brush, $rect)

  $gridPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(35, 255, 255, 255)), 1
  for ($x = 0; $x -lt $width; $x += 80) { $g.DrawLine($gridPen, $x, 0, $x + 140, $height) }
  for ($y = 40; $y -lt $height; $y += 80) { $g.DrawLine($gridPen, 0, $y, $width, $y - 80) }

  $nodePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(110, $accent)), 3
  $nodeBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(170, $accent))
  for ($i = 0; $i -lt 9; $i++) {
    $x = 720 + (($i * 83) % 390)
    $y = 95 + (($i * 127) % 390)
    $g.FillEllipse($nodeBrush, $x, $y, 16, 16)
    if ($i -gt 0) {
      $px = 720 + ((($i - 1) * 83) % 390) + 8
      $py = 95 + ((($i - 1) * 127) % 390) + 8
      $g.DrawLine($nodePen, $px, $py, $x + 8, $y + 8)
    }
  }

  $overlay = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(120, 0, 0, 0))
  $g.FillRectangle($overlay, 0, 0, 720, $height)

  $titleFont = New-Object System.Drawing.Font 'Segoe UI Semibold', 45
  $metaFont = New-Object System.Drawing.Font 'Segoe UI', 22
  $whiteBrush = New-Object System.Drawing.SolidBrush $white

  $titleRect = New-Object System.Drawing.RectangleF 66, 95, 610, 310
  $format = New-Object System.Drawing.StringFormat
  $format.Trimming = [System.Drawing.StringTrimming]::EllipsisWord
  $g.DrawString($Title, $titleFont, $whiteBrush, $titleRect, $format)

  $focusRect = New-Object System.Drawing.RectangleF 70, 448, 600, 80
  $g.DrawString($Focus, $metaFont, $whiteBrush, $focusRect, $format)

  $footerPen = New-Object System.Drawing.Pen $accent, 5
  $g.DrawLine($footerPen, 70, 552, 420, 552)

  $OutDir = Split-Path -Parent $Path
  New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
  if (Test-Path -LiteralPath $Path) {
    Remove-Item -LiteralPath $Path -Force
  }
  $g.Dispose()
  $stream = New-Object System.IO.MemoryStream
  $bmp.Save($stream, [System.Drawing.Imaging.ImageFormat]::Png)
  [System.IO.File]::WriteAllBytes($Path, $stream.ToArray())
  $stream.Dispose()
  $bmp.Dispose()
}

$i = 0
foreach ($post in $Posts) {
  New-FeaturedImage -Path $post.imageFile -Title $post.title -Focus $post.focus -Index $i
  $i += 1
}

Write-Output "Generated $($Posts.Count) featured images in $ImageDir"
