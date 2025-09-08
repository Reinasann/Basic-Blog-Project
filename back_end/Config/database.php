<?php
class Database {
    private $host = "localhost";
    private $db_name = "basic_blog";
    private $username = "root";
    private $password = "";


    // //upload to server
    // private $host = "student.crru.ac.th";
    // private $db_name = "db_661463026";
    // private $username = "661463026";
    // private $password = "13362";


    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception) {
            // ❌ ห้าม echo ข้อความ error ตรง ๆ
            echo json_encode([
                "success" => false,
                "message" => "Database connection error: " . $exception->getMessage()
            ]);
            exit;
        }

        return $this->conn;
    }
}
