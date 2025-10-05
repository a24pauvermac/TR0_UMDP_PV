<?php
// Aquest és un fitxer d'exemple per a la configuració de la base de dades
// Copia aquest fitxer com a 'conexio.php' i configura les teves credencials

$hostname = gethostname();
if (strlen($hostname) === 12 && ctype_alnum($hostname)) {
    // Configuració per a Docker
    $host = 'mysql';
    $db   = 'quiz_banderas';
    $user = 'quiz_user';
    $pass = 'quiz_password';
} else {
    // Configuració per a entorn local
    $host = 'localhost';
    $db   = 'nom_de_la_teva_base_de_dades';
    $user = 'el_teu_usuari';
    $pass = 'la_teva_contrassenya';
}

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die(json_encode(['error' => 'Error de connexió: ' . $conn->connect_error]));
}
