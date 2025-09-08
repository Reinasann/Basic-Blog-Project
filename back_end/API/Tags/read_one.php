<?php
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';
include_once '../../models/Tag.php';

$database = new Database();
$db = $database->getConnection();

$tag = new Tag($db);

// รับ id จาก query string
$tag->id = isset($_GET['id']) ? $_GET['id'] : die();

$tag->readOne();

if ($tag->name != null) {
    $tag_arr = [
        "id" => $tag->id,
        "name" => $tag->name,
        "created_at" => $tag->created_at
    ];
    http_response_code(200);
    echo json_encode($tag_arr);
} else {
    http_response_code(404);
    echo json_encode(["message" => "Tag not found."]);
}
?>
