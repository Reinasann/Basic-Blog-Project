<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

include_once '../../config/database.php';
include_once '../../models/Comment.php';

$database = new Database();
$db = $database->getConnection();
$comment = new Comment($db);

$post_id = isset($_GET['post_id']) ? intval($_GET['post_id']) : 0;

if ($post_id > 0) {
    $stmt = $comment->readByPost($post_id);
    $num = $stmt->rowCount();

    if ($num > 0) {
        $comments_arr = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $comments_arr[] = $row;
        }
        echo json_encode(["records" => $comments_arr], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(["records" => []]);
    }
} else {
    echo json_encode(["message" => "❌ post_id missing"]);
}
