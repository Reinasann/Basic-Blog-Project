<?php
header("Content-Type: application/json; charset=UTF-8");
include_once '../../config/database.php';
include_once '../../models/Comment.php';

$database = new Database();
$db = $database->getConnection();
$comment = new Comment($db);

$data = json_decode(file_get_contents("php://input"));
if (isset($data->id) && !empty($data->id)) {
    $comment->id = $data->id;
} else {
    echo json_encode(["message" => "Invalid comment ID."]);
    exit;
}

if($comment->delete()) {
    echo json_encode(["message" => "Comment deleted successfully."]);
} else {
    echo json_encode(["message" => "Unable to delete comment."]);
}
