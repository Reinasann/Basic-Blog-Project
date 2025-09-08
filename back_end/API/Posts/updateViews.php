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

if (!empty($data->post_id)) {
    // ✅ อัปเดตคอลัมน์ 'view_count'
    $query = "UPDATE posts SET view_count = view_count + 1 WHERE id = :post_id";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':post_id', $data->post_id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "View count updated."]);
    } else {
        http_response_code(503);
        echo json_encode(["success" => false, "message" => "Unable to update view count."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Incomplete data."]);
}
?>
