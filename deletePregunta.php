<?php
include __DIR__ . "/conexio.php";

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

$idPregunta = $input['idPregunta'] ?? '';

if ($idPregunta) {
    $sql = "SELECT idRespuestaCorrecta FROM questions WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $idPregunta);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        $idPais = $row['idRespuestaCorrecta'];
        
        $sqlDelete = "DELETE FROM questions WHERE id = ?";
        $stmtDelete = $conn->prepare($sqlDelete);
        $stmtDelete->bind_param('i', $idPregunta);
        $stmtDelete->execute();
        $stmtDelete->close();
        
        $sqlDeletePais = "DELETE FROM paises WHERE id = ?";
        $stmtDeletePais = $conn->prepare($sqlDeletePais);
        $stmtDeletePais->bind_param('i', $idPais);
        $stmtDeletePais->execute();
        $stmtDeletePais->close();
        
        echo json_encode(['exit' => true, 'missatge' => 'Pregunta eliminada correctament']);
    } else {
        echo json_encode(['exit' => false, 'missatge' => 'Pregunta no trobada']);
    }
    
    $stmt->close();
} else {
    echo json_encode(['exit' => false, 'missatge' => 'ID de pregunta requerit']);
}

$conn->close();
?>