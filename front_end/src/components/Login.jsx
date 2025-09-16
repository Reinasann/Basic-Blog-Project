import { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import Swal from 'sweetalert2'; // ✅ **จุดแก้ไขที่ 1:** Import SweetAlert2 เข้ามาโดยตรง

// ✅ จัดการ API URL และค่าคงที่ไว้ข้างนอกเพื่อความสะดวกในการแก้ไข
const API_BASE_URL = "/API";

//upload to server
// const API_BASE_URL = "https://student.crru.ac.th/661463026/BASIC-BLOG-API/API";


const GOOGLE_CLIENT_ID =
  "999410734026-sbb6u8aki157j80gl0b1gkolhtvj482g.apps.googleusercontent.com";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // 👉 Normal Login
  const handleNormalLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/Auth/normalLogin.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token || "");
        localStorage.setItem("username", data.username || email);
        localStorage.setItem("role", data.role || "user");
        localStorage.setItem("user_id", data.user_id);
        
        // ✅ **จุดแก้ไขที่ 2:** เรียกใช้ Swal ที่ import เข้ามา
        Swal.fire({
          icon: 'success',
          title: 'เข้าสู่ระบบสำเร็จ!',
          text: `ยินดีต้อนรับ, ${data.username || email}`,
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true
        }).then(() => {
          navigate("/");
        });

      } else {
        // ✅ **จุดแก้ไขที่ 3:** ใช้ Swal สำหรับแจ้งเตือน Error ด้วย
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด!',
          text: data.message
        });
        setMessage("❌ " + data.message); // ยังคงเก็บไว้เผื่อต้องการแสดงใน component
      }
    } catch (err) {
      Swal.fire({
          icon: 'error',
          title: 'Server Error!',
          text: err.message
      });
      setMessage("❌ Server error: " + err.message);
    }
  };

  // 👉 Google Login
  const handleGoogleLogin = async (credentialResponse) => {
    setMessage("");
    try {
      if (!credentialResponse?.credential) {
        setMessage("❌ ไม่ได้รับข้อมูลยืนยันตัวตนจาก Google");
        return;
      }
      const decoded = jwtDecode(credentialResponse.credential);
      const res = await fetch(`${API_BASE_URL}/Auth/googleLogin.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token || "");
        localStorage.setItem(
          "username",
          decoded.name || data.username
        );
        localStorage.setItem("role", data.role || "user");
        localStorage.setItem("user_id", data.user_id); 
        
        Swal.fire({
            icon: 'success',
            title: 'เข้าสู่ระบบสำเร็จ!',
            text: `ยินดีต้อนรับ, ${decoded.name || data.username}`,
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true
        }).then(() => {
            navigate("/");
        });

      } else {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด!',
          text: data.message
        });
        setMessage("❌ " + data.message);
      }
    } catch (err) {
      Swal.fire({
          icon: 'error',
          title: 'Google Login Error!',
          text: err.message
      });
      console.error("Google Login Error:", err);
      setMessage("❌ การเข้าสู่ระบบด้วย Google ล้มเหลว: " + err.message);
    }
  };

  const handleGoogleError = (error) => {
    console.error("Google Login Error Callback:", error);
    setMessage("❌ การเข้าสู่ระบบด้วย Google ล้มเหลว กรุณาลองใหม่อีกครั้ง");
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="container mt-5" style={{ maxWidth: "400px" }}>
        <h2 className="mb-4">🔑 Login</h2>

        <form onSubmit={handleNormalLogin}>
          <div className="mb-3">
            <label htmlFor="emailInput" className="form-label">Email</label>
            <input
              id="emailInput"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="passwordInput" className="form-label">Password</label>
            <input
              id="passwordInput"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        <hr className="my-4" />

        <div className="d-flex justify-content-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={handleGoogleError}
          />
        </div>

        {message && <p className="mt-3 text-center text-danger mt-3">{message}</p>}

        <p className="mt-3 text-center">
          ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิกที่นี่</Link>
        </p>
      </div>
    </GoogleOAuthProvider>
  );
}

