<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: reportar.html'); exit; }
$dir = __DIR__ . '/reportes';
if (!is_dir($dir)) mkdir($dir, 0700, true);
$nombre = trim($_POST['nombre'] ?? '');
$cargo = trim($_POST['cargo'] ?? '');
$inst = trim($_POST['institucion'] ?? '');
$zona = trim($_POST['zona'] ?? '');
$hecho = trim($_POST['hecho'] ?? '');
$victimas = trim($_POST['victimas'] ?? '');
$den = trim($_POST['denunciante'] ?? '');
$contacto = trim($_POST['contacto'] ?? '');
if ($nombre === '' || $cargo === '' || $inst === '' || $zona === '' || $hecho === '' || $contacto === '') {
  exit('Faltan datos.');
}
$id = date('Ymd-His') . '-' . bin2hex(random_bytes(3));
$foto = $_FILES['foto'] ?? null;
$ext = '';
if ($foto && $foto['error'] === UPLOAD_ERR_OK && $foto['size'] <= 5000000) {
  $mime = mime_content_type($foto['tmp_name']);
  $map = ['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp'];
  if (isset($map[$mime])) {
    $ext = $map[$mime];
    move_uploaded_file($foto['tmp_name'], "$dir/$id.$ext");
  }
}
$txt = "ID: $id\nNombre: $nombre\nCargo: $cargo\nInstitucion: $inst\nZona: $zona\nHecho: $hecho\nVictimas: $victimas\nDenunciante: $den\nContacto: $contacto\nFoto: " . ($ext ? "$id.$ext" : "no") . "\n";
file_put_contents("$dir/$id.txt", $txt);
header('Location: reportar.html?enviado=1');
