<?php
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';
include_once '../../Models/Post.php';

$database = new Database();
$db = $database->getConnection();

$post = new Post($db);

// รับค่า id จาก query string
$post->id = isset($_GET['id']) ? $_GET['id'] : die(json_encode(["message" => "❌ No post ID provided."]));

// ดึงข้อมูลโพสต์
$post->read_single();

if ($post->title != null) {
    $post_arr = array(
        "id"          => $post->id,
        "user_id"     => $post->user_id,
        "category_id" => $post->category_id,
        "title"       => $post->title,
        "slug"        => $post->slug,
        "content"     => $post->content,
        "image_url"   => $post->image_url,
        "status"      => $post->status,
        "view_count"  => $post->view_count,
        "like_count"  => $post->like_count,
        "created_at"  => $post->created_at,
        "updated_at"  => $post->updated_at
    );

    http_response_code(200);
    echo json_encode($post_arr);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "❌ Post not found."));
}
