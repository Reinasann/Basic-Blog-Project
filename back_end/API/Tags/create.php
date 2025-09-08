<?php
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';
include_once '../../models/Tag.php';

$database = new Database();
$db = $database->getConnection();

$tag = new Tag($db);

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->name)) {
    $tag->name = $data->name;

    if ($tag->create()) {
        http_response_code(201);
        echo json_encode(["message" => "Tag created successfully."]);
    } else {
        http_response_code(503);
        echo json_encode(["message" => "Unable to create tag."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Name is required."]);
}
?>
