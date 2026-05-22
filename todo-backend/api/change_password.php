<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: PUT, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

require_once __DIR__ . '/../config.php';

$token = isset($_GET['token']) ? $_GET['token'] : null;

if (!$token) {
    http_response_code(401);
    echo json_encode(['error' => 'Token tidak ditemukan']);
    exit;
}

$stmt = $pdo->prepare("SELECT id, password FROM users WHERE token = ?");
$stmt->execute([$token]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'Token tidak valid']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$current_password = isset($data['current_password']) ? $data['current_password'] : '';
$new_password = isset($data['new_password']) ? $data['new_password'] : '';

if (!$current_password || !$new_password) {
    http_response_code(400);
    echo json_encode(['error' => 'Semua field harus diisi']);
    exit;
}

if (!password_verify($current_password, $user['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Password saat ini salah']);
    exit;
}

if (strlen($new_password) < 8) {
    http_response_code(400);
    echo json_encode(['error' => 'Password minimal 8 karakter']);
    exit;
}

$hashed = password_hash($new_password, PASSWORD_BCRYPT);
$update = $pdo->prepare("UPDATE users SET password = ?, token = NULL WHERE id = ?");
if ($update->execute([$hashed, $user['id']])) {
    echo json_encode(['success' => true, 'message' => 'Password berhasil diubah, silakan login ulang']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Gagal mengubah password']);
}