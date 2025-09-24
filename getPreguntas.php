<?php
require "conexio.php";
session_start();
header('Content-Type: application/json');

$num = isset($_GET['num']) ? intval($_GET['num']) : 10;

$sql = "
    SELECT q.id AS idPregunta, p1.id AS idCorrecte, p1.nombre AS correctName, p1.url AS image
    FROM questions q
    JOIN paises p1 ON q.idRespuestaCorrecta = p1.id
    ORDER BY RAND()
    LIMIT $num
";


$result = $conn->query($sql);
if (!$result) {
    die(json_encode(['error' => 'Error a la consulta: ' . $conn->error]));
}

$preguntes_seleccionades = [];
while ($row = $result->fetch_assoc()) {
    $preguntes_seleccionades[] = $row;
}

$pregSenseIndex = [];
foreach ($preguntes_seleccionades as $pregunta) {
    $idCorrecte = $pregunta['idCorrecte'];

    $resRandomSQL = "
        SELECT id, nombre, url
        FROM paises
        WHERE id != $idCorrecte
        ORDER BY RAND()
        LIMIT 3
    ";
    $resResult = $conn->query($resRandomSQL);
    $respostes = [];

    while ($row = $resResult->fetch_assoc()) {
        $respostes[] = $row;
    }

    $respostes[] = [
        'id' => $pregunta['idCorrecte'],
        'nombre' => $pregunta['correctName'],
        'url' => $pregunta['image']
    ];

    $pregSenseIndex[] = [
        'idPregunta' => $pregunta['idPregunta'],
        'idCorrecte' => $pregunta['idCorrecte'],
        'respostes' => $respostes
    ];
}

$_SESSION['preguntes'] = $pregSenseIndex;
$_SESSION['puntuacio'] = 0;
$_SESSION['pregunta_actual'] = 0;

echo json_encode(['preguntes' => $pregSenseIndex]);

$conn->close();
