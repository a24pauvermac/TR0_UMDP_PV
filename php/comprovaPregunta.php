<?php
session_start();
header('Content-Type: application/json');

$pregunta_actual = isset($_POST['pregunta_actual']) ? intval($_POST['pregunta_actual']) : 0;
$resposta_usuari = isset($_POST['resposta']) ? intval($_POST['resposta']) : null;

$preguntes = isset($_SESSION['preguntes']) ? $_SESSION['preguntes'] : [];
$puntuacio = isset($_SESSION['puntuacio']) ? $_SESSION['puntuacio'] : 0;

if (isset($preguntes[$pregunta_actual])) {
    $pregunta = $preguntes[$pregunta_actual];
    
    // La resposta correcta sempre està en la posició 3 (última posició) (no estic orgullosa d'això...)
    $posicio_correcta = 3;
    $correcte = ($resposta_usuari == $posicio_correcta);
    
    if ($correcte) {
        $_SESSION['puntuacio'] = ++$puntuacio;
    }
    
    $_SESSION['pregunta_actual'] = $pregunta_actual + 1;
    
    // Obtenir nom de la resposta correcta
    $resposta_correcta_nom = $pregunta['respostes'][$posicio_correcta]['nombre'];
    
    $es_final = $_SESSION['pregunta_actual'] >= count($preguntes);

    // Creem un array amb totes les dades que volem enviar al JavaScript
    echo json_encode([
        'correcte' => $correcte,  // Si la resposta és correcta o no (true/false)
        'resultat' => $correcte 
            ? 'Correcte, has guanyat 1 punt!'  // Missatge si ha encertat
            : 'Incorrecte, la resposta correcta era: ' . $resposta_correcta_nom,  // Missatge si ha fallat
        'puntuacio' => $_SESSION['puntuacio'],  // Puntuació actual de l'usuari
        'pregunta_actual' => $_SESSION['pregunta_actual'],  // Quina pregunta està fent ara
        'total_preguntes' => count($preguntes),  // Quantes preguntes hi ha en total
        'es_final' => $es_final,  // Si ja ha acabat el joc o no (true/false)
        'temps_restant' => isset($_SESSION['temps_restant']) ? $_SESSION['temps_restant'] : 0  // Temps que li queda
    ]);
} else {
    // Si no trobem la pregunta, enviem un error
    echo json_encode(['error' => 'Pregunta no trobada']);
}