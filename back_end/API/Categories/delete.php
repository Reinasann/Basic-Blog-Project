<?php 
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(); }

include_once '../../config/database.php';
include_once '../../models/Categorie.php';

$database = new Database();
$db = $database->getConnection();
$Categorie = new Categorie($db);
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id)) {
    $Categorie->id = $data->id;
    if($Categorie->delete()) {
        echo json_encode(['success' => true, 'message' => 'Categorie Deleted']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Categorie Not Deleted']);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No ID provided.']);
}
?>

