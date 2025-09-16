import React, { useState, useEffect } from 'react';

// === Modal Wrapper (โครงสร้างหลักของ Modal) ===
const ModalFormWrapper = ({ title, children, onClose, onSubmit, confirmText, confirmClass = 'primary', isUploading = false }) => (
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
                <form onSubmit={onSubmit}>
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" onClick={onClose} disabled={isUploading}></button>
                    </div>
                    <div className="modal-body">{children}</div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isUploading}>ยกเลิก</button>
                        <button type="submit" className={`btn btn-${confirmClass}`} disabled={isUploading}>
                            {isUploading ? <><span className="spinner-border spinner-border-sm me-2"></span>กำลังบันทึก...</> : confirmText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
);

// === User Modal (สำหรับ เพิ่ม/แก้ไข User) ===
export const UserModal = ({ mode, initialData, onClose, onSave }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        setFormData(initialData || { username: '', email: '', role: 'reader' });
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave('user', formData);
    };

    const title = mode === 'add' ? 'เพิ่มผู้ใช้ใหม่' : 'แก้ไขผู้ใช้';

    return (
        <ModalFormWrapper title={title} onClose={onClose} onSubmit={handleSubmit} confirmText="บันทึก">
            <div className="mb-3">
                <label className="form-label">Username</label>
                <input type="text" className="form-control" name="username" value={formData.username || ''} onChange={handleChange} required/>
            </div>
            <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" name="email" value={formData.email || ''} onChange={handleChange} required/>
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
        </ModalFormWrapper>
    );
};

// === Post Modal (สำหรับ เพิ่ม/แก้ไข Post) - UPGRADED ===
export const PostModal = ({ mode, initialData, onClose, onSave, categories, images, onFileChange, onRemoveImage, onDragStart, onDragEnter, onDrop, isUploading }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        setFormData(initialData || { title: '', content: '', category_id: '', status: 'draft' });
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave('post', formData);
    };

    const title = mode === 'add' ? 'เพิ่มโพสต์ใหม่' : 'แก้ไขโพสต์';

    return (
        <ModalFormWrapper title={title} onClose={onClose} onSubmit={handleSubmit} confirmText="บันทึก" isUploading={isUploading}>
            <div className="mb-3">
                <label className="form-label">Title</label>
                <input type="text" className="form-control" name="title" value={formData.title || ''} onChange={handleChange} required/>
            </div>
            <div className="mb-3">
                <label className="form-label">Content</label>
                <textarea className="form-control" name="content" rows="4" value={formData.content || ''} onChange={handleChange}></textarea>
            </div>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Category</label>
                    <select className="form-select" name="category_id" value={formData.category_id || ''} onChange={handleChange} required>
                        <option value="">-- เลือกหมวดหมู่ --</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Status</label>
                    <select className="form-select" name="status" value={formData.status || 'draft'} onChange={handleChange}>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>
            </div>
            <div className="mb-3">
                <label className="form-label">รูปภาพ</label>
                <input type="file" multiple className="form-control" onChange={onFileChange} accept="image/*" />
            </div>
            {images.length > 0 && (
                <div className="d-flex flex-wrap gap-2 border p-2 rounded bg-body-tertiary">
                    {images.map((image, index) => (
                        <div key={image.id} className="position-relative" style={{ width: '100px', height: '100px', cursor: 'grab' }} draggable onDragStart={(e) => onDragStart(e, index)} onDragEnter={(e) => onDragEnter(e, index)} onDragEnd={onDrop} onDragOver={(e) => e.preventDefault()}>
                            <img src={image.url} alt={`preview ${index}`} className="img-thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button type="button" className="btn btn-sm btn-danger rounded-circle position-absolute top-0 end-0" style={{ transform: 'translate(50%, -50%)' }} onClick={() => onRemoveImage(image.id)}>&times;</button>
                        </div>
                    ))}
                </div>
            )}
        </ModalFormWrapper>
    );
};


// === Category Modal (สำหรับ เพิ่ม/แก้ไข Category) ===
export const CategoryModal = ({ mode, initialData, onClose, onSave }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        setFormData(initialData || { name: '' });
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave('category', formData);
    };
    
    const title = mode === 'add' ? 'เพิ่มหมวดหมู่ใหม่' : 'แก้ไขหมวดหมู่';

    return (
        <ModalFormWrapper title={title} onClose={onClose} onSubmit={handleSubmit} confirmText="บันทึก">
            <div className="mb-3">
                <label className="form-label">Category Name</label>
                <input type="text" className="form-control" name="name" value={formData.name || ''} onChange={handleChange} required/>
            </div>
        </ModalFormWrapper>
    );
};

// === Confirm Delete Modal (สำหรับยืนยันการลบ) ===
export const ConfirmDeleteModal = ({ itemType, onClose, onConfirm }) => {
    return (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">ยืนยันการลบ {itemType}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <p>คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้? การกระทำนี้ไม่สามารถย้อนกลับได้</p>
                        {itemType === 'post' && <p className="text-danger fw-bold"><small>การดำเนินการนี้จะลบไฟล์รูปภาพทั้งหมดที่เกี่ยวข้องอย่างถาวร</small></p>}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>ยกเลิก</button>
                        <button type="button" className="btn btn-danger" onClick={onConfirm}>ยืนยันการลบ</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

