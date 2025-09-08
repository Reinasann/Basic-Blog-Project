import React, { useState, useEffect } from 'react';

// === Modal Wrapper (โครงสร้างหลักของ Modal) ===
const ModalWrapper = ({ title, children, onClose, onConfirm, confirmText, confirmClass = 'primary' }) => (
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <div className="modal-header border-b border-gray-200 dark:border-gray-700">
                    <h5 className="modal-title">{title}</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                </div>
                <div className="modal-body">{children}</div>
                <div className="modal-footer border-t border-gray-200 dark:border-gray-700">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>ยกเลิก</button>
                    <button type="button" className={`btn btn-${confirmClass}`} onClick={onConfirm}>{confirmText}</button>
                </div>
            </div>
        </div>
    </div>
);

// === User Modal (สำหรับ เพิ่ม/แก้ไข User) ===
export const UserModal = ({ mode, initialData, onClose, onSave }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        setFormData(initialData || {});
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const title = mode === 'add' ? 'เพิ่มผู้ใช้ใหม่' : 'แก้ไขผู้ใช้';

    return (
        <ModalWrapper title={title} onClose={onClose} onConfirm={() => onSave(formData)} confirmText="บันทึก">
            <form>
                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input type="text" className="form-control" name="username" value={formData.username || ''} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" name="email" value={formData.email || ''} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" name="password" placeholder={mode === 'edit' ? "ปล่อยว่างไว้ถ้าไม่ต้องการเปลี่ยน" : ""} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select className="form-select" name="role" value={formData.role || 'reader'} onChange={handleChange}>
                        <option value="reader">Reader</option>
                        <option value="author">Author</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </form>
        </ModalWrapper>
    );
};

// === Post Modal (สำหรับ เพิ่ม/แก้ไข Post) ===
export const PostModal = ({ mode, initialData, onClose, onSave, categories }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        setFormData(initialData || {});
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const title = mode === 'add' ? 'เพิ่มโพสต์ใหม่' : 'แก้ไขโพสต์';

    return (
        <ModalWrapper title={title} onClose={onClose} onConfirm={() => onSave(formData)} confirmText="บันทึก">
            <form>
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input type="text" className="form-control" name="title" value={formData.title || ''} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Content</label>
                    <textarea className="form-control" name="content" rows="4" value={formData.content || ''} onChange={handleChange}></textarea>
                </div>
                <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select className="form-select" name="category_id" value={formData.category_id || ''} onChange={handleChange}>
                        <option value="">-- เลือกหมวดหมู่ --</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select className="form-select" name="status" value={formData.status || 'draft'} onChange={handleChange}>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>
            </form>
        </ModalWrapper>
    );
};

// === Category Modal (สำหรับ เพิ่ม/แก้ไข Category) ===
export const CategoryModal = ({ mode, initialData, onClose, onSave }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        setFormData(initialData || {});
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const title = mode === 'add' ? 'เพิ่มหมวดหมู่ใหม่' : 'แก้ไขหมวดหมู่';

    return (
        <ModalWrapper title={title} onClose={onClose} onConfirm={() => onSave(formData)} confirmText="บันทึก">
            <form>
                <div className="mb-3">
                    <label className="form-label">Category Name</label>
                    <input type="text" className="form-control" name="name" value={formData.name || ''} onChange={handleChange} />
                </div>
            </form>
        </ModalWrapper>
    );
};


// === Confirm Delete Modal (สำหรับยืนยันการลบ) ===
export const ConfirmDeleteModal = ({ itemType, onClose, onConfirm }) => {
    return (
        <ModalWrapper 
            title={`ยืนยันการลบ ${itemType}`}
            onClose={onClose} 
            onConfirm={onConfirm} 
            confirmText="ยืนยัน"
            confirmClass="danger"
        >
            <p>คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้? การกระทำนี้ไม่สามารถย้อนกลับได้</p>
        </ModalWrapper>
    );
};

