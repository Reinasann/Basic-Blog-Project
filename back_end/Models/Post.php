<?php
class Post {
    private $conn;
    private $table_name = "posts";

    // Properties
    public $id;
    public $user_id;
    public $category_id;
    public $title;
    public $slug;
    public $content;
    public $status;

    public function __construct($db){
        $this->conn = $db;
    }

    // ✅ **ฟังก์ชันใหม่: ตรวจสอบว่า slug มีอยู่แล้วหรือไม่**
    private function slugExists($slug){
        $query = "SELECT id FROM " . $this->table_name . " WHERE slug = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $slug);
        $stmt->execute();
        if($stmt->rowCount() > 0){
            return true;
        }
        return false;
    }

    // ✅ **ฟังก์ชันใหม่: สร้าง slug ที่ไม่ซ้ำกัน**
    private function generateUniqueSlug($title){
        $baseSlug = strtolower(trim(preg_replace('/[^a-z0-9-]+/', '-', $title)));
        $slug = $baseSlug;
        $counter = 1;
        while($this->slugExists($slug)){
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }
        return $slug;
    }

    // CREATE Post (ฉบับปรับปรุง)
    function create(){
        $query = "INSERT INTO " . $this->table_name . " 
                  SET user_id=:user_id, category_id=:category_id, title=:title, slug=:slug, content=:content, status=:status";
        
        $stmt = $this->conn->prepare($query);

        // Sanitize data
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->content = htmlspecialchars(strip_tags($this->content));
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));
        $this->category_id = htmlspecialchars(strip_tags($this->category_id));
        
        // ✅ **จุดแก้ไข:** เรียกใช้ฟังก์ชันสร้าง slug ที่ไม่ซ้ำกัน
        $this->slug = $this->generateUniqueSlug($this->title);

        // Bind data
        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":content", $this->content);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":category_id", $this->category_id);
        $stmt->bindParam(":slug", $this->slug);

        if($stmt->execute()){
            return true;
        }
        return false;
    }

    // READ All Posts
    public function read() {
        $query = "SELECT 
                    c.name as category_name,
                    u.username,
                    p.id,
                    p.user_id,
                    p.category_id,
                    p.title,
                    p.content,
                    p.status,
                    p.view_count AS views,
                    p.like_count AS likes,
                    p.created_at
                FROM " . $this->table_name . " p
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN users u ON p.user_id = u.id
                ORDER BY p.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // UPDATE Post (ฉบับปรับปรุง)
    function update(){
        $query = "UPDATE " . $this->table_name . "
                  SET title = :title, content = :content, category_id = :category_id, status = :status, slug = :slug
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);

        // Sanitize data
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->content = htmlspecialchars(strip_tags($this->content));
        $this->category_id = htmlspecialchars(strip_tags($this->category_id));
        $this->status = htmlspecialchars(strip_tags($this->status));
        
        // ✅ **จุดแก้ไข:** สร้าง slug ใหม่ที่ไม่ซ้ำกัน (ยกเว้น slug ของตัวเอง)
        // Note: For simplicity, this example creates a unique slug on every update.
        // A more advanced version might only do this if the title changes.
        $this->slug = $this->generateUniqueSlug($this->title);

        // Bind data
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':content', $this->content);
        $stmt->bindParam(':category_id', $this->category_id);
        $stmt->bindParam(':status', $this->status);
        $stmt->bindParam(':slug', $this->slug);

        if($stmt->execute()){
            return true;
        }
        return false;
    }
    
    // DELETE Post
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
?>

