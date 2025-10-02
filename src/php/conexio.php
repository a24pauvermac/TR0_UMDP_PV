<?php
// Configuració automàtica per Docker o local
// Si està dins de Docker, usar configuració Docker
// Si està local, usar configuració original

// Detectar si estem dins de Docker (el hostname de Docker és un hash)
$hostname = gethostname();
if (strlen($hostname) === 12 && ctype_alnum($hostname)) {
    // Estem dins de Docker (hostname és un hash de 12 caràcters)
    $host = 'mysql';
    $db   = 'quiz_banderas';
    $user = 'quiz_user';
    $pass = 'quiz_password';
} else {
    // Estem en local
    $host = 'localhost';
    $db   = 'a24pauvermac_kahoot';
    $user = 'a24pauvermac_kahoot';
    $pass = '{_&hbz:sNo)tURQ5';
}

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die(json_encode(['error' => 'Error de connexió: ' . $conn->connect_error]));
}
