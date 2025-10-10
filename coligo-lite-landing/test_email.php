<?php
// Simple test script to check if SendGrid is working
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

echo json_encode([
    'status' => 'PHP script is working',
    'sendgrid_key_set' => !empty($_ENV['SENDGRID_API_KEY']) || !empty($GLOBALS['sendgrid_api_key']),
    'timestamp' => date('Y-m-d H:i:s')
]);
?>
