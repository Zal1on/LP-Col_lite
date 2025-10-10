<?php
// Fallback version that works without JavaScript
header('Content-Type: text/html; charset=UTF-8');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// SendGrid configuration
$sendgrid_api_key = getenv('SENDGRID_API_KEY') ?: 'YOUR_SENDGRID_API_KEY_HERE';
$from_email = 'M.alsharif@be-services.com';
$to_email = 'r.maidel@be-services.com';

// Check if form was submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $company = isset($_POST['company']) ? trim($_POST['company']) : '';
    $usecase = isset($_POST['usecase']) ? trim($_POST['usecase']) : '';
    $datetime = isset($_POST['datetime']) ? trim($_POST['datetime']) : '';

    // Validation
    $errors = [];
    if (empty($name)) $errors[] = 'Name is required';
    if (empty($email)) $errors[] = 'Email is required';
    if (empty($company)) $errors[] = 'Company is required';
    if (empty($datetime)) $errors[] = 'Demo time is required';
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email address';
    }

    if (empty($errors)) {
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

        if ($curl_error) {
            $success = false;
            $message = 'cURL Error: ' . $curl_error;
        } elseif ($http_code >= 200 && $http_code < 300) {
            $success = true;
            $message = 'Email sent successfully!';
        } else {
            $success = false;
            $message = 'Failed to send email. HTTP Code: ' . $http_code;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo Request - COLIGO lite</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        .success { background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .error { background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .back-link { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #001836; color: white; text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <?php if (isset($success)): ?>
        <?php if ($success): ?>
            <div class="success">
                <h2>✅ Success!</h2>
                <p>Thank you, <?php echo htmlspecialchars($name); ?>!</p>
                <p>Your demo request has been submitted for <?php echo htmlspecialchars($datetime); ?>.</p>
                <p>We'll send you a confirmation email shortly.</p>
            </div>
        <?php else: ?>
            <div class="error">
                <h2>❌ Error</h2>
                <p><?php echo htmlspecialchars($message); ?></p>
                <p>Please try again or contact us directly at <?php echo $to_email; ?></p>
            </div>
        <?php endif; ?>
    <?php elseif (isset($errors)): ?>
        <div class="error">
            <h2>❌ Validation Errors</h2>
            <ul>
                <?php foreach ($errors as $error): ?>
                    <li><?php echo htmlspecialchars($error); ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endif; ?>
    
    <a href="index.html" class="back-link">← Back to COLIGO lite</a>
</body>
</html>
