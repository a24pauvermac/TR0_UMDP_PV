<?php
// Aquest fitxer serveix per mostrar les imatges de banderes que estan guardades al servidor
// Quan el JavaScript demana una imatge amb 'php/servir_imatge.php?fitxer=nom.jpg',
// aquest script busca l'arxiu a la carpeta d'uploads i el mostra a la pàgina
// Això és necessari perquè les imatges no es poden accedir directament des del navegador
// si estan fora de la carpeta pública del servidor web

$nomFitxer = $_GET['fitxer'];
$rutaImatge = __DIR__ . '/../../assets/uploads/banderas/' . $nomFitxer;

if (file_exists($rutaImatge)) {
    header('Content-Type: image/jpeg');
    readfile($rutaImatge);
} else {
    echo "Imatge no trobada";
}
?>
