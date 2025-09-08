import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; // ✅ 1. Import SweetAlert2

// ใช้ API URL เดียวกับหน้า Login
const API_BASE_URL = "/API";

//upload to server
// const API_BASE_URL = "http://student.crru.ac.th/661463026/BASIC-BLOG-API/API";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // State สำหรับแสดงข้อความ (ยังคงเก็บไว้เป็น fallback)
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // 👉 ฟังก์ชันสำหรับส่งข้อมูลการสมัครสมาชิก (ฉบับแก้ไข)
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage(""); // เคลียร์ข้อความเก่า

    // 1. ตรวจสอบรหัสผ่านว่าตรงกันหรือไม่
    if (password !== confirmPassword) {
      // ✅ 2. ใช้ Swal แจ้งเตือน
      Swal.fire({
        icon: 'error',
        title: 'รหัสผ่านไม่ตรงกัน!',
        text: 'กรุณาตรวจสอบรหัสผ่านและยืนยันรหัสผ่านอีกครั้ง'
      });
      return;
    }

    try {
      // 2. ส่งข้อมูลไปที่ Backend
      const res = await fetch(`${API_BASE_URL}/Auth/register.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      // ✅ **จุดแก้ไข:** ตรวจสอบผลลัพธ์ให้แม่นยำขึ้น
      // บางครั้ง API อาจส่ง `success: false` แต่ message เป็นข้อความที่สำเร็จ
      const isSuccess = data.success === true || (data.message && data.message.toLowerCase().includes('success'));

      if (isSuccess) {
        // ✅ 3. ใช้ Swal แจ้งเตือนเมื่อสำเร็จ
        Swal.fire({
          icon: 'success',
          title: 'สมัครสมาชิกสำเร็จ!',
          text: 'กำลังนำคุณไปที่หน้าเข้าสู่ระบบ...',
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true
        }).then(() => {
          navigate("/login");
        });

      } else {
        // ✅ 4. ใช้ Swal แจ้งเตือนเมื่อเกิดข้อผิดพลาดจาก API
        Swal.fire({
          icon: 'error',
          title: 'สมัครสมาชิกไม่สำเร็จ!',
          text: data.message || 'กรุณาลองใหม่อีกครั้ง'
        });
        setMessage("❌ " + data.message);
      }
    } catch (err) {
      // ✅ 5. ใช้ Swal แจ้งเตือนเมื่อเกิดข้อผิดพลาดในการเชื่อมต่อ
      Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาดในการเชื่อมต่อ!',
          text: err.message
      });
      setMessage("❌ เกิดข้อผิดพลาดในการเชื่อมต่อ: " + err.message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4">📝 Register</h2>

      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-success w-100">
          สมัครสมาชิก
        </button>
      </form>

      {/* แสดงข้อความ Error หรือ Success (ยังคงไว้เป็นทางเลือก) */}
      {message && (
        <p className={`mt-3 text-center text-danger`}>{message}</p>
      )}

      {/* ลิงก์สำหรับกลับไปหน้า Login */}
      <p className="mt-3 text-center">
        มีบัญชีอยู่แล้ว? <Link to="/login">เข้าสู่ระบบที่นี่</Link>
      </p>
    </div>
  );
}

