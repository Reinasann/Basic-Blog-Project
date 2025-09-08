<?php
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';
include_once '../../models/Tag.php';

$database = new Database();
$db = $database->getConnection();

$tag = new Tag($db);

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id) && !empty($data->name)) {
    $tag->id = $data->id;
    $tag->name = $data->name;

    if ($tag->update()) {
        http_response_code(200);
        echo json_encode(["message" => "Tag updated successfully."]);
    } else {
        http_response_code(503);
        echo json_encode(["message" => "Unable to update tag."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Invalid input."]);
}
?>
