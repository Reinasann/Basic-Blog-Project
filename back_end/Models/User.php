<?php
class User {
    // Database connection and table name
    private $conn;
    private $table_name = "users";

    // Object Properties
    public $id;
    public $username;
    public $email;
    public $password;
    public $google_id;
    public $role;
    public $created_at;

    // Constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    // CREATE user: สำหรับการสมัครสมาชิกและ admin สร้าง user ใหม่
    function create(){
        $query = "INSERT INTO " . $this->table_name . "
                  SET
                    username = :username,
                    email = :email,
                    password = :password,
                    role = :role,
                    google_id = :google_id";

        $stmt = $this->conn->prepare($query);

        // ✅ **จุดแก้ไข:** ใช้ Null Coalescing Operator (??) เพื่อกำหนดค่าเริ่มต้น
        // ป้องกันการส่งค่า null เข้าฟังก์ชัน strip_tags()
        $this->username = htmlspecialchars(strip_tags($this->username ?? ''));
        $this->email = htmlspecialchars(strip_tags($this->email ?? ''));
        $this->role = htmlspecialchars(strip_tags($this->role ?? 'reader')); // กำหนด role เริ่มต้นถ้าไม่มี
        $this->google_id = htmlspecialchars(strip_tags($this->google_id ?? ''));

        // Hash the password before saving
        $password_hash = password_hash($this->password, PASSWORD_BCRYPT);

        // Bind data
        $stmt->bindParam(":username", $this->username);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":password", $password_hash);
        $stmt->bindParam(":role", $this->role);
        $stmt->bindParam(":google_id", $this->google_id);

        // Execute query
        if($stmt->execute()){
            return true;
        }
        return false;
    }

    // READ users: ดึงข้อมูลผู้ใช้ทั้งหมดสำหรับหน้า Dashboard
    function read(){
        $query = "SELECT
                    id, username, email, role, created_at, google_id
                  FROM
                    " . $this->table_name . "
                  ORDER BY
                    created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
    
    // UPDATE user: แก้ไขข้อมูลผู้ใช้โดย Admin
    function update(){
        $password_set = !empty($this->password) ? ", password = :password" : "";
        $query = "UPDATE " . $this->table_name . "
                  SET
                    username = :username,
                    email = :email,
                    role = :role
                    {$password_set}
                  WHERE
                    id = :id";
        
        $stmt = $this->conn->prepare($query);

        // Sanitize data
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->username = htmlspecialchars(strip_tags($this->username));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->role = htmlspecialchars(strip_tags($this->role));
        
        // Bind data
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':username', $this->username);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':role', $this->role);

        if(!empty($this->password)){
            $this->password = htmlspecialchars(strip_tags($this->password));
            $hashed_password = password_hash($this->password, PASSWORD_BCRYPT);
            $stmt->bindParam(':password', $hashed_password);
        }

        if($stmt->execute()){
            return true;
        }
        return false;
    }

    // DELETE user: ลบผู้ใช้โดย Admin
    function delete(){
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(':id', $this->id);

        if($stmt->execute()){
            return true;
        }
        return false;
    }
}
