<?php
// عرض الأخطاء لتسهيل التصحيح
ini_set('display_errors', 1);
error_reporting(E_ALL);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "smartdish"; // تأكد أن اسم قاعدة البيانات صحيح

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "Database connected successfully!";
?>

