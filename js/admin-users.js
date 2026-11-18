/**
 * admin-users.js - ระบบบริหารจัดการบัญชีผู้ดูแลระบบ (User Management)
 */

document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.querySelector("#users-table tbody");
  const addUserModal = document.getElementById("add-user-modal");
  const deleteUserModal = document.getElementById("delete-user-modal");
  const userForm = document.getElementById("add-user-form");
  const modalTitle = document.querySelector("#add-user-modal .modal-header-title");

  const roleFilter = document.querySelector(".admin-select-filter[aria-label='Role Filter']");
  const searchInput = document.querySelector(".admin-search-box");

  let currentEditingUser = null;
  let currentDeletingUser = null;

  // ฟังก์ชันแสดงตารางบัญชีผู้ดูแลระบบ
  function renderTable(users) {
    if (!tableBody) return;
    tableBody.innerHTML = "";

    if (!users || users.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 40px; color: #333333; font-weight: 500;">
            ไม่พบบัญชีผู้ดูแลระบบ
          </td>
        </tr>
      `;
      return;
    }

    users.forEach((u) => {
      const tr = document.createElement("tr");
      const firstName = u.firstName;
      const lastName = u.lastName;
      tr.innerHTML = `
        <td>${u.username}</td>
        <td>${firstName} ${lastName}</td>
        <td class="user-email-cell">${u.email}</td>
        <td>${u.role}</td>
        <td>
          <div class="table-action-stack">
            <button type="button" class="btn-row-edit" data-user="${u.username}">EDIT</button>
            <button type="button" class="btn-row-delete" data-user="${u.username}">DELETE</button>
          </div>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    tableBody.querySelectorAll(".btn-row-edit").forEach((btn) => {
      btn.addEventListener("click", function () {
        const user = this.getAttribute("data-user");
        openEditUser(user);
      });
    });

    tableBody.querySelectorAll(".btn-row-delete").forEach((btn) => {
      btn.addEventListener("click", function () {
        const user = this.getAttribute("data-user");
        openDeleteUser(user);
      });
    });
  }

  // ฟังก์ชันกรองข้อมูลในตาราง
  async function filterTable() {
    const role = roleFilter ? roleFilter.value.trim() : "";
    const query = searchInput ? searchInput.value.trim() : "";

    const apiResults = await ApiService.getUsers({ role, search: query });
    if (apiResults !== null) {
      renderTable(apiResults);
    } else {
      renderTable([]);
      showToast("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ฐานข้อมูลได้", "error");
    }
  }

  if (roleFilter) roleFilter.addEventListener("change", filterTable);
  if (searchInput) searchInput.addEventListener("input", filterTable);

  // เปิด Modal เพิ่มผู้ใช้ใหม่
  window.openAddUserModal = function () {
    currentEditingUser = null;
    if (modalTitle) modalTitle.textContent = "Add New Admin Account";
    const saveBtn = document.querySelector("#add-user-modal .btn-modal-save");
    if (saveBtn) saveBtn.textContent = "Create Account";
    if (userForm) {
      userForm.reset();
      const userInput = document.getElementById("new-admin-user");
      if (userInput) userInput.removeAttribute("readonly");
      const pwdInput = document.getElementById("new-admin-pwd");
      if (pwdInput) {
        pwdInput.setAttribute("required", "true");
        pwdInput.placeholder = "Enter password...";
      }
    }
    if (addUserModal) addUserModal.classList.add("active");
  };

  window.closeAddUserModal = function () {
    if (addUserModal) addUserModal.classList.remove("active");
    currentEditingUser = null;
  };

  const btnAddUser = document.querySelector(".btn-add-action");
  if (btnAddUser) btnAddUser.addEventListener("click", window.openAddUserModal);

  const btnCancelAddUser = document.querySelector("#add-user-modal .btn-modal-cancel");
  if (btnCancelAddUser) btnCancelAddUser.addEventListener("click", window.closeAddUserModal);

  const btnCancelDeleteUser = document.querySelector("#delete-user-modal .btn-modal-cancel");
  if (btnCancelDeleteUser) btnCancelDeleteUser.addEventListener("click", window.closeDeleteUserModal);

  // เปิด Modal แก้ไขผู้ใช้
  async function openEditUser(username) {
    const user = await ApiService.getUserByUsername(username);
    if (!user) {
      showToast("ไม่พบข้อมูลผู้ใช้", "error");
      return;
    }

    currentEditingUser = username;
    if (modalTitle) modalTitle.textContent = `Edit Admin Account (${username})`;
    const saveBtn = document.querySelector("#add-user-modal .btn-modal-save");
    if (saveBtn) saveBtn.textContent = "Save Changes";

    const userInput = document.getElementById("new-admin-user");
    const pwdInput = document.getElementById("new-admin-pwd");
    const fnameInput = document.getElementById("new-admin-fname");
    const lnameInput = document.getElementById("new-admin-lname");
    const emailInput = document.getElementById("new-admin-email");
    const roleInput = document.getElementById("new-admin-role");

    if (userInput) {
      userInput.value = user.username;
      userInput.setAttribute("readonly", true);
    }
    if (pwdInput) {
      pwdInput.value = "••••••••";
      pwdInput.removeAttribute("required");
      pwdInput.placeholder = "Leave unchanged to keep password";
    }
    if (fnameInput) fnameInput.value = user.firstName;
    if (lnameInput) lnameInput.value = user.lastName;
    if (emailInput) emailInput.value = user.email;
    if (roleInput) roleInput.value = user.role;

    if (addUserModal) addUserModal.classList.add("active");
  }

  // เปิด Modal ยืนยันการลบผู้ใช้
  async function openDeleteUser(username) {
    const user = await ApiService.getUserByUsername(username);
    if (!user) {
      showToast("ไม่พบข้อมูลผู้ใช้", "error");
      return;
    }

    currentDeletingUser = username;

    const summaryBox = document.getElementById("delete-user-summary");
    if (summaryBox) {
      const fName = user.firstName;
      const lName = user.lastName;
      const initial = user.username.charAt(0).toUpperCase();
      summaryBox.innerHTML = `
        <div class="user-avatar-badge">${initial}</div>
        <div style="flex: 1;">
          <p style="color: #ffffff; font-weight: 600; font-size: 15px; margin: 0 0 4px 0;">Username: ${user.username}</p>
          <p style="color: #cccccc; font-size: 14px; margin: 0 0 4px 0;">Name: ${fName} ${lName}</p>
          <p style="color: #999999; font-size: 13px; margin: 0;">Email: ${user.email} | Role: ${user.role}</p>
        </div>
      `;
    }

    if (deleteUserModal) deleteUserModal.classList.add("active");
  }

  window.closeDeleteUserModal = function () {
    if (deleteUserModal) deleteUserModal.classList.remove("active");
    currentDeletingUser = null;
  };

  // จัดการฟอร์มบันทึกผู้ใช้ (เพิ่ม / แก้ไข)
  if (userForm) {
    userForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const username = document.getElementById("new-admin-user").value.trim();
      const pwd = document.getElementById("new-admin-pwd").value;
      const firstName = document.getElementById("new-admin-fname").value.trim();
      const lastName = document.getElementById("new-admin-lname").value.trim();
      const email = document.getElementById("new-admin-email").value.trim();
      const role = document.getElementById("new-admin-role").value;

      if (!username || !firstName || !lastName || !email || !role) {
        showToast("กรุณากรอกข้อมูลบัญชีให้ครบถ้วน", "error");
        return;
      }

      if (currentEditingUser) {
        // อัปเดตผ่าน Web Service
        const updateData = {
          firstName,
          lastName,
          email,
          role
        };
        if (pwd && pwd !== "••••••••") {
          updateData.password = pwd;
        }

        const res = await ApiService.updateUser(currentEditingUser, updateData);
        if (res && !res.success) {
          showToast(res.message || "ไม่สามารถอัปเดตข้อมูลผู้ใช้ได้", "error");
          return;
        }
        showToast(`อัปเดตข้อมูลผู้ใช้ ${username} เรียบร้อยแล้ว`, "success");
      } else {
        // เพิ่มผู้ใช้ผ่าน Web Service
        const res = await ApiService.addUser({
          username,
          password: pwd,
          firstName,
          lastName,
          email,
          role
        });
        if (res && !res.success) {
          showToast(res.message || "ชื่อผู้ใช้งานนี้มีอยู่ในระบบแล้ว", "error");
          return;
        }
        showToast(`สร้างบัญชีผู้ดูแลระบบ ${username} เรียบร้อยแล้ว`, "success");
      }

      closeAddUserModal();
      filterTable();
    });
  }

  // ปุ่มยืนยันลบใน Delete User Modal
  const btnConfirmDeleteUser = document.querySelector("#delete-user-modal .btn-modal-delete");
  if (btnConfirmDeleteUser) {
    btnConfirmDeleteUser.onclick = async function () {
      if (currentDeletingUser) {
        const res = await ApiService.deleteUser(currentDeletingUser);
        if (res && !res.success) {
          showToast(res.message || `ไม่สามารถลบบัญชีผู้ใช้ ${currentDeletingUser} ได้`, "error");
          return;
        }
        showToast(`ลบบัญชีผู้ใช้ ${currentDeletingUser} ออกจากระบบเรียบร้อย`, "success");
        closeDeleteUserModal();
        filterTable();
      }
    };
  }

  // จัดการข้อมูลเซสชันและปุ่มออกจากระบบ
  function initAdminSession() {
    const sessionStr = sessionStorage.getItem("arttoy_admin_session");
    const roleElem = document.getElementById("admin-user-role");
    const nameElem = document.getElementById("admin-user-name");
    const logoutBtn = document.getElementById("btn-admin-logout");

    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (roleElem && session.role) roleElem.textContent = session.role;
        if (nameElem && session.name) nameElem.textContent = session.name;
      } catch (e) {}
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        sessionStorage.removeItem("arttoy_admin_session");
        showToast("ออกจากระบบเรียบร้อยแล้ว", "success");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 500);
      });
    }
  }

  initAdminSession();

  // เริ่มต้นโหลดตาราง
  filterTable();
});
