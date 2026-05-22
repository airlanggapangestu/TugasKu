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

$stmt = $pdo->prepare("SELECT id, full_name FROM users WHERE token = ?");
$stmt->execute([$token]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'Token tidak valid']);
    exit;
}

$user_id = $user['id'];

// Total tasks
$active = $pdo->query("SELECT COUNT(*) as total FROM todos WHERE user_id = $user_id AND status = 'active'")->fetch()['total'];
$done = $pdo->query("SELECT COUNT(*) as total FROM todos WHERE user_id = $user_id AND status = 'done'")->fetch()['total'];
$total = $active + $done;
$efficiency = $total > 0 ? round(($done / $total) * 100) : 0;

// Top priorities (3 active tasks terbaru)
$priorities = $pdo->prepare("
    SELECT t.*, c.name AS category_name, c.color AS category_color
    FROM todos t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = ? AND t.status = 'active'
    ORDER BY 
        CASE t.priority WHEN 'High' THEN 1 WHEN 'Med' THEN 2 WHEN 'Low' THEN 3 END,
        t.created_at DESC
    LIMIT 3
");
$priorities->execute([$user_id]);
$topPriorities = $priorities->fetchAll();

// Chart 7 hari terakhir
$chartData = [];
for ($i = 6; $i >= 0; $i--) {
    $date = date('Y-m-d', strtotime("-$i days"));
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM todos WHERE user_id = ? AND DATE(completed_at) = ? AND status = 'done'");
    $stmt->execute([$user_id, $date]);
    $count = $stmt->fetch()['count'];
    $chartData[] = [
        'date' => $date,
        'day' => date('D', strtotime($date)),
        'count' => (int)$count
    ];
}

// Recent categories
$categories = $pdo->prepare("
    SELECT c.*, 
           COUNT(t.id) as task_count,
           SUM(CASE WHEN t.status = 'active' THEN 1 ELSE 0 END) as active_count
    FROM categories c
    LEFT JOIN todos t ON c.id = t.category_id AND t.user_id = ?
    WHERE c.user_id = ?
    GROUP BY c.id
    ORDER BY c.created_at DESC
    LIMIT 3
");
$categories->execute([$user_id, $user_id]);
$recentCategories = $categories->fetchAll();

// ... setelah query categories
$categories = $pdo->prepare("
    SELECT c.*, 
           COUNT(t.id) as task_count,
           SUM(CASE WHEN t.status = 'active' THEN 1 ELSE 0 END) as active_count
    FROM categories c
    LEFT JOIN todos t ON c.id = t.category_id AND t.user_id = ?
    WHERE c.user_id = ?
    GROUP BY c.id
    ORDER BY c.created_at DESC
    LIMIT 3
");
$categories->execute([$user_id, $user_id]);
$recentCategories = $categories->fetchAll();
// ...

echo json_encode([
    'success' => true,
    'user_name' => $user['full_name'],
    'stats' => [
        'active' => (int)$active,
        'done' => (int)$done,
        'total' => (int)$total,
        'efficiency' => $efficiency,
        'open_issues' => (int)$active
    ],
    'top_priorities' => $topPriorities,
    'chart_data' => $chartData,
    'recent_categories' => $recentCategories
]);