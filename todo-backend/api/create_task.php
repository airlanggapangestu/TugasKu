<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/../config.php';

// ========== AMBIL TOKEN DARI QUERY STRING ==========
$token = isset($_GET['token']) ? $_GET['token'] : null;

if (!$token) {
    http_response_code(401);
    echo json_encode(['error' => 'Token tidak ditemukan']);
    exit;
}

// ========== CEK USER ==========
$stmt = $pdo->prepare("SELECT id FROM users WHERE token = ?");
$stmt->execute([$token]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'Token tidak valid']);
    exit;
}

$user_id = $user['id'];

// ========== DATA ==========
$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['title']) || trim($data['title']) === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Judul task harus diisi']);
    exit;
}

$title = trim($data['title']);
$description = isset($data['description']) ? trim($data['description']) : '';
$priority = isset($data['priority']) ? $data['priority'] : 'Med';
$category_id = isset($data['category_id']) ? intval($data['category_id']) : null;
$due_date = isset($data['due_date']) && $data['due_date'] !== '' ? $data['due_date'] : null;

// Validasi priority
if (!in_array($priority, ['Low', 'Med', 'High'])) {
    $priority = 'Med';
}

// Validasi category_id
if ($category_id) {
    $catStmt = $pdo->prepare("SELECT id FROM categories WHERE id = ? AND user_id = ?");
    $catStmt->execute([$category_id, $user_id]);
    if (!$catStmt->fetch()) {
        $category_id = null;
    }
}

// ========== INSERT ==========
$insert = $pdo->prepare("
    INSERT INTO todos (user_id, category_id, title, description, priority, status, due_date, created_at)
    VALUES (?, ?, ?, ?, ?, 'active', ?, NOW())
");

if ($insert->execute([$user_id, $category_id, $title, $description, $priority, $due_date])) {
    echo json_encode([
        'success' => true,
        'message' => 'Task berhasil dibuat',
        'task_id' => $pdo->lastInsertId()
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Gagal membuat task']);
}