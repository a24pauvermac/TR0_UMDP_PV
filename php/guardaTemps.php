<?php
session_start();
header('Content-Type: application/json');

$temps = isset($_POST['temps']) ? intval($_POST['temps']) : 0;
$_SESSION['temps_restant'] = $temps;

echo json_encode(['success' => true]);
?>
