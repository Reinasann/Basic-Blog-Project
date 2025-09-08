<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include_once '../../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['post_id'], $data['user_id'])) {
    echo json_encode(["success" => false, "message" => "❌ Missing fields"]);
    exit;
}

$database = new Database();
$db = $database->getConnection();

// check like exist
$query = "SELECT * FROM post_likes WHERE post_id = :post_id AND user_id = :user_id";
$stmt = $db->prepare($query);
$stmt->execute([
    ":post_id" => $data['post_id'],
    ":user_id" => $data['user_id']
]);

if ($stmt->rowCount() > 0) {
    // unlike
    $del = $db->prepare("DELETE FROM post_likes WHERE post_id = :post_id AND user_id = :user_id");
    $del->execute([":post_id" => $data['post_id'], ":user_id" => $data['user_id']]);

    $db->prepare("UPDATE posts SET like_count = like_count - 1 WHERE id = :post_id")
       ->execute([":post_id" => $data['post_id']]);

    echo json_encode(["success" => true, "liked" => false]);
} else {
    // like
    $ins = $db->prepare("INSERT INTO post_likes (post_id, user_id) VALUES (:post_id, :user_id)");
    $ins->execute([":post_id" => $data['post_id'], ":user_id" => $data['user_id']]);

    $db->prepare("UPDATE posts SET like_count = like_count + 1 WHERE id = :post_id")
       ->execute([":post_id" => $data['post_id']]);

    echo json_encode(["success" => true, "liked" => true]);
}
