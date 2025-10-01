<?php
include 'conexio.php';

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

$idPregunta = $input['idPregunta'] ?? '';
$nom = $input['nom'] ?? '';
$url = $input['url'] ?? '';

if ($idPregunta && $nom && $url) {
    // Primer obtenim el idRespuestaCorrecta per actualitzar el país
    $sql = "SELECT idRespuestaCorrecta FROM questions WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $idPregunta);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        $idPais = $row['idRespuestaCorrecta'];
        
        // Actualitzem el país
        $sqlUpdate = "UPDATE paises SET nombre = ?, url = ? WHERE id = ?";
        $stmtUpdate = $conn->prepare($sqlUpdate);
        $stmtUpdate->bind_param('ssi', $nom, $url, $idPais);
        $stmtUpdate->execute();
        $stmtUpdate->close();
        
        echo json_encode(['exit' => true, 'missatge' => 'Pregunta actualitzada correctament']);
    } else {
        echo json_encode(['exit' => false, 'missatge' => 'Pregunta no trobada']);
    }
    
    $stmt->close();
} else {
    echo json_encode(['exit' => false, 'missatge' => 'Tots els camps són requerits']);
}

$conn->close();
?>