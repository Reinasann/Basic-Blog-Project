<?php
class Comment
{
    private $conn;
    private $table_name = "comments";

    public $id;
    public $post_id;
    public $user_id;
    public $content;
    public $created_at;
    public $updated_at;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // 📌 อ่าน comments ทั้งหมด
    public function read()
    {
        $query = "SELECT c.id, c.post_id, c.user_id, c.content, c.created_at, c.updated_at,
                         u.username, p.title AS post_title
                  FROM " . $this->table_name . " c
                  JOIN users u ON c.user_id = u.id
                  JOIN posts p ON c.post_id = p.id
                  ORDER BY c.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // 📌 อ่าน comments ของโพสต์เดียว
    public function readByPost($post_id)
    {
        $query = "SELECT c.id, c.post_id, c.user_id, c.content, c.created_at, c.updated_at,
                         u.username, p.title AS post_title
                  FROM " . $this->table_name . " c
                  JOIN users u ON c.user_id = u.id
                  JOIN posts p ON c.post_id = p.id
                  WHERE c.post_id = :post_id
                  ORDER BY c.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":post_id", $post_id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt;
    }

    // 📌 อ่าน comment เดียวตาม id
    public function read_one()
    {
        $query = "SELECT c.id, c.post_id, c.user_id, c.content, c.created_at, c.updated_at,
                         u.username, p.title AS post_title
                  FROM " . $this->table_name . " c
                  JOIN users u ON c.user_id = u.id
                  JOIN posts p ON c.post_id = p.id
                  WHERE c.id = :id LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id, PDO::PARAM_INT);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->post_id    = $row['post_id'];
            $this->user_id    = $row['user_id'];
            $this->content    = $row['content'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
        }
    }

    // 📌 สร้าง comment
    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
              (post_id, user_id, content, created_at)
              VALUES (:post_id, :user_id, :content, NOW())";

        $stmt = $this->conn->prepare($query);

        $this->post_id = htmlspecialchars(strip_tags($this->post_id));
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));
        $this->content = htmlspecialchars(strip_tags($this->content));

        $stmt->bindParam(":post_id", $this->post_id, PDO::PARAM_INT);
        $stmt->bindParam(":user_id", $this->user_id, PDO::PARAM_INT);
        $stmt->bindParam(":content", $this->content);

        if ($stmt->execute()) {
            return true;
        } else {
            error_log(print_r($stmt->errorInfo(), true)); // log error DB
            return false;
        }

    }

    // 📌 อัปเดต comment
    public function update()
    {
        $query = "UPDATE " . $this->table_name . "
                  SET content = :content, updated_at = NOW()
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $this->content = htmlspecialchars(strip_tags($this->content));
        $this->id      = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(":content", $this->content);
        $stmt->bindParam(":id", $this->id, PDO::PARAM_INT);

        return $stmt->execute();
    }

    // 📌 ลบ comment
    public function delete()
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";

        $stmt     = $this->conn->prepare($query);
        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(":id", $this->id, PDO::PARAM_INT);

        return $stmt->execute();
    }
}
