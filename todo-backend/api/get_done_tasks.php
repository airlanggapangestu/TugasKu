<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require_once __DIR__ . '/../config.php';

$token = isset($_GET['token']) ? $_GET['token'] : null;

if (!$token) {
    http_response_code(401);
    echo json_encode(['error' => 'Token tidak ditemukan']);
    exit;
}

$stmt = $pdo->prepare("SELECT id FROM users WHERE token = ?");
$stmt->execute([$token]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'Token tidak valid']);
    exit;
}

$user_id = $user['id'];

// Ambil task done
$stmt = $pdo->prepare("
    SELECT t.*, c.name AS category_name, c.color AS category_color
    FROM todos t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = ? AND t.status = 'done'
    ORDER BY t.completed_at DESC
");
$stmt->execute([$user_id]);
$tasks = $stmt->fetchAll();

echo json_encode([
    'success' => true,
    'tasks' => $tasks
]);