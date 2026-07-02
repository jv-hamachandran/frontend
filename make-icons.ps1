# Generates raster favicons from the Finhashy logo (two interlocking rounded squares).
# Run once from the website/ folder:  powershell -ExecutionPolicy Bypass -File make-icons.ps1
Add-Type -AssemblyName System.Drawing

function New-RoundedRectPath([single]$x, [single]$y, [single]$w, [single]$h, [single]$r) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $r * 2
  $path.AddArc($x, $y, $d, $d, 180, 90)
  $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $path.CloseFigure()
  return $path
}

function New-LogoBitmap([int]$size) {
  $bmp = New-Object System.Drawing.Bitmap($size, $size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.Clear([System.Drawing.Color]::Transparent)

  # logo defined on a 64x64 grid; scale to target size.
  $s = $size / 64.0
  $stroke = 7.0 * $s
  $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 37, 99, 235)), $stroke
  $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

  $a = New-RoundedRectPath (9.5*$s) (9.5*$s) (26*$s) (26*$s) (8.5*$s)
  $b = New-RoundedRectPath (28.5*$s) (28.5*$s) (26*$s) (26*$s) (8.5*$s)
  $g.DrawPath($pen, $a)
  $g.DrawPath($pen, $b)

  $g.Dispose(); $pen.Dispose(); $a.Dispose(); $b.Dispose()
  return $bmp
}

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$assets = Join-Path $here 'assets'
if (-not (Test-Path $assets)) { New-Item -ItemType Directory -Path $assets | Out-Null }

# PNG icons
foreach ($sz in 48, 192) {
  $b = New-LogoBitmap $sz
  $b.Save((Join-Path $assets "favicon-$sz.png"), [System.Drawing.Imaging.ImageFormat]::Png)
  $b.Dispose()
}
# apple touch icon (180) on solid white for iOS
$apple = New-Object System.Drawing.Bitmap(180, 180)
$ag = [System.Drawing.Graphics]::FromImage($apple)
$ag.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$ag.Clear([System.Drawing.Color]::White)
$logo = New-LogoBitmap 180
$ag.DrawImage($logo, 0, 0, 180, 180)
$apple.Save((Join-Path $assets 'apple-touch-icon.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$ag.Dispose(); $apple.Dispose(); $logo.Dispose()

# favicon.ico: PNG-compressed ICO containing 16, 32, 48
$sizes = 16, 32, 48
$pngStreams = @()
foreach ($sz in $sizes) {
  $b = New-LogoBitmap $sz
  $ms = New-Object System.IO.MemoryStream
  $b.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
  $pngStreams += ,($ms.ToArray())
  $b.Dispose(); $ms.Dispose()
}
$icoPath = Join-Path $here 'favicon.ico'
$fs = [System.IO.File]::Create($icoPath)
$bw = New-Object System.IO.BinaryWriter($fs)
$bw.Write([UInt16]0)      # reserved
$bw.Write([UInt16]1)      # type = icon
$bw.Write([UInt16]$sizes.Count)
$offset = 6 + (16 * $sizes.Count)
for ($i = 0; $i -lt $sizes.Count; $i++) {
  $sz = $sizes[$i]; $data = $pngStreams[$i]
  $bw.Write([Byte]($(if ($sz -ge 256) {0} else {$sz})))  # width
  $bw.Write([Byte]($(if ($sz -ge 256) {0} else {$sz})))  # height
  $bw.Write([Byte]0)       # colors
  $bw.Write([Byte]0)       # reserved
  $bw.Write([UInt16]1)     # planes
  $bw.Write([UInt16]32)    # bpp
  $bw.Write([UInt32]$data.Length)
  $bw.Write([UInt32]$offset)
  $offset += $data.Length
}
foreach ($data in $pngStreams) { $bw.Write($data) }
$bw.Flush(); $bw.Close(); $fs.Close()

Write-Output "Icons generated: assets/favicon-48.png, assets/favicon-192.png, assets/apple-touch-icon.png, favicon.ico"
