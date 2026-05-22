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

$stmt = $pdo->prepare("SELECT id, full_name, email FROM users WHERE token = ?");
$stmt->execute([$token]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'Token tidak valid']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$full_name = isset($data['full_name']) ? trim($data['full_name']) : null;

if (!$full_name) {
    http_response_code(400);
    echo json_encode(['error' => 'Nama harus diisi']);
    exit;
}

$update = $pdo->prepare("UPDATE users SET full_name = ? WHERE id = ?");
if ($update->execute([$full_name, $user['id']])) {
    echo json_encode([
        'success' => true,
        'message' => 'Profil berhasil diupdate',
        'user' => [
            'id' => $user['id'],
            'full_name' => $full_name,
            'email' => $user['email']
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Gagal update profil']);
}