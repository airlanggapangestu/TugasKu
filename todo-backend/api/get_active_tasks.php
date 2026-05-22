<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require_once __DIR__ . '/../config.php';

// Ambil token
$token = isset($_GET['token']) ? $_GET['token'] : null;

if (!$token) {
    http_response_code(401);
    echo json_encode(['error' => 'Token tidak ditemukan']);
    exit;
}

// Cek user
$stmt = $pdo->prepare("SELECT id FROM users WHERE token = ?");
$stmt->execute([$token]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'Token tidak valid']);
    exit;
}

$user_id = $user['id'];

// Ambil task aktif + join kategori
$stmt = $pdo->prepare("
    SELECT t.*, c.name AS category_name, c.color AS category_color, c.icon AS category_icon
    FROM todos t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = ? AND t.status = 'active'
    ORDER BY 
        CASE t.priority
            WHEN 'High' THEN 1
            WHEN 'Med' THEN 2
            WHEN 'Low' THEN 3
        END,
        t.due_date ASC,
        t.created_at DESC
");
$stmt->execute([$user_id]);
$tasks = $stmt->fetchAll();

// Hitung total & completed
$stmtTotal = $pdo->prepare("SELECT COUNT(*) as total FROM todos WHERE user_id = ? AND status = 'active'");
$stmtTotal->execute([$user_id]);
$total = $stmtTotal->fetch()['total'];

$stmtDone = $pdo->prepare("SELECT COUNT(*) as done FROM todos WHERE user_id = ? AND status = 'done'");
$stmtDone->execute([$user_id]);
$done = $stmtDone->fetch()['done'];

$totalAll = $total + $done;
$percent = $totalAll > 0 ? round(($done / $totalAll) * 100) : 0;

echo json_encode([
    'success' => true,
    'total_active' => (int)$total,
    'total_done' => (int)$done,
    'total_all' => (int)$totalAll,
    'percent' => $percent,
    'tasks' => $tasks
]);