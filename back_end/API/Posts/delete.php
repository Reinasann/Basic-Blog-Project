<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';
include_once '../../models/Post.php';

$database = new Database();
$db = $database->getConnection();
$post = new Post($db);
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id)) {
    $post->id = $data->id;
    if($post->delete()) {
        echo json_encode(['success' => true, 'message' => 'Post Deleted']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Post Not Deleted']);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No ID provided.']);
}
?>

