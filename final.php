<?php
session_start();
header('Content-Type: application/json');

$puntuacio = isset($_SESSION['puntuacio']) ? $_SESSION['puntuacio'] : 0;
$total_preguntes = isset($_SESSION['preguntes']) ? count($_SESSION['preguntes']) : 0;

session_destroy();

echo json_encode([
    'puntuacio' => $puntuacio,
    'total_preguntes' => $total_preguntes
]);
?>