<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: *');

include_once '../../config/database.php';
include_once '../../models/User.php';

$database = new Database();
$db = $database->getConnection();
$user = new User($db);
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id) && !empty($data->username) && !empty($data->email)) {
    $user->id = $data->id;
    $user->username = $data->username;
    $user->email = $data->email;
    $user->role = $data->role;
    
    // Check for password change
    if (!empty($data->password)) {
        $user->password = $data->password;
    }

    if($user->update()) {
        echo json_encode(['success' => true, 'message' => 'User Updated']);
    } else {
        echo json_encode(['success' => false, 'message' => 'User Not Updated']);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Incomplete data.']);
}
?>
