<?php
// Set headers for CORS and content type
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Get the raw POST data from the request
$data = json_decode(file_get_contents("php://input"));

// Check if the 'filenames' property exists and is an array
if (!isset($data->filenames) || !is_array($data->filenames)) {
    // If not, return an error response
    echo json_encode(['success' => false, 'message' => 'Invalid input. "filenames" array is required.']);
    exit;
}

$filenames = $data->filenames;
// Define the relative path to the image directory
$upload_dir = '../../IMG/Posts/'; 
$deleted_files = [];
$error_files = [];

// Loop through each filename provided
foreach ($filenames as $filename) {
    // Sanitize the filename to prevent directory traversal attacks (e.g., ../../)
    $sanitized_filename = basename($filename);
    $file_path = $upload_dir . $sanitized_filename;

    // Check if the file actually exists
    if (file_exists($file_path)) {
        // Attempt to delete the file
        if (unlink($file_path)) {
            // If successful, add to the list of deleted files
            $deleted_files[] = $sanitized_filename;
        } else {
            // If failed, add to the list of error files
            $error_files[] = $sanitized_filename;
        }
    } else {
        // If the file doesn't exist, note it as an error for debugging purposes
        $error_files[] = $sanitized_filename . " (not found)";
    }
}

// Check if there were any errors during the process
if (count($error_files) === 0) {
    // If no errors, send a success response
    echo json_encode([
        'success' => true,
        'message' => 'All specified images were successfully deleted.',
        'deleted_count' => count($deleted_files)
    ]);
} else {
    // If there were errors, send a failure response with details
    echo json_encode([
        'success' => false,
        'message' => 'Some files could not be deleted.',
        'deleted' => $deleted_files,
        'errors' => $error_files
    ]);
}
?>
