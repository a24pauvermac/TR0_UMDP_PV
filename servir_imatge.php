<?php
$nomFitxer = $_GET['fitxer'];
$rutaImatge = __DIR__ . '/../../assets/uploads/banderas/' . $nomFitxer;

if (file_exists($rutaImatge)) {
    header('Content-Type: image/jpeg');
    readfile($rutaImatge);
} else {
    echo "Imatge no trobada";
}
?>
