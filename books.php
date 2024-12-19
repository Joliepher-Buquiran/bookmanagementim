<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, PUT, DELETE, GET");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Database credentials
$host = 'localhost';
$user = 'root';
$password = ''; // Replace with your database password
$database = 'book_management';

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die(json_encode(['message' => 'Database connection failed: ' . $conn->connect_error]));
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $title = $_POST['title'];
    $author = $_POST['author'];
    $genre = $_POST['genre'];
    $published_year = $_POST['published_year'];
    $sbn = $_POST['sbn'];
    $synopsis = $_POST['synopsis'];

    // Insert the book into the books table
    $stmt = $conn->prepare("INSERT INTO books (title, author, genre, published_year, sbn) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param('sssis', $title, $author, $genre, $published_year, $sbn);

    if ($stmt->execute()) {
        $book_id = $conn->insert_id;
    
        // Insert the synopsis into the storylines table
        $stmt_synopsis = $conn->prepare("INSERT INTO storylines (book_id, synopsis) VALUES (?, ?)");
        $stmt_synopsis->bind_param('is', $book_id, $synopsis);
    
        if ($stmt_synopsis->execute()) {
            // Fetch the newly added book with its synopsis
            $newBookQuery = $conn->prepare("SELECT books.*, storylines.synopsis FROM books LEFT JOIN storylines ON books.id = storylines.book_id WHERE books.id = ?");
            $newBookQuery->bind_param('i', $book_id);
            $newBookQuery->execute();
            $result = $newBookQuery->get_result();
            $newBook = $result->fetch_assoc();
    
            echo json_encode($newBook);  // Return the new book data
        } else {
            echo json_encode(['message' => 'Failed to add synopsis.']);
        }
    
        $stmt_synopsis->close();
    } else {
        echo json_encode(['message' => 'Failed to add book.']);
    }
    
    $stmt->close();
} elseif ($method === 'PUT') {
    parse_str(file_get_contents("php://input"), $_PUT);
    $id = $_PUT['id'];
    $title = $_PUT['title'];
    $author = $_PUT['author'];
    $genre = $_PUT['genre'];
    $published_year = $_PUT['published_year'];
    $sbn = $_PUT['sbn'];
    $synopsis = $_PUT['synopsis'];

    // Update the book in the books table
    $stmt = $conn->prepare("UPDATE books SET title=?, author=?, genre=?, published_year=?, sbn=? WHERE id=?");
    $stmt->bind_param('sssisi', $title, $author, $genre, $published_year, $sbn, $id);

    if ($stmt->execute()) {
        // Update the synopsis in the storylines table
        $stmt_synopsis = $conn->prepare("UPDATE storylines SET synopsis=? WHERE book_id=?");
        $stmt_synopsis->bind_param('si', $synopsis, $id);

        if ($stmt_synopsis->execute()) {
            echo json_encode(['message' => 'Book updated successfully!']);
        } else {
            echo json_encode(['message' => 'Failed to update synopsis.']);
        }

        $stmt_synopsis->close();
    } else {
        echo json_encode(['message' => 'Failed to update book.']);
    }

    $stmt->close();
} elseif ($method === 'DELETE') {
    // Capture the 'id' from the query string
    $id = $_GET['id']; // Use $_GET instead of parsing input for DELETE requests
    
    // Delete the book from the books table
    $stmt = $conn->prepare("DELETE FROM books WHERE id=?");
    $stmt->bind_param('i', $id);

    if ($stmt->execute()) {
        // Delete the synopsis from the storylines table
        $stmt_synopsis = $conn->prepare("DELETE FROM storylines WHERE book_id=?");
        $stmt_synopsis->bind_param('i', $id);

        if ($stmt_synopsis->execute()) {
            echo json_encode(['message' => 'Book deleted successfully!']);
        } else {
            echo json_encode(['message' => 'Failed to delete synopsis.']);
        }

        $stmt_synopsis->close();
    } else {
        echo json_encode(['message' => 'Failed to delete book.']);
    }

    $stmt->close();


} elseif ($method === 'GET') {
    // Fetch books along with the synopsis
    $result = $conn->query("SELECT books.*, storylines.synopsis FROM books LEFT JOIN storylines ON books.id = storylines.book_id");
    $books = [];

    while ($row = $result->fetch_assoc()) {
        $books[] = $row;
    }

    echo json_encode($books);
}

$conn->close();
?>
