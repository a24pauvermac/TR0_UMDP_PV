<?php
include 'conexio.php';

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

$idPregunta = $input['idPregunta'] ?? '';
$nombre = $input['nombre'] ?? '';
$url = $input['url'] ?? '';

if ($idPregunta && $nombre && $url) {
    // Primero obtenemos el idRespuestaCorrecta para actualizar el país
    $sql = "SELECT idRespuestaCorrecta FROM questions WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $idPregunta);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        $idPais = $row['idRespuestaCorrecta'];
        
        // Actualizamos el país
        $sqlUpdate = "UPDATE paises SET nombre = ?, url = ? WHERE id = ?";
        $stmtUpdate = $conn->prepare($sqlUpdate);
        $stmtUpdate->bind_param('ssi', $nombre, $url, $idPais);
        $stmtUpdate->execute();
        $stmtUpdate->close();
        
        echo json_encode(['success' => true, 'message' => 'Pregunta actualizada correctamente']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Pregunta no encontrada']);
    }
    
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Todos los campos son requeridos']);
}

$conn->close();
?>
