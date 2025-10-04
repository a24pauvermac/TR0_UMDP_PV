<?php
session_start();
header('Content-Type: application/json');

$pregunta_actual = isset($_POST['pregunta_actual']) ? intval($_POST['pregunta_actual']) : 0;
$resposta_usuari = isset($_POST['resposta']) ? intval($_POST['resposta']) : null;

$preguntes = isset($_SESSION['preguntes']) ? $_SESSION['preguntes'] : [];
$puntuacio = isset($_SESSION['puntuacio']) ? $_SESSION['puntuacio'] : 0;

if (isset($preguntes[$pregunta_actual])) {
    $pregunta = $preguntes[$pregunta_actual];

    $idCorrecte = $pregunta['idCorrecte'];

    $resposta_seleccionada = $pregunta['respostes'][$resposta_usuari];
    $id_seleccionat = $resposta_seleccionada['id'];
    $correcte = ($id_seleccionat == $idCorrecte);
    if ($correcte) {
        $_SESSION['puntuacio'] = ++$puntuacio;
    }
    $_SESSION['pregunta_actual'] = $pregunta_actual + 1;

    $resposta_correcta_nom = null;
    foreach ($pregunta['respostes'] as $r) {
        if ($r['id'] == $idCorrecte) {
            $resposta_correcta_nom = $r['nombre'];
            break;
        }
    }

    echo json_encode([
        'resultat' => $correcte 
            ? 'Correcte, has guanyat 1 punt.' 
            : 'Incorrecte, la resposta correcta era: ' . $resposta_correcta_nom,
        'puntuacio' => $_SESSION['puntuacio'],
        'pregunta_actual' => $_SESSION['pregunta_actual'],
        'total_preguntes' => count($preguntes),
        'final' => $_SESSION['pregunta_actual'] >= count($preguntes)
    ]);
} else {
    echo json_encode(['error' => 'Pregunta no trobada']);
}