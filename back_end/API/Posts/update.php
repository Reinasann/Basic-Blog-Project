<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
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

if (
    !empty($data->id) &&
    !empty($data->title) &&
    isset($data->content) &&
    isset($data->category_id) &&
    isset($data->status)
) {
    $post->id = $data->id;
    $post->title = $data->title;
    $post->content = $data->content;
    $post->category_id = $data->category_id;
    $post->status = $data->status;

    if($post->update()) {
        // ✅ **จุดแก้ไข:** หลังจากอัปเดตสำเร็จ ให้ดึงข้อมูลโพสต์ฉบับเต็มกลับมา
        $query = "SELECT 
                    p.id, p.user_id, p.title, p.content, p.status, p.category_id,
                    p.created_at, p.view_count AS views, p.like_count AS likes,
                    u.username, c.name as category_name
                  FROM posts p
                  LEFT JOIN users u ON p.user_id = u.id
                  LEFT JOIN categories c ON p.category_id = c.id
                  WHERE p.id = :id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $post->id);
        $stmt->execute();
        $updated_post_data = $stmt->fetch(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode([
            'success' => true, 
            'message' => 'Post Updated Successfully',
            'post' => $updated_post_data // <-- ส่งข้อมูลโพสต์ฉบับเต็มกลับไปด้วย
        ]);

    } else {
        http_response_code(503);
        echo json_encode(['success' => false, 'message' => 'Failed to execute update query.']);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Incomplete data for update.']);
}
?>

