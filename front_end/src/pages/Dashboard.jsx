import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { UserModal, PostModal, CategoryModal, ConfirmDeleteModal } from '../components/Modals'; // ✅ 1. แก้ไข Path การ import

// (Icons component remains the same)
const Icons = {
    Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    Posts: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4"/><path d="M18 18H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h13v14Z"/><path d="M8 6h8"/><path d="M8 10h8"/><path d="M8 14h4"/></svg>,
    Categories: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="8"/><path d="M12 2v6"/><path d="M12 8H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-6Z"/><path d="M6 14h12"/></svg>,
    Edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>,
    Delete: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>,
    Sun: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>,
    Moon: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>,
};


export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("users");
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [modal, setModal] = useState({ type: null, mode: null, data: null });

    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    const userId = localStorage.getItem("user_id");
    const API_BASE_URL = "/API";

    //upload to server
    // const API_BASE_URL = "http://student.crru.ac.th/661463026/BASIC-BLOG-API/API";

    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const fetchData = useCallback(async () => {
        if (role !== "admin") {
            navigate("/");
            return;
        }
        setLoading(true);
        try {
            const [usersRes, postsRes, categoriesRes] = await Promise.all([
                fetch(`${API_BASE_URL}/Users/read.php`),
                fetch(`${API_BASE_URL}/Posts/read.php`),
                fetch(`${API_BASE_URL}/Categories/read.php`),
            ]);
            const usersData = await usersRes.json();
            const postsData = await postsRes.json();
            const categoriesData = await categoriesRes.json();
            setUsers(usersData.records || []);
            setPosts(postsData.records || []);
            setCategories(categoriesData.records || []);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, [role, navigate, API_BASE_URL]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenModal = (type, mode, data = null) => {
        setModal({ type, mode, data });
    };

    const handleCloseModal = () => {
        setModal({ type: null, mode: null, data: null });
    };

    const handleSave = async (type, formData) => {
        const mode = formData.id ? 'update' : 'create';
        
        // ✅ 2. แก้ไข Logic การสร้าง Endpoint ให้ถูกต้อง
        const getFolderName = (type) => {
            if (type === 'category') return 'Categories';
            return `${type.charAt(0).toUpperCase() + type.slice(1)}s`;
        }
        const endpoint = `${API_BASE_URL}/${getFolderName(type)}/${mode}.php`;

        if (type === 'post' && mode === 'create') {
            if (!userId) {
                Swal.fire('Error', 'ไม่พบ User ID ของผู้สร้างโพสต์', 'error');
                return;
            }
            formData.user_id = userId;
        }

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
             if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Server responded with ${res.status}: ${errorText}`);
            }
            const result = await res.json();
            if (result.success) {
                handleCloseModal();
                await fetchData();
                Swal.fire({
                    icon: 'success',
                    title: 'บันทึกสำเร็จ!',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                 Swal.fire('เกิดข้อผิดพลาด!', result.message || 'ไม่สามารถบันทึกข้อมูลได้', 'error');
            }
        } catch (error) {
            console.error('API Error:', error);
            Swal.fire('เกิดข้อผิดพลาด!', 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้', 'error');
        }
    };

    const handleDelete = async () => {
        const { type, data } = modal;
         const getFolderName = (type) => {
            if (type === 'category') return 'Categories';
            return `${type.charAt(0).toUpperCase() + type.slice(1)}s`;
        }
        const endpoint = `${API_BASE_URL}/${getFolderName(type)}/delete.php`;

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: data.id }),
            });
            const result = await res.json();
            if (result.success) {
                handleCloseModal();
                await fetchData();
                // Swal for delete is now handled inside ConfirmDeleteModal
            } else {
                Swal.fire('เกิดข้อผิดพลาด!', result.message || 'ไม่สามารถลบข้อมูลได้', 'error');
            }
        } catch (error) {
            console.error('API Error:', error);
             Swal.fire('เกิดข้อผิดพลาด!', 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้', 'error');
        }
    };

    const renderTable = useMemo(() => {
        if (loading) return <div className="d-flex justify-content-center align-items-center h-100"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;

        const tableConfig = {
            users: {
                title: 'Users Management', icon: <Icons.Users />, headers: ['ID', 'Username', 'Email', 'Role', 'Created', 'Actions'], data: users,
                renderRow: (item) => (<>
                    <td>{item.id}</td><td>{item.username}</td><td>{item.email}</td>
                    <td><span className={`badge ${item.role === 'admin' ? 'bg-danger' : item.role === 'author' ? 'bg-warning' : 'bg-secondary'}`}>{item.role}</span></td>
                    <td>{new Date(item.created_at).toLocaleDateString()}</td>
                </>)
            },
            posts: {
                title: 'Posts Management', icon: <Icons.Posts />, headers: ['ID', 'Title', 'Author', 'Category', 'Status', 'Actions'], data: posts,
                renderRow: (item) => (<>
                    <td>{item.id}</td><td>{item.title}</td><td>{item.username || 'N/A'}</td><td>{item.category_name || 'N/A'}</td>
                    <td><span className={`badge ${item.status === 'published' ? 'bg-success' : 'bg-secondary'}`}>{item.status}</span></td>
                </>)
            },
            categories: {
                title: 'Categories Management', icon: <Icons.Categories />, headers: ['ID', 'Name', 'Slug', 'Actions'], data: categories,
                renderRow: (item) => (<><td>{item.id}</td><td>{item.name}</td><td>{item.slug}</td></>)
            }
        };
        
        const currentConfig = tableConfig[activeTab];

        const getTypeName = (tab) => {
            if (tab === 'categories') return 'category';
            return tab.slice(0, -1);
        }
        const typeName = getTypeName(activeTab);

        return (
            <div className="card shadow-sm border-0">
                <div className="card-header bg-body-tertiary border-0 d-flex justify-content-between align-items-center p-3">
                    <h3 className="mb-0 d-flex align-items-center gap-2">{currentConfig.icon}{currentConfig.title}</h3>
                    <button className="btn btn-primary" onClick={() => handleOpenModal(typeName, 'add')}>เพิ่ม {typeName}</button>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-body-tertiary">
                                <tr>{currentConfig.headers.map(h => <th key={h} className="py-3 px-3">{h}</th>)}</tr>
                            </thead>
                            <tbody>
                                {currentConfig.data.map((item) => (
                                    <tr key={item.id}>
                                        {currentConfig.renderRow(item)}
                                        <td className="px-3">
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-sm btn-outline-primary" onClick={() => handleOpenModal(typeName, 'edit', item)}><Icons.Edit /></button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleOpenModal(typeName, 'delete', item)}><Icons.Delete /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }, [activeTab, users, posts, categories, loading]);

    return (
        <div className="d-flex vh-100 bg-body-tertiary">
            <div className="d-flex flex-column flex-shrink-0 p-3 bg-body shadow-sm" style={{ width: '280px' }}>
                <Link to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-decoration-none">
                    <span className="fs-4">📰 MyBlog Dashboard</span>
                </Link>
                <hr />
                <ul className="nav nav-pills flex-column mb-auto">
                     {[
                        { key: 'users', label: 'Users', icon: <Icons.Users /> },
                        { key: 'posts', label: 'Posts', icon: <Icons.Posts /> },
                        { key: 'categories', label: 'Categories', icon: <Icons.Categories /> }
                    ].map(item => (
                        <li className="nav-item" key={item.key}>
                            <button className={`nav-link w-100 text-start d-flex align-items-center gap-2 ${activeTab === item.key ? 'active' : ''}`} onClick={() => setActiveTab(item.key)}>
                                {item.icon} {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
                <hr/>
                <div className="dropdown">
                    <a href="#" className="d-flex align-items-center text-decoration-none dropdown-toggle" data-bs-toggle="dropdown">
                        <strong>👋 {username}</strong>
                    </a>
                    <ul className="dropdown-menu text-small shadow">
                        <li><Link className="dropdown-item" to="/">กลับไปหน้า Home</Link></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><button className="dropdown-item" onClick={() => { localStorage.clear(); navigate("/login"); }}>ออกจากระบบ</button></li>
                    </ul>
                </div>
            </div>

            <main className="w-100 p-4" style={{ overflowY: 'auto' }}>
                <header className="d-flex justify-content-end align-items-center mb-4">
                    <button className="btn border-0" onClick={() => setIsDarkMode(!isDarkMode)}>
                        {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
                    </button>
                </header>
                {renderTable}
            </main>
            
            {modal.type === 'user' && modal.mode !== 'delete' && (
                <UserModal
                    isOpen={true}
                    mode={modal.mode}
                    initialData={modal.data}
                    onClose={handleCloseModal}
                    onSave={(formData) => handleSave('user', formData)}
                />
            )}
            {modal.type === 'post' && modal.mode !== 'delete' && (
                <PostModal
                    isOpen={true}
                    mode={modal.mode}
                    initialData={modal.data}
                    onClose={handleCloseModal}
                    onSave={(formData) => handleSave('post', formData)}
                    categories={categories}
                />
            )}
            {modal.type === 'category' && modal.mode !== 'delete' && (
                <CategoryModal
                    isOpen={true}
                    mode={modal.mode}
                    initialData={modal.data}
                    onClose={handleCloseModal}
                    onSave={(formData) => handleSave('category', formData)}
                />
            )}
            {modal.mode === 'delete' && (
                <ConfirmDeleteModal
                    isOpen={true}
                    itemType={modal.type}
                    onClose={handleCloseModal}
                    onConfirm={handleDelete}
                />
            )}
        </div>
    );
}

