/**
 * login.js - ระบบตรวจสอบความถูกต้องและเข้าสู่ระบบของผู้ดูแลระบบ (Admin Authentication)
 */

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form-box");
  const usernameInput = document.getElementById("admin-username");
  const passwordInput = document.getElementById("admin-password");

  // ตรวจสอบข้อความแจ้งเตือนกรณีถูก Redirect มาจากหน้า Admin ที่ไม่มีสิทธิ์เข้าถึง
  const redirectNotice = sessionStorage.getItem("login_redirect_notice");
  if (redirectNotice) {
    sessionStorage.removeItem("login_redirect_notice");
    setTimeout(() => {
      showToast(redirectNotice, "error");
    }, 150);
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      if (!username || !password) {
        if (!username) usernameInput.focus();
        else if (!password) passwordInput.focus();
        showToast("กรุณากรอก Username และ Password ให้ครบถ้วน", "error");
        return;
      }

      // เรียกใช้งาน Web Service Authentication API
      const result = await ApiService.login(username, password);
      if (result && result.success) {
        sessionStorage.setItem("arttoy_admin_session", JSON.stringify({
          username: result.user.username,
          name: `${result.user.firstName} ${result.user.lastName}`,
          role: result.user.role,
          loginTime: new Date().toISOString()
        }));
        showToast("เข้าสู่ระบบสำเร็จ กำลังนำเข้าสู่หน้าผู้ดูแลระบบ...", "success");

        // ตรวจสอบหน้าปลายทางที่ต้องการ Redirect (default: admin-products.html)
        const urlParams = new URLSearchParams(window.location.search);
        const targetPage = urlParams.get("redirect") || "admin-products.html";

        setTimeout(() => {
          window.location.href = targetPage;
        }, 800);
      } else {
        showToast((result && result.message) || "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง หรือไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้", "error");
        passwordInput.focus();
      }
    });
  }
});
