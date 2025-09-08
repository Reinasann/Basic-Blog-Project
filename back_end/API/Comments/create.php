<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->post_id) && !empty($data->user_id) && !empty($data->content)) {
    // ✅ เพิ่มข้อมูลลงตาราง 'comments'
    $query = "INSERT INTO comments (post_id, user_id, content) VALUES (:post_id, :user_id, :content)";
    
    $stmt = $db->prepare($query);

    // Sanitize data
    $post_id = htmlspecialchars(strip_tags($data->post_id));
    $user_id = htmlspecialchars(strip_tags($data->user_id));
    $content = htmlspecialchars(strip_tags($data->content));

    $stmt->bindParam(':post_id', $post_id);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->bindParam(':content', $content);

    if ($stmt->execute()) {
        http_response_code(201); // 201 Created
        echo json_encode(["success" => true, "message" => "Comment created."]);
    } else {
        http_response_code(503);
        echo json_encode(["success" => false, "message" => "Unable to create comment."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Incomplete data."]);
}
?>
