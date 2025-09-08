<?php
header("Content-Type: application/json; charset=UTF-8");
include_once '../../config/database.php';
include_once '../../models/Comment.php';

$database = new Database();
$db = $database->getConnection();
$comment = new Comment($db);

$data = json_decode(file_get_contents("php://input"));

if (isset($data->id, $data->content)) {
    $comment->id = $data->id;
    $comment->content = $data->content;

    if ($comment->update()) {
        echo json_encode(["message" => "Comment updated successfully."]);
    } else {
        echo json_encode(["message" => "Unable to update comment."]);
    }
} else {
    echo json_encode(["message" => "Invalid input. Please provide 'id' and 'content'."]);
}
