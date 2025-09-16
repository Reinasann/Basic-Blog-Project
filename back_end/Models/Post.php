<?php
class Post {
    private $conn;
    private $table_name = "posts";

    public $id;
    public $user_id;
    public $category_id;
    public $title;
    public $slug;
    public $content;
    public $status;
    public $image_urls;

    public function __construct($db){
        $this->conn = $db;
    }

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

    function create(){
        $query = "INSERT INTO " . $this->table_name . "
                  SET user_id=:user_id, title=:title, slug=:slug, content=:content, category_id=:category_id, status=:status, image_urls=:image_urls";
        
        $stmt = $this->conn->prepare($query);

        $this->user_id = htmlspecialchars(strip_tags($this->user_id ?? ''));
        $this->title = htmlspecialchars(strip_tags($this->title ?? ''));
        $this->content = $this->content; // Allow some HTML
        $this->category_id = htmlspecialchars(strip_tags($this->category_id ?? ''));
        $this->status = htmlspecialchars(strip_tags($this->status ?? 'draft'));
        $this->image_urls = htmlspecialchars(strip_tags($this->image_urls ?? ''));
        $this->slug = $this->generateUniqueSlug($this->title);

        $stmt->bindParam(':user_id', $this->user_id);
        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':content', $this->content);
        $stmt->bindParam(':category_id', $this->category_id);
        $stmt->bindParam(':status', $this->status);
        $stmt->bindParam(':slug', $this->slug);
        $stmt->bindParam(':image_urls', $this->image_urls);

        if($stmt->execute()){
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    // ฟังก์ชัน update นี้ถูกต้องแล้ว สามารถรับค่า image_urls ได้
    function update(){
        $query = "UPDATE " . $this->table_name . "
                  SET
                    title = :title,
                    slug = :slug,
                    content = :content,
                    category_id = :category_id,
                    status = :status,
                    image_urls = :image_urls
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id ?? ''));
        $this->title = htmlspecialchars(strip_tags($this->title ?? ''));
        $this->content = $this->content; // Allow some HTML
        $this->category_id = htmlspecialchars(strip_tags($this->category_id ?? ''));
        $this->status = htmlspecialchars(strip_tags($this->status ?? 'draft'));
        $this->image_urls = htmlspecialchars(strip_tags($this->image_urls ?? ''));
        $this->slug = $this->generateUniqueSlug($this->title, $this->id);

        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':content', $this->content);
        $stmt->bindParam(':category_id', $this->category_id);
        $stmt->bindParam(':status', $this->status);
        $stmt->bindParam(':slug', $this->slug);
        $stmt->bindParam(':image_urls', $this->image_urls);

        if($stmt->execute()){
            return true;
        }
        return false;
    }
    
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
