<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: DELETE, POST, OPTIONS');
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
$category_id = isset($data['category_id']) ? intval($data['category_id']) : 0;

// Cek kepemilikan
$stmt = $pdo->prepare("SELECT id FROM categories WHERE id = ? AND user_id = ?");
$stmt->execute([$category_id, $user_id]);

if (!$stmt->fetch()) {
    http_response_code(404);
    echo json_encode(['error' => 'Kategori tidak ditemukan']);
    exit;
}

// Set tasks jadi uncategorized
$pdo->prepare("UPDATE todos SET category_id = NULL WHERE category_id = ? AND user_id = ?")->execute([$category_id, $user_id]);

// Hapus kategori
$delete = $pdo->prepare("DELETE FROM categories WHERE id = ? AND user_id = ?");
if ($delete->execute([$category_id, $user_id])) {
    echo json_encode(['success' => true, 'message' => 'Kategori dihapus']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Gagal menghapus kategori']);
}