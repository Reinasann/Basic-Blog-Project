<?php 
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../../config/database.php';
include_once '../../models/Categorie.php';

$database = new Database();
$db = $database->getConnection();
$Categorie = new Categorie($db);

$result = $Categorie->read();
$num = $result->rowCount();

if($num > 0) {
    $cat_arr = array();
    $cat_arr['records'] = array();

    while($row = $result->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $cat_item = array(
            'id' => $id,
            'name' => $name,
            'slug' => $slug
        );
        array_push($cat_arr['records'], $cat_item);
    }
    echo json_encode($cat_arr);
} else {
    echo json_encode(['records' => [], 'message' => 'No Categories Found']);
}
?>

