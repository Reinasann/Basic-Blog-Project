<?php
header('Content-Type: text/plain; charset=utf-8');

echo "PHP Path & Permission Checker\n";
echo "=============================\n\n";

// นี่คือ path ที่เราต้องการทดสอบ (เหมือนกับใน delete.php)
$targetDir = '../../IMG/Posts/';

echo "1. Relative Path ที่กำลังทดสอบ:\n";
echo "   -> " . $targetDir . "\n\n";

// แปลง path สัมพัทธ์ให้เป็น path จริงบนเซิร์ฟเวอร์
$realPath = realpath($targetDir);

echo "2. Absolute Path ที่เซิร์ฟเวอร์เห็น:\n";
if ($realPath) {
    echo "   -> " . $realPath . "\n\n";
} else {
    echo "   -> !!! ไม่สามารถหา path จริงได้ อาจจะพิมพ์ผิดหรือไม่มีอยู่จริง !!!\n\n";
    exit;
}

echo "3. การตรวจสอบสถานะโฟลเดอร์:\n";
// ตรวจสอบว่า path นี้มีอยู่จริงหรือไม่
if (file_exists($realPath)) {
    echo "   [✓] พบโฟลเดอร์: YES\n";
} else {
    echo "   [✗] พบโฟลเดอร์: NO - ปัญหาอยู่ที่นี่! โฟลเดอร์ไม่มีอยู่จริง\n";
    exit;
}

// ตรวจสอบว่าเป็น Directory (โฟลเดอร์) จริงหรือไม่
if (is_dir($realPath)) {
    echo "   [✓] เป็นโฟลเดอร์: YES\n";
} else {
    echo "   [✗] เป็นโฟลเดอร์: NO - Path นี้ชี้ไปยังไฟล์ ไม่ใช่โฟลเดอร์\n";
    exit;
}

echo "\n4. การตรวจสอบสิทธิ์ (Permissions):\n";
// ตรวจสอบว่า PHP สามารถอ่านข้อมูลในโฟลเดอร์ได้หรือไม่
if (is_readable($realPath)) {
    echo "   [✓] สิทธิ์ในการอ่าน (Readable): YES\n";
} else {
    echo "   [✗] สิทธิ์ในการอ่าน (Readable): NO - กรุณาตรวจสอบ File Permissions\n";
}

// ตรวจสอบว่า PHP สามารถเขียน (และลบ) ไฟล์ในโฟลเดอร์ได้หรือไม่ (สำคัญที่สุด)
if (is_writable($realPath)) {
    echo "   [✓] สิทธิ์ในการเขียน/ลบ (Writable): YES\n";
} else {
    echo "   [✗] สิทธิ์ในการเขียน/ลบ (Writable): NO - นี่คือต้นตอของปัญหา! กรุณาตั้งค่า File Permissions ให้เซิร์ฟเวอร์สามารถเขียนได้\n";
}

echo "\n=============================\n";
echo "สรุป: ถ้าเห็น [✗] ที่ข้อ 4 'Writable' ให้กลับไปแก้ไขสิทธิ์การเข้าถึงของโฟลเดอร์ IMG และ Posts ครับ\n";

?>
