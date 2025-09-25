<?php
include 'conexio.php';

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

$nombre = $input['nombre'] ?? '';
$url = $input['url'] ?? '';

if ($nombre && $url) {
    $sql = "INSERT INTO paises (nombre, `url`) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ss', $nombre, $url);
    $stmt->execute();
    $stmt->close();

    $idPais = $conn->insert_id;

    $sqlQ = "INSERT INTO questions (idRespuestaCorrecta) VALUES (?)";
    $stmtQ = $conn->prepare($sqlQ);
    $stmtQ->bind_param('i', $idPais);
    $stmtQ->execute();
    $stmtQ->close();
}

$conn->close();
?>
