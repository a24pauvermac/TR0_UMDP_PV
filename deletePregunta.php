<?php
include 'conexio.php';

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

$idPregunta = $input['idPregunta'] ?? '';

if ($idPregunta) {
    // Primero obtenemos el idRespuestaCorrecta para eliminar también el país
    $sql = "SELECT idRespuestaCorrecta FROM questions WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $idPregunta);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        $idPais = $row['idRespuestaCorrecta'];
        
        // Eliminamos la pregunta
        $sqlDelete = "DELETE FROM questions WHERE id = ?";
        $stmtDelete = $conn->prepare($sqlDelete);
        $stmtDelete->bind_param('i', $idPregunta);
        $stmtDelete->execute();
        $stmtDelete->close();
        
        // Eliminamos el país asociado
        $sqlDeletePais = "DELETE FROM paises WHERE id = ?";
        $stmtDeletePais = $conn->prepare($sqlDeletePais);
        $stmtDeletePais->bind_param('i', $idPais);
        $stmtDeletePais->execute();
        $stmtDeletePais->close();
        
        echo json_encode(['success' => true, 'message' => 'Pregunta eliminada correctamente']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Pregunta no encontrada']);
    }
    
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'ID de pregunta requerido']);
}

$conn->close();
?>
