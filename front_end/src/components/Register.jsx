import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// ✅ 1. ตรวจสอบว่า API_BASE_URL ถูกต้อง
// ถ้า API อยู่ในโฟลเดอร์เดียวกันกับ Frontend ให้ใช้ "" (ค่าว่าง)
// ถ้า API อยู่ที่อื่น ให้ระบุ URL เต็ม
const API_BASE_URL = "/API";

//upload to server
// const API_BASE_URL = "https://student.crru.ac.th/661463026/BASIC-BLOG-API/API";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "รหัสผ่านไม่ตรงกัน!",
        text: "กรุณาตรวจสอบรหัสผ่านและยืนยันรหัสผ่านอีกครั้ง",
      });
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/Auth/register.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server responded with ${res.status}: ${errorText}`);
      }

      const data = await res.json();

      // ✅ 2. แก้ไขตรรกะการตรวจสอบผลลัพธ์ให้ตรงไปตรงมา
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "สมัครสมาชิกสำเร็จ!",
          text: "กำลังนำคุณไปที่หน้าเข้าสู่ระบบ...",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        }).then(() => {
          navigate("/login");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "สมัครสมาชิกไม่สำเร็จ!",
          text: data.message || "กรุณาลองใหม่อีกครั้ง",
        });
        setMessage("❌ " + data.message);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบ Console",
      });
      console.error("Registration Error:", err);
      setMessage("❌ เกิดข้อผิดพลาดในการเชื่อมต่อ: " + err.message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4">📝 Register</h2>
      <form onSubmit={handleRegister}>
        {/* ... (Form fields remain the same) ... */}
        <div className="mb-3">
                    <label className="form-label">Username</label>         {" "}
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
                 {" "}
        </div>
               {" "}
        <div className="mb-3">
                    <label className="form-label">Email</label>         {" "}
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
                 {" "}
        </div>
               {" "}
        <div className="mb-3">
          <label className="form-label">Password</label>         {" "}
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
                 {" "}
        </div>
               {" "}
        <div className="mb-3">
                    <label className="form-label">Confirm Password</label>     
             {" "}
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
                 {" "}
        </div>
        <button type="submit" className="btn btn-success w-100">
          สมัครสมาชิก
        </button>
      </form>
      {message && <p className="mt-3 text-center text-danger">{message}</p>}
      <p className="mt-3 text-center">
        มีบัญชีอยู่แล้ว? <Link to="/login">เข้าสู่ระบบที่นี่</Link>
      </p>
    </div>
  );
}


