<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/../config.php';

$data = json_decode(file_get_contents('php://input'), true);

// Validasi input
if (!$data || !isset($data['full_name'], $data['email'], $data['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Semua field harus diisi']);
    exit;
}

$full_name = trim($data['full_name']);
$email = trim($data['email']);
$password = $data['password'];

// Validasi email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Format email tidak valid']);
    exit;
}

// Cek password length
if (strlen($password) < 8) {
    http_response_code(400);
    echo json_encode(['error' => 'Password minimal 8 karakter']);
    exit;
}

// Cek apakah email sudah terdaftar
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(['error' => 'Email sudah terdaftar']);
    exit;
}

// Hash password
$hashed = password_hash($password, PASSWORD_BCRYPT);

// Simpan user
$token = bin2hex(random_bytes(32)); // Token otomatis untuk langsung login
$stmt = $pdo->prepare("INSERT INTO users (full_name, email, password, token) VALUES (?, ?, ?, ?)");
if ($stmt->execute([$full_name, $email, $hashed, $token])) {
    echo json_encode([
        'success' => true,
        'message' => 'Registrasi berhasil',
        'token' => $token,
        'user' => [
            'id' => $pdo->lastInsertId(),
            'full_name' => $full_name,
            'email' => $email
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Gagal mendaftar']);
}