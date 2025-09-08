<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';
include_once '../../models/User.php';

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
            "google_id"  => $google_id ?? null,  // ✅ ป้องกัน NULL
            "username"   => $username,
            "email"      => $email,
            "role"       => $role,
            "created_at" => $created_at,
            //"updated_at" => $updated_at
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
