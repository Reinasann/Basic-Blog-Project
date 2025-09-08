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

if (!empty($data->id)) {
    $user->id = $data->id;
    if($user->delete()) {
        echo json_encode(['success' => true, 'message' => 'User Deleted']);
    } else {
        echo json_encode(['success' => false, 'message' => 'User Not Deleted']);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No ID provided.']);
}
?>
