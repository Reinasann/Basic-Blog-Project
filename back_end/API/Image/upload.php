<?php
header("Access-Control-Allow-Origin: *");
header("Access-control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// โฟลเดอร์สำหรับเก็บรูปภาพ ตรวจสอบว่ามีอยู่จริงและเขียนได้
$upload_dir = dirname(__DIR__, 2) . '/IMG/Posts/';
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

if (isset($_FILES['images'])) {
    $uploaded_files = [];
    $errors = [];

    foreach ($_FILES['images']['tmp_name'] as $key => $tmp_name) {
        $file_name = $_FILES['images']['name'][$key];
        $file_error = $_FILES['images']['error'][$key];

        if ($file_error === UPLOAD_ERR_OK) {
            $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
            $allowed = ['jpg', 'jpeg', 'png', 'gif'];

            if (in_array($file_ext, $allowed)) {
                $new_file_name = uniqid('post_', true) . '.' . $file_ext;
                $destination = $upload_dir . $new_file_name;

                if (move_uploaded_file($tmp_name, $destination)) {
                    $uploaded_files[] = $new_file_name;
                } else {
                    $errors[] = "Failed to move file: $file_name";
                }
            } else {
                $errors[] = "File type not allowed: $file_name";
            }
        } else {
            $errors[] = "Error uploading file: $file_name (code: $file_error)";
        }
    }

    if (empty($errors)) {
        http_response_code(200);
        echo json_encode(['success' => true, 'fileNames' => $uploaded_files]);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No files uploaded.']);
}
?>

