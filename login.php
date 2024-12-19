<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include('config.php');

$response = array();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    try {
        $stmt = $conn->prepare("SELECT id, password FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->bind_result($userId, $hashedPassword);

        if ($stmt->fetch() && password_verify($password, $hashedPassword)) {
            session_start();
            $_SESSION['user_id'] = $userId; // Store user_id in session
            $response = [
                'status' => 'success',
                'message' => 'Login successful.',
                'user_id' => $userId, // Return user_id to frontend
            ];
        } else {
            $response = [
                'status' => 'error',
                'message' => 'Invalid username or password.',
            ];
        }
        $stmt->close();
    } catch (Exception $e) {
        $response = [
            'status' => 'error',
            'message' => 'Error: ' . $e->getMessage(),
        ];
    }
    echo json_encode($response);
}

?>
