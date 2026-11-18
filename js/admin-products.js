/**
 * admin-products.js - ระบบบริหารจัดการสินค้า (CRUD Operations) สำหรับผู้ดูแลระบบ
 */

document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.querySelector("#products-table tbody");
  const addModal = document.getElementById("add-modal");
  const deleteModal = document.getElementById("delete-modal");
  const productForm = document.getElementById("add-product-form");
  const modalTitle = document.querySelector("#add-modal .modal-header-title");

  const catFilter = document.querySelector(".admin-select-filter[aria-label='Category Filter']");
  const statusFilter = document.querySelector(".admin-select-filter[aria-label='Status Filter']");
  const searchInput = document.querySelector(".admin-search-box");

  // ส่วนจัดการอัปโหลดรูปภาพสินค้า
  const fileInput = document.getElementById("new-product-image");
  const imageUrlInput = document.getElementById("new-product-image-url");
  const uploadBox = document.getElementById("modal-upload-box");
  const uploadPrompt = document.getElementById("upload-prompt");
  const uploadPreview = document.getElementById("upload-preview");
  const previewImg = document.getElementById("preview-image");
  const previewFilename = document.getElementById("preview-filename");
  const btnRemoveImage = document.getElementById("btn-remove-image");

  let currentEditingId = null;
  let currentDeletingId = null;
  let currentImageDataUrl = null;

  // ฟังก์ชันแสดงตัวอย่างรูปภาพที่อัปโหลดหรือระบุผ่าน URL
  function setUploadPreview(src, label = "") {
    currentImageDataUrl = src;
    if (src && uploadPreview && previewImg) {
      previewImg.src = src;
      if (previewFilename) {
        if (label) {
          previewFilename.textContent = label;
        } else if (src.startsWith("data:")) {
          previewFilename.textContent = "Image selected";
        } else {
          previewFilename.textContent = src;
        }
      }
      if (uploadPrompt) uploadPrompt.style.display = "none";
      uploadPreview.style.display = "flex";
      if (imageUrlInput && !src.startsWith("data:")) {
        imageUrlInput.value = src;
      }
    } else {
      resetUploadPreview();
    }
  }

  // ฟังก์ชันล้างค่ารูปภาพ
  function resetUploadPreview() {
    currentImageDataUrl = null;
    if (fileInput) fileInput.value = "";
    if (imageUrlInput) imageUrlInput.value = "";
    if (previewImg) previewImg.src = "";
    if (previewFilename) previewFilename.textContent = "";
    if (uploadPrompt) uploadPrompt.style.display = "block";
    if (uploadPreview) uploadPreview.style.display = "none";
  }

  // Event เมื่อเลือกไฟล์รูปภาพ
  if (fileInput) {
    fileInput.addEventListener("change", function () {
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        showToast("กรุณาเลือกไฟล์รูปภาพเท่านั้น (PNG, JPG, WEBP, GIF)", "error");
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        setUploadPreview(e.target.result, file.name);
        showToast("เลือกรูปภาพสินค้าสำเร็จ", "success");
      };
      reader.onerror = function () {
        showToast("เกิดข้อผิดพลาดในการอ่านรูปภาพ", "error");
      };
      reader.readAsDataURL(file);
    });
  }

  // Event คลิกกล่อง Upload Box เพื่อเปิดหน้าต่างเลือกไฟล์
  if (uploadBox && fileInput) {
    uploadBox.addEventListener("click", function (e) {
      if (e.target && (e.target.id === "btn-remove-image" || e.target.closest("#btn-remove-image"))) {
        return;
      }
      fileInput.click();
    });
  }

  if (imageUrlInput) {
    imageUrlInput.addEventListener("input", function () {
      const val = imageUrlInput.value.trim();
      if (val) {
        currentImageDataUrl = val;
        if (uploadPreview && previewImg) {
          previewImg.src = val;
          if (previewFilename) previewFilename.textContent = val;
          if (uploadPrompt) uploadPrompt.style.display = "none";
          uploadPreview.style.display = "flex";
        }
      } else {
        resetUploadPreview();
      }
    });
  }

  if (btnRemoveImage) {
    btnRemoveImage.addEventListener("click", function (e) {
      e.stopPropagation();
      resetUploadPreview();
      showToast("ยกเลิกการเลือกรูปภาพแล้ว", "info");
    });
  }

  // ฟังก์ชันแสดงรายการสินค้าในตาราง
  function renderTable(products) {
    if (!tableBody) return;
    tableBody.innerHTML = "";

    if (!products || products.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px; color: #333333; font-weight: 500;">
            ไม่พบข้อมูลสินค้าในระบบ
          </td>
        </tr>
      `;
      return;
    }

    products.forEach((p) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <img src="${p.image}" alt="${p.name}" class="table-thumb">
        </td>
        <td>${p.id}</td>
        <td>
          <span class="table-row-name">${p.name}</span>
          <span class="table-row-desc">${p.description}</span>
        </td>
        <td>${p.category}</td>
        <td>
          <span class="status-badge-text">${p.status}</span>
          <span style="display: block; font-size: 11px; color: #737373; margin-top: 2px;">สต็อก: ${p.stock !== undefined ? p.stock : 10} ชิ้น</span>
        </td>
        <td>${Number(p.price).toFixed(2)}</td>
        <td>
          <div class="table-action-stack">
            <button type="button" class="btn-row-edit" data-id="${p.id}">EDIT</button>
            <button type="button" class="btn-row-delete" data-id="${p.id}">DELETE</button>
          </div>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    tableBody.querySelectorAll(".btn-row-edit").forEach((btn) => {
      btn.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        openEditProduct(id);
      });
    });

    tableBody.querySelectorAll(".btn-row-delete").forEach((btn) => {
      btn.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        openDeleteProduct(id);
      });
    });
  }

  // ฟังก์ชันกรองตารางตาม Controls Bar
  async function filterTable() {
    const cat = catFilter ? catFilter.value.trim() : "";
    const status = statusFilter ? statusFilter.value.trim() : "";
    const query = searchInput ? searchInput.value.trim() : "";

    const apiResults = await ApiService.getProducts({
      name: query,
      category: cat,
      status: status
    });
    if (apiResults !== null) {
      renderTable(apiResults);
    } else {
      renderTable([]);
      showToast("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ฐานข้อมูลได้", "error");
    }
  }

  if (catFilter) catFilter.addEventListener("change", filterTable);
  if (statusFilter) statusFilter.addEventListener("change", filterTable);
  if (searchInput) searchInput.addEventListener("input", filterTable);

  // เปิด Modal เพิ่มสินค้าใหม่
  window.openAddModal = function () {
    currentEditingId = null;
    if (modalTitle) modalTitle.textContent = "Add New Product";
    if (productForm) {
      productForm.reset();
      const idInput = document.getElementById("new-product-id");
      if (idInput) idInput.removeAttribute("readonly");
      const stockInput = document.getElementById("new-product-stock");
      if (stockInput) stockInput.value = "10";
    }
    resetUploadPreview();
    if (addModal) addModal.classList.add("active");
  };

  window.closeAddModal = function () {
    if (addModal) addModal.classList.remove("active");
    currentEditingId = null;
    resetUploadPreview();
  };

  const btnAdd = document.querySelector(".btn-add-action");
  if (btnAdd) btnAdd.addEventListener("click", window.openAddModal);

  const btnCancelAdd = document.querySelector("#add-modal .btn-modal-cancel");
  if (btnCancelAdd) btnCancelAdd.addEventListener("click", window.closeAddModal);

  const btnCancelDelete = document.querySelector("#delete-modal .btn-modal-cancel");
  if (btnCancelDelete) btnCancelDelete.addEventListener("click", window.closeDeleteModal);

  // เปิด Modal แก้ไขสินค้า
  async function openEditProduct(id) {
    const product = await ApiService.getProductById(id);
    if (!product) {
      showToast("ไม่พบข้อมูลสินค้า", "error");
      return;
    }

    currentEditingId = id;
    if (modalTitle) modalTitle.textContent = `Edit Product (${id})`;

    const idInput = document.getElementById("new-product-id");
    const nameInput = document.getElementById("new-product-name");
    const catInput = document.getElementById("new-product-cat");
    const priceInput = document.getElementById("new-product-price");
    const statusInput = document.getElementById("new-product-status");
    const descInput = document.getElementById("new-product-desc");

    if (idInput) {
      idInput.value = product.id;
      idInput.setAttribute("readonly", true);
    }
    if (nameInput) nameInput.value = product.name;
    if (catInput) catInput.value = product.category;
    if (priceInput) priceInput.value = product.price;
    if (statusInput) statusInput.value = product.status;
    if (descInput) descInput.value = product.description;

    const refInput = document.getElementById("new-product-ref");
    if (refInput) refInput.value = product.reference;

    const stockInput = document.getElementById("new-product-stock");
    if (stockInput) stockInput.value = (product.stock !== undefined) ? product.stock : 10;

    if (product.image) {
      setUploadPreview(product.image, product.name);
    } else {
      resetUploadPreview();
    }

    if (addModal) addModal.classList.add("active");
  }

  // เปิด Modal ยืนยันการลบสินค้า
  async function openDeleteProduct(id) {
    const product = await ApiService.getProductById(id);
    if (!product) {
      showToast("ไม่พบข้อมูลสินค้า", "error");
      return;
    }

    currentDeletingId = id;

    const summaryBox = document.getElementById("delete-product-summary");
    if (summaryBox) {
      summaryBox.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div>
          <p style="color: var(--color-dark); font-weight: 600;">Product ID: ${product.id}</p>
          <p style="color: var(--color-dark-grey); font-size: 14px;">Name: ${product.name}</p>
          <p style="color: var(--color-muted-grey); font-size: 13px;">Status: ${product.status} | Price: ${Number(product.price).toFixed(2)} THB</p>
        </div>
      `;
    }

    if (deleteModal) deleteModal.classList.add("active");
  }

  window.closeDeleteModal = function () {
    if (deleteModal) deleteModal.classList.remove("active");
    currentDeletingId = null;
  };

  // จัดการฟอร์มบันทึกสินค้า (เพิ่ม / แก้ไข)
  if (productForm) {
    productForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const id = document.getElementById("new-product-id").value.trim().toUpperCase();
      const name = document.getElementById("new-product-name").value.trim();
      const category = document.getElementById("new-product-cat").value;
      const price = parseFloat(document.getElementById("new-product-price").value);
      const status = document.getElementById("new-product-status").value;
      const stockVal = document.getElementById("new-product-stock") ? parseInt(document.getElementById("new-product-stock").value, 10) : 10;
      const stock = isNaN(stockVal) || stockVal < 0 ? 0 : stockVal;
      const description = document.getElementById("new-product-desc").value.trim();
      const refInput = document.getElementById("new-product-ref");
      const reference = refInput ? refInput.value.trim() : "";

      if (!id || !name || !category || isNaN(price) || price <= 0 || !status) {
        showToast("กรุณากรอกข้อมูลสินค้าให้ครบถ้วนและถูกต้อง", "error");
        return;
      }

      let imageToSave = "";
      if (currentImageDataUrl) {
        imageToSave = currentImageDataUrl;
      } else if (imageUrlInput && imageUrlInput.value.trim()) {
        imageToSave = imageUrlInput.value.trim();
      }

      if (!imageToSave && currentEditingId) {
        const prev = await ApiService.getProductById(currentEditingId);
        if (prev && prev.image) imageToSave = prev.image;
      }

      if (currentEditingId) {
        // อัปเดตสินค้าผ่าน Web Service
        const res = await ApiService.updateProduct(currentEditingId, {
          name,
          category,
          price,
          status,
          stock,
          description,
          image: imageToSave,
          reference: reference
        });
        if (res && res.success) {
          showToast(`อัปเดตข้อมูลสินค้า ${id} เรียบร้อยแล้ว`, "success");
        } else {
          showToast((res && res.message) || "ไม่สามารถอัปเดตข้อมูลสินค้าได้", "error");
          return;
        }
      } else {
        // เพิ่มสินค้าใหม่ผ่าน Web Service
        const res = await ApiService.addProduct({
          id,
          name,
          category,
          price,
          status,
          stock,
          description: description,
          image: imageToSave,
          reference: reference
        });
        if (res && res.success) {
          showToast(`บันทึกสินค้า ${id} (${name}) เรียบร้อยแล้ว`, "success");
        } else {
          showToast((res && res.message) || `รหัสสินค้า '${id}' มีอยู่ในระบบแล้ว`, "error");
          return;
        }
      }

      closeAddModal();
      filterTable();
    });
  }

  // ปุ่มยืนยันลบสินค้าใน Delete Modal
  const btnConfirmDelete = document.querySelector("#delete-modal .btn-modal-delete");
  if (btnConfirmDelete) {
    btnConfirmDelete.onclick = async function () {
      if (currentDeletingId) {
        const res = await ApiService.deleteProduct(currentDeletingId);
        if (res && res.success) {
          showToast(`ลบสินค้า ${currentDeletingId} ออกจากระบบเรียบร้อย`, "success");
        } else {
          showToast((res && res.message) || "ไม่สามารถลบสินค้าได้", "error");
        }
        closeDeleteModal();
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
