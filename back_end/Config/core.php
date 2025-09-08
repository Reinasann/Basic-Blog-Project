<?php
// ตั้ง timezone
date_default_timezone_set("Asia/Bangkok");

// JWT secret key (กรณีใช้ Auth)
$key = "YOUR_SECRET_KEY";  
$iss = "http://localhost"; // issuer
$aud = "http://localhost"; // audience
$iat = time();             // issued at
$nbf = $iat + 10;          // not before (เริ่มใช้งานได้เมื่อไหร่)
