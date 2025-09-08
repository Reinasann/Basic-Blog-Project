<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/database.php';
// ไม่จำเป็นต้องใช้ User Model ที่นี่ เพราะเราจัดการ query โดยตรง

$input = json_decode(file_get_contents("php://input"));

if (!isset($input->credential)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "No credential received"]);
    exit;
}

$jwt = $input->credential;
$google_api_url = "https://oauth2.googleapis.com/tokeninfo?id_token=" . urlencode($jwt);

$response = @file_get_contents($google_api_url);
if ($response === false) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unable to verify token with Google API"]);
    exit;
}

$payload = json_decode($response, true);
if (!isset($payload['sub'], $payload['email'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Invalid token payload"]);
    exit;
}

$google_id = $payload['sub'];
$email     = $payload['email'];
$name      = $payload['name'] ?? explode("@", $email)[0];

$database = new Database();
$db = $database->getConnection();

$query = "SELECT id, username, role FROM users WHERE google_id = :google_id OR email = :email LIMIT 1";
$stmt = $db->prepare($query);
$stmt->bindParam(':google_id', $google_id);
$stmt->bindParam(':email', $email);
$stmt->execute();
$user = $stmt->fetch(PDO::FETCH_ASSOC);

$user_id = null;
$role = 'reader'; // Default role
$username = $name;

if ($user) {
    // User exists
    $user_id = $user['id'];
    $role = $user['role'] ?? 'reader';
    $username = $user['username'];
} else {
    // User does not exist, create a new one
    $insert_query = "INSERT INTO users (username, email, password, google_id, role) 
                     VALUES (:username, :email, '', :google_id, :role)";
    $insert_stmt = $db->prepare($insert_query);
    $insert_stmt->bindParam(':username', $name);
    $insert_stmt->bindParam(':email', $email);
    $insert_stmt->bindParam(':google_id', $google_id);
    $insert_stmt->bindParam(':role', $role);
    
    if ($insert_stmt->execute()) {
        $user_id = $db->lastInsertId();
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Failed to create new user"]);
        exit;
    }
}

// สร้าง token หรือ session ตามที่คุณต้องการ (ตัวอย่างนี้ใช้ข้อมูลพื้นฐาน)
$token = base64_encode(json_encode([
    "id" => $user_id,
    "email" => $email,
    "role" => $role,
    "exp" => time() + (60*60*24) // Tokenหมดอายุใน 1 วัน
]));

http_response_code(200);
echo json_encode([
  "success" => true,
  "message" => "Google login successful",
  "token" => $token,
  "username" => $username,
  "role" => $role,
  "user_id" => $user_id // ส่ง user_id กลับไปให้ frontend
]);
?>
