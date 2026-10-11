<?php
$ok = false;
$err = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $nombre = trim($_POST['nombre'] ?? '');
  $edad = trim($_POST['edad'] ?? '');
  $origen = trim($_POST['origen'] ?? '');
  $prision = trim($_POST['prision'] ?? '');
  $condena = trim($_POST['condena'] ?? '');
  $hecho = trim($_POST['hecho'] ?? '');
  $quien = trim($_POST['quien'] ?? '');
  $contacto = trim($_POST['contacto'] ?? '');
  if ($nombre === '' || $hecho === '') {
    $err = 'Faltan el nombre y qué pasó.';
  } elseif (empty($_FILES['foto']['tmp_name']) || $_FILES['foto']['error'] !== UPLOAD_ERR_OK) {
    $err = 'Falta la foto.';
  } elseif ($_FILES['foto']['size'] > 8 * 1024 * 1024) {
    $err = 'La foto pasa de 8 MB.';
  } else {
    $info = @getimagesize($_FILES['foto']['tmp_name']);
    $okTypes = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp'];
    if (!$info || !isset($okTypes[$info[2]])) {
      $err = 'La foto tiene que ser JPG, PNG o WEBP.';
    } else {
      $dir = __DIR__ . '/reportes-presos';
      if (!is_dir($dir)) mkdir($dir, 0755, true);
      $id = date('Ymd-His') . '-' . bin2hex(random_bytes(3));
      $ext = $okTypes[$info[2]];
      $foto = $dir . '/' . $id . '.' . $ext;
      if (!move_uploaded_file($_FILES['foto']['tmp_name'], $foto)) {
        $err = 'No se pudo guardar la foto.';
      } else {
        $txt = "ID: $id\nNombre: $nombre\nEdad: $edad\nOrigen: $origen\nPrisión: $prision\nCondena: $condena\nQuién envía: $quien\nContacto: $contacto\n\nQué pasó:\n$hecho\n";
        file_put_contents($dir . '/' . $id . '.txt', $txt);
        $ok = true;
      }
    }
  }
}
?><!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Enviar un preso político · CubaLibre51</title>
<meta name="description" content="Envía nombre, foto y qué pasó. La ficha se revisa antes de publicarse.">
<link rel="icon" href="logo.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800&family=Rajdhani:wght@400;600&display=swap">
<link rel="stylesheet" href="css/estilo.css?v=6">
<style>
.submenu a::before,.submenu a::after,.leer::after,.btn::after,.btn-ver::after,.sub-btn::before,.sub-btn::after{content:none !important}
.ficha-form{display:grid;gap:.8rem;max-width:720px}
.ficha-form label{display:grid;gap:.25rem}
.ficha-form input,.ficha-form textarea{width:100%;padding:.55rem .7rem;background:#0c1424;color:#fff;border:1px solid rgba(255,255,255,.2)}
.ficha-form button{justify-self:start}
.aviso{color:#f0d2b0}
</style>
</head>
<body>
  <div class="bar"><span>★ Estados Unidos · Cuba · Estrella 51 ★</span></div>
  <header>
    <div class="top"><a class="logo" href="index.html"><img src="logo.svg" alt="" width="42" height="49">CUBALIBRE51 <span class="stars">★★★</span></a>
      <button class="menu-btn" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="menu"><span></span><span></span><span></span></button></div>
    <nav id="menu" aria-label="Secciones">
      <a href="index.html">Inicio</a>
      <a href="noticias.html">Noticias</a>
      <div class="nav-sub">
        <a href="anexion.html">Anexión</a><button class="sub-btn" type="button" aria-expanded="false" aria-controls="sub-anexion" aria-label="Submenú de Anexión"></button>
        <div class="submenu" id="sub-anexion"><a href="anexion.html#articulos">Artículos</a><a href="anexionistas.html">Anexionistas</a></div>
      </div>
      <a href="presos-politicos.html" class="on" aria-current="page">Presos Políticos</a>
      <a href="videos.html">Videos</a>
      <a href="represores.html">Represores</a>
      <a href="canciones.html">Canciones</a>
    </nav>
  </header>
  <div class="hero phero art-hero">
    <div class="hero-bg" aria-hidden="true"><div class="bg bg-presos on"></div></div>
    <div class="stripes"></div><div class="field"></div><div class="scan"></div>
    <div class="hero-inner"><div class="hero-card"><h1>Enviar un preso político</h1></div></div>
  </div>
  <main>
    <div class="articulo-wrap">
      <a class="volver" href="presos-politicos.html">← Volver a Presos políticos</a>
      <p class="intro">Si conoces a alguien preso por pensar distinto, salir a la calle o decirlo en un video, envía la ficha. No se publica solo. Se revisa antes de salir en la página.</p>
      <?php if ($ok): ?>
        <p class="aviso">Recibido. El expediente queda guardado para revisión. No aparece en la página hasta que se compruebe.</p>
      <?php else: ?>
        <?php if ($err): ?><p class="aviso"><?= htmlspecialchars($err) ?></p><?php endif; ?>
        <form class="ficha-form" method="post" enctype="multipart/form-data">
          <label>Nombre<input name="nombre" required maxlength="120"></label>
          <label>Edad<input name="edad" maxlength="40"></label>
          <label>Origen<input name="origen" maxlength="160" placeholder="Municipio, provincia"></label>
          <label>Prisión<input name="prision" maxlength="160"></label>
          <label>Condena<input name="condena" maxlength="160" placeholder="Años, o prisión provisional"></label>
          <label>Foto<input name="foto" type="file" accept="image/jpeg,image/png,image/webp" required></label>
          <label>Qué pasó<textarea name="hecho" required maxlength="2000" rows="6" placeholder="Fecha, lugar, por qué lo detuvieron"></textarea></label>
          <label>Tu nombre<input name="quien" maxlength="120"></label>
          <label>Tu correo o teléfono<input name="contacto" maxlength="160"></label>
          <button class="btn" type="submit">Enviar ficha</button>
        </form>
      <?php endif; ?>
    </div>
  </main>
  <footer><div class="inner"><span>CUBALIBRE51</span><span class="stars">★★★★★</span></div>
    <p class="copy">© 2026 CubaLibre51 · cubalibre51.com. Todos los derechos reservados.</p></footer>
<script src="js/sitio.js?v=6"></script>
</body>
</html>
