<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: PUT, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

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
$data = json_decode(file_get_contents('php://input'), true);
$task_id = isset($data['task_id']) ? intval($data['task_id']) : 0;

if (!$task_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Task ID tidak valid']);
    exit;
}

$stmt = $pdo->prepare("SELECT id FROM todos WHERE id = ? AND user_id = ?");
$stmt->execute([$task_id, $user_id]);

if (!$stmt->fetch()) {
    http_response_code(404);
    echo json_encode(['error' => 'Task tidak ditemukan']);
    exit;
}

$update = $pdo->prepare("UPDATE todos SET status = 'done', completed_at = NOW() WHERE id = ? AND user_id = ?");
if ($update->execute([$task_id, $user_id])) {
    echo json_encode(['success' => true, 'message' => 'Task selesai']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Gagal update task']);
}