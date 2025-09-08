<?php
// Headers
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

if (
    !empty($data->title) &&
    isset($data->content) &&
    !empty($data->user_id) && 
    isset($data->category_id)
) {
    $post->title = $data->title;
    $post->content = $data->content;
    $post->user_id = $data->user_id;
    $post->category_id = $data->category_id;
    $post->status = $data->status ?? 'draft';

    if($post->create()) {
        // ✅ **จุดแก้ไขที่ 1:** ดึง ID ของโพสต์ที่เพิ่งสร้างล่าสุด
        $new_post_id = $db->lastInsertId();

        // ✅ **จุดแก้ไขที่ 2:** สร้าง Query เพื่อดึงข้อมูลโพสต์ใหม่ทั้งหมด
        $query = "SELECT 
                    p.id, p.title, p.content, p.created_at, p.status,
                    p.view_count AS views, p.like_count AS likes,
                    u.username, c.name as category_name
                  FROM posts p
                  LEFT JOIN users u ON p.user_id = u.id
                  LEFT JOIN categories c ON p.category_id = c.id
                  WHERE p.id = :id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $new_post_id);
        $stmt->execute();
        $new_post_data = $stmt->fetch(PDO::FETCH_ASSOC);

        // ✅ **จุดแก้ไขที่ 3:** ส่งข้อมูลโพสต์ใหม่กลับไปใน Response
        http_response_code(201);
        echo json_encode([
            'success' => true, 
            'message' => 'Post Created Successfully',
            'post' => $new_post_data // <-- ส่งข้อมูลโพสต์ใหม่กลับไปด้วย
        ]);

    } else {
        http_response_code(503);
        echo json_encode(['success' => false, 'message' => 'Failed to create post.']);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Incomplete data.']);
}
?>

