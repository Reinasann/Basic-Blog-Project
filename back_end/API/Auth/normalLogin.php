<?php
// ✅ อนุญาต CORS
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// ✅ ตรงนี้แก้ให้ชื่อโฟลเดอร์เล็กตรงกัน
include_once "../../config/database.php";
include_once "../../models/User.php";

$database = new Database();
$db       = $database->getConnection();

// ✅ รับค่าจาก React
$data = json_decode(file_get_contents("php://input"));

if (! empty($data->email) && ! empty($data->password)) {
    $stmt = $db->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
    $stmt->bindParam(":email", $data->email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // ✅ ตรวจสอบรหัสผ่าน (hash + verify)
        if (password_verify($data->password, $user["password"])) {
            // สร้าง token
            $token = base64_encode(json_encode([
                "user_id" => $user["id"],
                "email"   => $user["email"],
                "role"    => $user["role"],
                "exp"     => time() + 3600,
            ]));

            echo json_encode([
                "success"  => true,
                "token"    => $token,
                "role"     => $user["role"],
                "username" => $user["username"],
                "user_id"  => $user["id"], // 👈 ส่งกลับไป
            ]);

        } else {
            echo json_encode(["success" => false, "message" => "❌ Invalid password"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "❌ User not found"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "❌ Missing fields"]);
}
