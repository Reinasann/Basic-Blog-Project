<?php
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';
include_once '../../models/Tag.php';

$database = new Database();
$db = $database->getConnection();

$tag = new Tag($db);
$stmt = $tag->read();
$num = $stmt->rowCount();

if($num > 0) {
    $tags_arr = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $tags_arr[] = [
            "id" => $id,
            "name" => $name,
            "created_at" => $created_at
        ];
    }
    http_response_code(200);
    echo json_encode($tags_arr);
} else {
    http_response_code(404);
    echo json_encode(["message" => "No tags found."]);
}
?>
