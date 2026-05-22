<?php
header('Access-Control-Allow-Origin: *');   // sementara untuk development
header('Content-Type: application/json');

require_once __DIR__ . '/../config.php';

$stmt = $pdo->query("SELECT * FROM todos");
$todos = $stmt->fetchAll();

echo json_encode($todos);
?>