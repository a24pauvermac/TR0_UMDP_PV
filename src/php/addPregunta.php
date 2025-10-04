<?php
include __DIR__ . "/conexio.php";

$nom = $_POST['nombre'] ?? '';

if ($nom && isset($_FILES['imagen'])) {
    
    $arxiu = $_FILES['imagen'];
    
    $tipusPermesos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($arxiu['type'], $tipusPermesos)) {
        echo json_encode(['error' => 'L\'arxiu ha de ser una imatge (JPG, PNG, GIF o WEBP)']);
        exit;
    }
    
    if ($arxiu['size'] > 5000000) {
        echo json_encode(['error' => 'L\'arxiu és massa gran (màxim 5MB)']);
        exit;
    }
    
    $uploadDir = __DIR__ . '/../../assets/uploads/banderas/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    
    $extensio = pathinfo($arxiu['name'], PATHINFO_EXTENSION);
    $nomUnic = uniqid() . '_' . time() . '.' . $extensio;
    $rutaDesti = $uploadDir . $nomUnic;
    
    if (move_uploaded_file($arxiu['tmp_name'], $rutaDesti)) {
        
        $nomFitxer = basename($rutaDesti);
        $sql = "INSERT INTO paises (nombre, `url`) VALUES (?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ss', $nom, $nomFitxer);
        $stmt->execute();
        $stmt->close();

        $idPais = $conn->insert_id;

        $sqlQ = "INSERT INTO questions (idRespuestaCorrecta) VALUES (?)";
        $stmtQ = $conn->prepare($sqlQ);
        $stmtQ->bind_param('i', $idPais);
        $stmtQ->execute();
        $stmtQ->close();
        
        echo json_encode([
            'exit' => true, 
            'missatge' => 'Pregunta creada correctament'
        ]);
        
    } else {
        echo json_encode(['error' => 'Error al guardar l\'arxiu']);
    }
    
} else {
    echo json_encode(['error' => 'Falten dades (nom o imatge)']);
}

$conn->close();
?>