<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';
include_once '../../Models/Comment.php';

// ✅ เชื่อมต่อ DB
$database = new Database();
$db = $database->getConnection();

// ✅ สร้าง object
$comment = new Comment($db);

// ✅ อ่าน comments
$stmt = $comment->read();
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database query failed"]);
    exit;
}

$num = $stmt->rowCount();

if ($num > 0) {
    $comments_arr = ["records" => []];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $comments_arr["records"][] = [
            "id"         => $row["id"],
            "post_id"    => $row["post_id"],
            "post_title" => $row["post_title"],
            "user_id"    => $row["user_id"],
            "username"   => $row["username"],
            "content"    => $row["content"],
            "created_at" => $row["created_at"],
            "updated_at" => $row["updated_at"]
        ];
    }

    http_response_code(200);
    echo json_encode($comments_arr, JSON_UNESCAPED_UNICODE);

} else {
    http_response_code(404);
    echo json_encode(["message" => "No comments found."]);
}
