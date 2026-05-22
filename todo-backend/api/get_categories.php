<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require_once __DIR__ . '/../config.php';

// ========== AMBIL TOKEN DARI QUERY STRING ==========
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

$stmt = $pdo->prepare("SELECT id, name, color, icon FROM categories WHERE user_id = ? ORDER BY name ASC");
$stmt->execute([$user['id']]);
$categories = $stmt->fetchAll();

echo json_encode([
    'success' => true,
    'categories' => $categories
]);