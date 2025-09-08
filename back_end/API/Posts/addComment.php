<?php
header("Content-Type: application/json; charset=UTF-8");
include_once "../../config/database.php";

$database = new Database();
$db = $database->getConnection();
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->post_id) && !empty($data->user_id) && !empty($data->text)) {
    $stmt = $db->prepare("INSERT INTO comments (post_id, user_id, comment_text, created_at) VALUES (:post_id, :user_id, :text, NOW())");
    $stmt->bindParam(":post_id", $data->post_id);
    $stmt->bindParam(":user_id", $data->user_id);
    $stmt->bindParam(":text", $data->text);
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Insert failed"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Missing fields"]);
}
