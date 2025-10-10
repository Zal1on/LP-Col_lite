<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 86400');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Test endpoint - respond to GET requests
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode([
        'status' => 'OK',
        'message' => 'SendGrid email script is working',
        'timestamp' => date('Y-m-d H:i:s'),
        'method' => $_SERVER['REQUEST_METHOD']
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get form data
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$company = isset($_POST['company']) ? trim($_POST['company']) : '';
$usecase = isset($_POST['usecase']) ? trim($_POST['usecase']) : '';
$datetime = isset($_POST['datetime']) ? trim($_POST['datetime']) : '';

// Validation
if (empty($name) || empty($email) || empty($company) || empty($datetime)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit;
}

// SendGrid configuration
$sendgrid_api_key = getenv('SENDGRID_API_KEY') ?: 'YOUR_SENDGRID_API_KEY_HERE'; // Replace with your actual SendGrid API key
$from_email = 'M.alsharif@be-services.com'; // Replace with your verified sender email
$to_email = 'r.maidel@be-services.com'; // Replace with your email

// Prepare email data
$email_data = [
    'personalizations' => [
        [
            'to' => [
                ['email' => $to_email]
            ],
            'subject' => 'New COLIGO Demo Request from ' . $name
        ]
    ],
    'from' => [
        'email' => $from_email,
        'name' => 'COLIGO Demo Requests'
    ],
    'content' => [
        [
            'type' => 'text/html',
            'value' => "
                <h2>New Demo Request Received</h2>
                <p><strong>Name:</strong> {$name}</p>
                <p><strong>Email:</strong> {$email}</p>
                <p><strong>Company:</strong> {$company}</p>
                <p><strong>Use Case:</strong> " . ($usecase ?: 'Not specified') . "</p>
                <p><strong>Preferred Demo Time:</strong> {$datetime}</p>
                <p><strong>Submitted:</strong> " . date('Y-m-d H:i:s') . "</p>
                <hr>
                <p><em>This is an automated message from your COLIGO demo request form.</em></p>
            "
        ]
    ]
];

// Send email via SendGrid API
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.sendgrid.com/v3/mail/send');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($email_data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $sendgrid_api_key,
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);
curl_close($ch);

// Debug information
error_log('SendGrid Response: ' . $response);
error_log('HTTP Code: ' . $http_code);
error_log('cURL Error: ' . $curl_error);

if ($curl_error) {
    http_response_code(500);
    echo json_encode(['error' => 'cURL Error: ' . $curl_error]);
} elseif ($http_code >= 200 && $http_code < 300) {
    echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
} else {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to send email',
        'http_code' => $http_code,
        'response' => $response
    ]);
}
?>
