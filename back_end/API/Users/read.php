<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// ✅ **จุดแก้ไข:** เปลี่ยนวิธีการเรียกไฟล์ให้แม่นยำขึ้น
// dirname(__DIR__, 2) จะหมายถึงการถอยหลังไป 2 โฟลเดอร์จากตำแหน่งปัจจุบัน (API/Users -> API -> back_end)
// ทำให้หาไฟล์เจอเสมอ ไม่ว่าจะรันจากที่ไหน
include_once dirname(__DIR__, 2) . '/config/database.php';
include_once dirname(__DIR__, 2) . '/models/User.php';

// บรรทัดด้านล่างนี้ทำงานถูกต้องอยู่แล้ว ไม่ต้องแก้ไข
$database = new Database();
$db = $database->getConnection();

$user = new User($db);

$stmt = $user->read();
$num = $stmt->rowCount();

if ($num > 0) {
    $users_arr = [];
    $users_arr["records"] = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $user_item = [
            "id"         => $id,
            "google_id"  => $google_id ?? null,
            "username"   => $username,
            "email"      => $email,
            "role"       => $role,
            "created_at" => $created_at,
        ];

        $users_arr["records"][] = $user_item;
    }

    echo json_encode($users_arr, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} else {
    echo json_encode([
        "records" => [],
        "message" => "No users found."
    ]);
}
?>
