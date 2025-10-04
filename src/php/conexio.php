<?php
$hostname = gethostname();
if (strlen($hostname) === 12 && ctype_alnum($hostname)) {
    $host = 'mysql';
    $db   = 'quiz_banderas';
    $user = 'quiz_user';
    $pass = 'quiz_password';
} else {
    $host = 'localhost';
    $db   = 'a24pauvermac_kahoot';
    $user = 'a24pauvermac_kahoot';
    $pass = '{_&hbz:sNo)tURQ5';
}

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die(json_encode(['error' => 'Error de connexió: ' . $conn->connect_error]));
}