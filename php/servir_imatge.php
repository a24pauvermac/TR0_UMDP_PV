<?php
// Aquest fitxer serveix per mostrar les imatges de banderes que estan guardades al servidor
// Quan el JavaScript demana una imatge amb 'php/servir_imatge.php?fitxer=nom.jpg',
// aquest script busca l'arxiu a la carpeta d'uploads i el mostra a la pàgina
// Això és necessari perquè les imatges no es poden accedir directament des del navegador
// si estan fora de la carpeta pública del servidor web

$nomFitxer = $_GET['fitxer'];

// Validar que el nom del fitxer sigui segur (només lletres, números, guions i punts)
if (!preg_match('/^[a-zA-Z0-9._-]+$/', $nomFitxer)) {
    http_response_code(400);
    echo "Nom de fitxer no vàlid";
    exit;
}

$rutaImatge = __DIR__ . '/../../assets/uploads/banderas/' . $nomFitxer;

// Verificar que el fitxer existeix i està dins de la carpeta correcta
if (file_exists($rutaImatge) && strpos(realpath($rutaImatge), realpath(__DIR__ . '/../../assets/uploads/banderas/')) === 0) {
    header('Content-Type: image/jpeg');
    readfile($rutaImatge);
} else {
    http_response_code(404);
    echo "Imatge no trobada";
}
?>
