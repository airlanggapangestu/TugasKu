<?php
header('Content-Type: application/json');

echo json_encode([
    'HTTP_AUTHORIZATION' => $_SERVER['HTTP_AUTHORIZATION'] ?? 'NOT SET',
    'REDIRECT_HTTP_AUTHORIZATION' => $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? 'NOT SET',
    'apache_request_headers' => function_exists('apache_request_headers') ? 'YES' : 'NO',
    'getallheaders' => function_exists('getallheaders') ? 'YES' : 'NO',
    'ALL_SERVER' => $_SERVER
]);