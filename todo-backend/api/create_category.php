<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

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

$name = isset($data['name']) ? trim($data['name']) : '';
$color = isset($data['color']) ? $data['color'] : '#5865f2';
$icon = isset($data['icon']) ? $data['icon'] : 'folder';

if ($name === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Nama kategori harus diisi']);
    exit;
}

$insert = $pdo->prepare("INSERT INTO categories (user_id, name, color, icon) VALUES (?, ?, ?, ?)");
if ($insert->execute([$user_id, $name, $color, $icon])) {
    echo json_encode([
        'success' => true,
        'message' => 'Kategori berhasil dibuat',
        'category_id' => $pdo->lastInsertId()
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Gagal membuat kategori']);
}