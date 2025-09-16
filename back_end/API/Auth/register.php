<?php
// เปิดการแสดงผล Error ทั้งหมดเพื่อช่วยในการหาบั๊ก
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Headers ที่จำเป็น
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// จัดการกับ OPTIONS request สำหรับ CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ✅ **จุดแก้ไข:** เปลี่ยนวิธีการเรียกไฟล์ให้แม่นยำ ทำงานได้ทั้งบน XAMPP และโฮสต์จริง
// dirname(__DIR__, 2) จะหมายถึงการถอยหลังไป 2 โฟลเดอร์จากตำแหน่งปัจจุบัน (API/Auth -> API -> back_end)
include_once dirname(__DIR__, 2) . '/config/database.php';
include_once dirname(__DIR__, 2) . '/models/User.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    $user = new User($db);

    $data = json_decode(file_get_contents("php://input"));

    if (
        !empty($data->username) && 
        !empty($data->email) && 
        !empty($data->password)
    ) {
        $user->username = $data->username;
        $user->email = $data->email;
        $user->password = $data->password; // การเข้ารหัสจะเกิดขึ้นในฟังก์ชัน create() ของ Model

        if($user->create()){
            http_response_code(201); // 201 Created
            echo json_encode(["success" => true, "message" => "User registered successfully."]);
        } else {
            http_response_code(503); // Service Unavailable
            echo json_encode(["success" => false, "message" => "Unable to register user. The email may already be in use."]);
        }
    } else {
        http_response_code(400); // Bad Request
        echo json_encode(["success" => false, "message" => "Incomplete data provided."]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "A server error occurred.",
        "error" => $e->getMessage()
    ]);
}
?>

