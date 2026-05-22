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

$stmt = $pdo->prepare("
    SELECT c.*, 
           COUNT(t.id) as task_count,
           SUM(CASE WHEN t.status = 'active' THEN 1 ELSE 0 END) as active_count
    FROM categories c
    LEFT JOIN todos t ON c.id = t.category_id
    WHERE c.user_id = ?
    GROUP BY c.id
    ORDER BY c.created_at DESC
");
$stmt->execute([$user_id]);
$categories = $stmt->fetchAll();

echo json_encode([
    'success' => true,
    'categories' => $categories
]);