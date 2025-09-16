<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(); }

include_once '../../config/database.php';
include_once '../../models/Post.php';

$database = new Database();
$db = $database->getConnection();
$post = new Post($db);
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->title) && isset($data->content) && !empty($data->user_id) && isset($data->category_id)) {
    $post->title = $data->title;
    $post->content = $data->content;
    $post->user_id = $data->user_id;
    $post->category_id = $data->category_id;
    $post->status = $data->status ?? 'draft';
    $post->image_urls = isset($data->images) ? implode(',', $data->images) : null;

    if($post->create()) {
        $new_post_id = $db->lastInsertId();
        $query = "SELECT p.id, p.user_id, p.title, p.content, p.status, p.category_id, p.image_urls, p.created_at, p.view_count AS views, p.like_count AS likes, u.username, c.name as category_name, (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count FROM posts p LEFT JOIN users u ON p.user_id = u.id LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $new_post_id);
        $stmt->execute();
        $new_post_data = $stmt->fetch(PDO::FETCH_ASSOC);

        http_response_code(201);
        echo json_encode(['success' => true, 'message' => 'Post Created', 'post' => $new_post_data]);
    } else {
        http_response_code(503);
        echo json_encode(['success' => false, 'message' => 'Post Not Created']);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Incomplete data.']);
}
?>

