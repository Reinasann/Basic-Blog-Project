<?php
// เปิดการแสดงผล Error ทั้งหมดเพื่อช่วยในการหาบั๊ก
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// ✅ 1. ใช้ try...catch เพื่อดักจับ Error ทั้งหมดและป้องกันการส่งผลลัพธ์เป็น HTML
try {
    // ✅ 2. แก้ไข Path การเรียกไฟล์ให้แม่นยำ ทำงานได้ทั้งบน XAMPP และโฮสต์จริง
    include_once dirname(__DIR__, 2) . '/config/database.php';

    $database = new Database();
    $db = $database->getConnection();

    // Query นี้ถูกต้องและสมบูรณ์แล้ว
    $query = "
        SELECT 
            p.id, p.user_id, p.title, p.content, p.status, p.category_id, p.image_urls,
            p.created_at, p.view_count AS views, p.like_count AS likes,
            u.username, c.name as category_name,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.created_at DESC
    ";

    $stmt = $db->prepare($query);
    $stmt->execute();
    $num = $stmt->rowCount();

    if ($num > 0) {
        $posts_arr = ["records" => []];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            array_push($posts_arr["records"], $row);
        }
        http_response_code(200);
        echo json_encode($posts_arr);
    } else {
        http_response_code(200); // ส่ง 200 OK แต่ records เป็น array ว่าง
        echo json_encode(["records" => [], "message" => "No posts found."]);
    }
} catch (Exception $e) {
    // ✅ 3. ถ้าเกิด Error ใดๆ ขึ้น จะส่งกลับเป็น JSON ที่มีรายละเอียดของ Error
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "message" => "Server Error.", 
        "error" => $e->getMessage()
    ]);
}
?>

