<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: *');

include_once '../../config/database.php';
// สันนิษฐานว่า User Model ของคุณมีฟังก์ชัน create() อยู่แล้ว
// ซึ่งคล้ายกับฟังก์ชันใน register.php
include_once '../../models/User.php'; 

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

// ตรวจสอบว่าได้รับข้อมูลที่จำเป็นครบถ้วนหรือไม่
if (
    !empty($data->username) &&
    !empty($data->email) &&
    !empty($data->password)
) {
    $user->username = $data->username;
    $user->email = $data->email;
    $user->password = $data->password; // การเข้ารหัสจะเกิดขึ้นในฟังก์ชัน create()
    $user->role = $data->role ?? 'reader'; // กำหนด role เริ่มต้นถ้าไม่ได้ส่งมา

    // เรียกใช้ฟังก์ชัน create จาก User model
    if($user->create()) {
        echo json_encode(['success' => true, 'message' => 'User Created Successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to Create User. Email might already exist.']);
    }
} else {
    // ส่งข้อมูลมาไม่ครบ
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Incomplete data. Please provide username, email, and password.']);
}
?>
