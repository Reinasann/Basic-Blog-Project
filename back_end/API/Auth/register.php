<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include_once '../../config/database.php';
$conn = (new Database())->getConnection();

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->username) && !empty($data->email) && !empty($data->password)){
    $hashedPassword = password_hash($data->password, PASSWORD_BCRYPT);

    $stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
    $stmt->execute([$data->username, $data->email, $hashedPassword]);

    echo json_encode(["message" => "User registered successfully"]);
} else {
    echo json_encode(["message" => "Incomplete data"]);
}
