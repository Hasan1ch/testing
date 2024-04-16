<?php
// Database connection details
$servername = "localhost";
$username = "your_username";
$password = "your_password";
$dbname = "world";

// Create a database connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle search request
if (isset($_GET['query'])) {
    $searchQuery = $_GET['query'];

    // Prepare and execute the SQL query
    $stmt = $conn->prepare("SELECT * FROM city WHERE Name LIKE ?");
    $stmt->bind_param("s", "%$searchQuery%");
    $stmt->execute();
    $result = $stmt->get_result();

    // Return search results as JSON
    $searchResults = [];
    while ($row = $result->fetch_assoc()) {
        $searchResults[] = $row;
    }
    echo json_encode($searchResults);
}

// Close the database connection
$conn->close();