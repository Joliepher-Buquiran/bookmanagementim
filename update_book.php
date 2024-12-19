<?php
// Connection to database
include 'config.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $book_id = $_POST['book_id'];
    $title = $_POST['title'];
    $author = $_POST['author'];
    $genre = $_POST['genre'];
    $published_year = $_POST['published_year'];

    // Update book in the database
    $stmt = $conn->prepare("UPDATE books SET title = ?, author = ?, genre = ?, published_year = ? WHERE id = ?");
    $stmt->bind_param("sssii", $title, $author, $genre, $published_year, $book_id);
    $stmt->execute();
    echo "Book updated successfully.";
}
?>
