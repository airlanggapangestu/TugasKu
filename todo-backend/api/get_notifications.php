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
$today = date('Y-m-d');
$tomorrow = date('Y-m-d', strtotime('+1 day'));

// Task overdue (due_date < hari ini, status active)
$overdue = $pdo->prepare("
    SELECT id, title, priority, due_date 
    FROM todos 
    WHERE user_id = ? AND status = 'active' AND due_date IS NOT NULL AND due_date < ?
    ORDER BY due_date ASC
");
$overdue->execute([$user_id, $today]);
$overdueTasks = $overdue->fetchAll();

// Task due today
$dueToday = $pdo->prepare("
    SELECT id, title, priority, due_date 
    FROM todos 
    WHERE user_id = ? AND status = 'active' AND due_date = ?
");
$dueToday->execute([$user_id, $today]);
$todayTasks = $dueToday->fetchAll();

// Task due tomorrow
$dueTomorrow = $pdo->prepare("
    SELECT id, title, priority, due_date 
    FROM todos 
    WHERE user_id = ? AND status = 'active' AND due_date = ?
");
$dueTomorrow->execute([$user_id, $tomorrow]);
$tomorrowTasks = $dueTomorrow->fetchAll();

// Total notifikasi
$total = count($overdueTasks) + count($todayTasks) + count($tomorrowTasks);

echo json_encode([
    'success' => true,
    'total' => $total,
    'overdue' => $overdueTasks,
    'today' => $todayTasks,
    'tomorrow' => $tomorrowTasks
]);