<?php
include('config.php');

$response = array();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['username']);
    $password = $_POST['password'];
    $email = trim($_POST['email']);

    // Input validation
    if (empty($username) || empty($password) || empty($email)) {
        $response['status'] = 'error';
        $response['message'] = 'All fields are required.';
        echo json_encode($response);
        exit();
    }

    // Check if username already exists
    $stmt = $conn->prepare("SELECT COUNT(*) FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->bind_result($userExists);
    $stmt->fetch();
    $stmt->close();

    if ($userExists > 0) {
        $response['status'] = 'error';
        $response['message'] = 'Username already taken.';
        echo json_encode($response);
        exit();
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['status'] = 'error';
        $response['message'] = 'Invalid email format.';
        echo json_encode($response);
        exit();
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT); // Hash password

    try {
        
        $stmt = $conn->prepare("INSERT INTO users (username, password, email) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $username, $passwordHash, $email);
        if ($stmt->execute()) {
            $response['status'] = 'success';
            $response['message'] = 'User registered successfully.';
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Failed to register user.';
        }
        $stmt->close();
    } catch (Exception $e) {
        $response['status'] = 'error';
        $response['message'] = 'Error: ' . $e->getMessage();
    }
}

echo json_encode($response);
?>
