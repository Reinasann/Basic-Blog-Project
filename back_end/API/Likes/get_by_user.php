<?php
// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';

// ตรวจสอบว่ามี user_id ส่งมาหรือไม่
if (!isset($_GET['user_id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'User ID is required.']);
    exit();
}

$user_id = $_GET['user_id'];

$database = new Database();
$db = $database->getConnection();

try {
    // Query เพื่อดึง post_id ทั้งหมดที่ user คนนี้เคยไลค์
    $query = "SELECT post_id FROM post_likes WHERE user_id = :user_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->execute();

    $liked_posts = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'liked_posts' => $liked_posts // ส่งกลับเป็น array ของ post_id
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'A server error occurred.',
        'error' => $e->getMessage()
    ]);
}
?>

