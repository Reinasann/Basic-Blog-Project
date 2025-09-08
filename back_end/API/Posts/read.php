<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';
include_once '../../models/Post.php';

$database = new Database();
$db = $database->getConnection();

// --- ส่วนของการอ่านข้อมูล ---
// ✅ แก้ไข SQL Query ให้ดึงข้อมูลที่จำเป็นทั้งหมด
$query = "
    SELECT 
        p.id,
        p.user_id, 
        p.title, 
        p.content,
        p.status,
        p.category_id,
        p.created_at, 
        p.view_count AS views,
        p.like_count AS likes,
        u.username, 
        c.name as category_name
    FROM 
        posts p
    LEFT JOIN 
        users u ON p.user_id = u.id
    LEFT JOIN 
        categories c ON p.category_id = c.id
    ORDER BY 
        p.created_at DESC
";

$stmt = $db->prepare($query);
$stmt->execute();

$num = $stmt->rowCount();

if ($num > 0) {
    $posts_arr = array();
    $posts_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $post_item = array(
            "id" => $id,
            "user_id" => $user_id,
            "title" => $title,
            "content" => $content,
            "status" => $status,
            "category_id" => $category_id,
            "username" => $username,
            "category_name" => $category_name,
            "views" => $views,
            "likes" => $likes,
            "created_at" => $created_at
        );
        array_push($posts_arr["records"], $post_item);
    }

    http_response_code(200);
    echo json_encode($posts_arr);
} else {
    http_response_code(404);
    echo json_encode(array("records" => [], "message" => "No posts found."));
}
?>

