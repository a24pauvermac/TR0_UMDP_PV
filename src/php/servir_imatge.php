<?php
// servir_imatge.php - Serveix les imatges de banderes

// Obtenir el nom del fitxer des dels paràmetres
$nomFitxer = $_GET['fitxer'];

// Construir la ruta de la imatge
$rutaImatge = __DIR__ . '/../../assets/uploads/banderas/' . $nomFitxer;

// Si el fitxer existeix, mostrar-lo
if (file_exists($rutaImatge)) {
    // Llegir i mostrar la imatge
    readfile($rutaImatge);
} else {
    // Si no existeix, mostrar un missatge d'error
    echo "Imatge no trobada :(";
}
?>
