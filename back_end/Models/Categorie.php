<?php
class Categorie {
    private $conn;
    private $table_name = "categories";

    // Properties
    public $id;
    public $name;
    public $slug;

    public function __construct($db){
        $this->conn = $db;
    }

    // READ: อ่านข้อมูลหมวดหมู่ทั้งหมด
    public function read(){
        $query = "SELECT id, name, slug FROM " . $this->table_name . " ORDER BY name ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // CREATE: สร้างหมวดหมู่ใหม่
    public function create(){
        $query = "INSERT INTO " . $this->table_name . " SET name=:name, slug=:slug";
        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->slug = $this->generateUniqueSlug($this->name);

        // Bind
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":slug", $this->slug);

        if($stmt->execute()){
            return true;
        }
        return false;
    }

    // UPDATE: แก้ไขข้อมูลหมวดหมู่
    public function update(){
        $query = "UPDATE " . $this->table_name . " SET name = :name, slug = :slug WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->slug = $this->generateUniqueSlug($this->name, $this->id);

        // Bind
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':slug', $this->slug);

        if($stmt->execute()){
            return true;
        }
        return false;
    }

    // DELETE: ลบหมวดหมู่
    public function delete(){
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(':id', $this->id);

        if($stmt->execute()){
            return true;
        }
        return false;
    }

    // Helper function to check if a slug exists
    private function slugExists($slug, $ignoreId = null){
        $query = "SELECT id FROM " . $this->table_name . " WHERE slug = :slug";
        if ($ignoreId) {
            $query .= " AND id != :id";
        }
        $query .= " LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':slug', $slug);
        if ($ignoreId) {
            $stmt->bindParam(':id', $ignoreId);
        }
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    // Helper function to generate a unique slug
    private function generateUniqueSlug($name, $ignoreId = null){
        $baseSlug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));
        $slug = $baseSlug;
        $counter = 1;
        while($this->slugExists($slug, $ignoreId)){
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }
        return $slug;
    }
}
?>

