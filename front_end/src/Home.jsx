import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import './home.css'; // Import the CSS file for styling

// To apply the new design, please import the home.css file in your project's main entry point (e.g., App.js or index.js)
// Example: import './home.css';

// Icon components
const Icons = {
    Sun: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>,
    Moon: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>,
    UpArrow: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(180)"><path d="m12 19-7-7 1.41-1.41L12 15.17l5.59-5.58L19 11l-7 7z"/></svg>,
    Heart: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart-fill" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/></svg>,
    Comment: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-dots-fill" viewBox="0 0 16 16"><path d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg>,
    User: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16"><path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>,
};

const PostItem = React.memo(({ post, hasLiked, onPostClick, IMG_BASE_URL }) => {
    const firstImage = post.image_urls ? post.image_urls.split(',')[0].trim() : null;
    return (
        <article className="post-card" onClick={() => onPostClick(post)}>
            {firstImage && (
                <div className="post-card-image-container">
                    <img 
                        src={`${IMG_BASE_URL}/IMG/Posts/${firstImage}`} 
                        className="post-card-image" 
                        alt={post.title} 
                        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/EEE/31343C?text=Image+Not+Found'; }}
                    />
                </div>
            )}
            <div className="post-card-content">
                <div className="post-card-header">
                    <h3 className="post-card-title">{post.title}</h3>
                    {hasLiked && <Icons.Heart />}
                </div>
                <p className="post-card-excerpt">{post.content}</p>
                <div className="post-card-footer">
                    <div className="post-card-meta">
                        <small className="d-flex align-items-center gap-1"><Icons.User /> {post.username}</small>
                    </div>
                    <div className="post-card-stats">
                        <small>👁 {post.views || 0}</small>
                        <small>👍 {post.likes || 0}</small>
                        <small><Icons.Comment /> {post.comment_count || 0}</small>
                    </div>
                </div>
            </div>
        </article>
    );
});

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
    const pageNumbers = [];
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    for (let i = 1; i <= totalPages; i++) { pageNumbers.push(i); }
    if (totalPages <= 1) return null;
    return (
        <nav aria-label="Page navigation" className="mt-5">
            <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}><button onClick={() => paginate(1)} className="page-link">«</button></li>
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}><button onClick={() => paginate(currentPage - 1)} className="page-link">‹</button></li>
                {pageNumbers.map(number => (<li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}><button onClick={() => paginate(number)} className="page-link">{number}</button></li>))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}><button onClick={() => paginate(currentPage + 1)} className="page-link">›</button></li>
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}><button onClick={() => paginate(totalPages)} className="page-link">»</button></li>
            </ul>
        </nav>
    );
};

const CustomAlert = ({ show, title, message, type, onConfirm, onCancel }) => {
    if (!show) return null;
    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        {onCancel && <button type="button" className="btn-close" onClick={onCancel}></button>}
                    </div>
                    {message && <div className="modal-body"><p>{message}</p></div>}
                    <div className="modal-footer">
                        {onCancel && <button type="button" className="btn btn-secondary" onClick={onCancel}>{type === 'confirm' ? 'ยกเลิก' : 'ปิด'}</button>}
                        {type === 'confirm' && <button type="button" className="btn btn-primary" onClick={onConfirm}>ยืนยัน</button>}
                    </div>
                </div>
            </div>
        </div>
    );
};

function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "", category_id: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editPostData, setEditPostData] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sortOrder, setSortOrder] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(9);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [newPostImages, setNewPostImages] = useState([]);
  const [editImages, setEditImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ show: false, title: '', message: '', type: 'alert', onConfirm: null, onCancel: null });
  const dragItem = useRef();
  const dragOverItem = useRef();

  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  //in local host
  const API_BASE_URL = "/API";
  const IMG_BASE_URL = "http://localhost/Basic-Blog/back_end";

  // upload to server
  // const API_BASE_URL = "https://student.crru.ac.th/661463026/BASIC-BLOG-API/API";
  // const IMG_BASE_URL = "https://student.crru.ac.th/661463026/BASIC-BLOG-API";

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', isDarkMode ? 'dark' : 'light');
    const checkScrollTop = () => { setShowScrollTop(window.pageYOffset > 400); };
    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [isDarkMode]);

  const showAlert = (title, message = '', type = 'alert', onConfirm = null) => {
    setAlertInfo({ show: true, title, message, type, onConfirm, onCancel: () => hideAlert() });
  };
  const hideAlert = () => setAlertInfo({ show: false });

  const handleLogout = () => {
    showAlert('ต้องการออกจากระบบ?', '', 'confirm', () => {
        localStorage.clear();
        navigate("/login");
        hideAlert();
    });
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const postsRes = await fetch(`${API_BASE_URL}/Posts/read.php`);
        const postsData = await postsRes.json();
        if (postsData.records) {
          setPosts(postsData.records);
          const uniqueCategories = [...new Set(postsData.records.map((post) => post.category_name).filter(Boolean))];
          setCategories(uniqueCategories);
        } else { setError("No posts found."); }
        if (userId) {
          const likedRes = await fetch(`${API_BASE_URL}/Likes/get_by_user.php?user_id=${userId}`);
          const likedData = await likedRes.json();
          if (likedData.success) {
            setLikedPosts(new Set(likedData.liked_posts.map(String)));
          }
        }
      } catch (err) { setError("Server ไม่ตอบสนอง: " + err.message); } 
      finally { setLoading(false); }
    };
    fetchAllData();
  }, [userId]);
  
  const handleCloseModal = () => {
    setSelectedPost(null);
    setShowCreateModal(false);
    setIsEditing(false);
    setNewPostImages([]);
    setEditImages([]);
  };

  const handleOpenPost = useCallback(async (post) => {
    setSelectedPost(post);
    setIsEditing(false);
    try {
      await fetch(`${API_BASE_URL}/Posts/updateViews.php`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ post_id: post.id }),});
      setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, views: (Number(p.views) || 0) + 1 } : p));
    } catch (err) { console.error("❌ Update views error:", err); }
    try {
      const res = await fetch(`${API_BASE_URL}/Comments/read_one.php?post_id=${post.id}`);
      const data = await res.json();
      setComments(data.records || []);
    } catch (err) { setComments([]); }
  }, []);
  
  const handleToggleLike = async () => {
    if (!userId) { showAlert('กรุณาเข้าสู่ระบบ', 'คุณต้องเข้าสู่ระบบก่อนจึงจะสามารถกดไลค์ได้'); return; }
    try {
      const res = await fetch(`${API_BASE_URL}/Posts/toggleLike.php`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ post_id: selectedPost.id, user_id: userId }),});
      const data = await res.json();
      if (data.success) {
        const updatedLikes = data.liked ? (Number(selectedPost.likes) || 0) + 1 : (Number(selectedPost.likes) || 0) - 1;
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          if (data.liked) { newSet.add(String(selectedPost.id)); } else { newSet.delete(String(selectedPost.id)); }
          return newSet;
        });
        setSelectedPost((prev) => ({ ...prev, likes: updatedLikes }));
        setPosts((prevPosts) => prevPosts.map((p) => p.id === selectedPost.id ? { ...p, likes: updatedLikes } : p));
      }
    } catch (err) { console.error("❌ Toggle like error:", err); }
  };

  const handleAddComment = async () => {
    if (!userId) { showAlert('กรุณาเข้าสู่ระบบ', 'คุณต้องเข้าสู่ระบบก่อนจึงจะสามารถแสดงความคิดเห็นได้'); return; }
    if (!commentText.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/Comments/create.php`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ post_id: selectedPost.id, user_id: userId, content: commentText, }),});
      const data = await res.json();
      if (data.success) {
        const newComment = { user: username, content: commentText, created_at: new Date().toISOString() };
        setComments((prev) => [...prev, newComment]);
        const updatedPost = { ...selectedPost, comment_count: (Number(selectedPost.comment_count) || 0) + 1 };
        setSelectedPost(updatedPost);
        setPosts(posts.map(p => p.id === selectedPost.id ? updatedPost : p));
        setCommentText("");
      }
    } catch (err) { console.error("❌ Add comment error:", err); }
  };

  const handleFileChange = (e, setImageState) => {
    const files = Array.from(e.target.files).map((file, index) => ({
        id: `new_${Date.now()}_${index}`, file: file, url: URL.createObjectURL(file), isNew: true
    }));
    setImageState(prev => [...prev, ...files]);
  };

  const removeImage = (id, setImageState) => {
    setImageState(prev => prev.filter(image => image.id !== id));
  };
  
  const handleDragStart = (e, position) => { dragItem.current = position; };
  const handleDragEnter = (e, position) => { dragOverItem.current = position; };
  
  const handleDrop = (setImageState) => {
    const imageState = setImageState === setNewPostImages ? newPostImages : editImages;
    const copyListItems = [...imageState];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setImageState(copyListItems);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!userId) { showAlert('กรุณาเข้าสู่ระบบ'); return; }
    if (!newPost.title.trim() || !newPost.content.trim()) { showAlert('ข้อมูลไม่ครบถ้วน'); return; }
    setIsUploading(true);
    
    const formData = new FormData();
    newPostImages.forEach(image => { formData.append('images[]', image.file); });

    try {
      let uploadedFileNames = [];
      if (newPostImages.length > 0) {
        const uploadRes = await fetch(`${API_BASE_URL}/Image/upload.php`, { method: 'POST', body: formData });
        const uploadResult = await uploadRes.json();
        if (!uploadResult.success) throw new Error(uploadResult.message || 'Image upload failed');
        uploadedFileNames = uploadResult.fileNames;
      }
      
      const postPayload = { ...newPost, user_id: userId, status: "published", images: uploadedFileNames };
      const createRes = await fetch(`${API_BASE_URL}/Posts/create.php`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(postPayload) });
      const createResult = await createRes.json();

      if (createResult.success) {
        setPosts([createResult.post, ...posts]);
        setNewPost({ title: "", content: "", category_id: "" });
        setNewPostImages([]);
        handleCloseModal();
        showAlert('สำเร็จ!', 'สร้างโพสต์สำเร็จ!');
        handleOpenPost(createResult.post);
      } else { 
        showAlert('เกิดข้อผิดพลาด!', createResult.message); 
      }
    } catch (err) {
      showAlert('เกิดข้อผิดพลาด!', err.message);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleEditPost = () => { 
    setEditPostData(selectedPost); 
    const existingImages = selectedPost.image_urls 
      ? selectedPost.image_urls.split(',').map(name => ({
          id: name, url: `${IMG_BASE_URL}/IMG/Posts/${name}`, isNew: false, file: null
        }))
      : [];
    setEditImages(existingImages);
    setIsEditing(true); 
  };
  
  const handleUpdatePost = async () => {
    if (!editPostData.title.trim()) { showAlert('ข้อมูลไม่ครบถ้วน'); return; }
    setIsUploading(true);

    try {
        const originalImageNames = selectedPost.image_urls ? selectedPost.image_urls.split(',') : [];
        const currentImageNames = editImages.filter(img => !img.isNew).map(img => img.id);
        const imagesToDelete = originalImageNames.filter(name => !currentImageNames.includes(name));
        const newImageFiles = editImages.filter(img => img.isNew).map(img => img.file);
        
        if (imagesToDelete.length > 0) {
            await fetch(`${API_BASE_URL}/Image/delete.php`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filenames: imagesToDelete })
            });
        }
        
        let newUploadedFileNames = [];
        if (newImageFiles.length > 0) {
            const formData = new FormData();
            newImageFiles.forEach(file => formData.append('images[]', file));
            const uploadRes = await fetch(`${API_BASE_URL}/Image/upload.php`, { method: 'POST', body: formData });
            const uploadResult = await uploadRes.json();
            if (!uploadResult.success) throw new Error(uploadResult.message || 'Image upload failed');
            newUploadedFileNames = uploadResult.fileNames;
        }

        const finalImageNames = [...currentImageNames, ...newUploadedFileNames];
        const updatePayload = { ...editPostData, image_urls: finalImageNames.join(',') };

        const res = await fetch(`${API_BASE_URL}/Posts/update.php`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatePayload) });
        const result = await res.json();
        
        if (result.success) {
            const updatedPosts = posts.map(p => p.id === result.post.id ? result.post : p);
            setPosts(updatedPosts);
            setSelectedPost(result.post);
            setIsEditing(false);
            showAlert('สำเร็จ!', 'อัปเดตโพสต์สำเร็จ!');
        } else { 
            showAlert('เกิดข้อผิดพลาด!', result.message); 
        }
    } catch (error) { 
        showAlert('เกิดข้อผิดพลาด!', error.message);
    } finally {
        setIsUploading(false);
    }
  };

  const handleDeletePost = () => {
    showAlert('คุณแน่ใจหรือไม่?', 'คุณจะไม่สามารถกู้คืนโพสต์นี้ได้!', 'confirm', async () => {
        const postToDelete = selectedPost;
        hideAlert();
        try {
            if (postToDelete.image_urls) {
                const imageFilenames = postToDelete.image_urls.split(',').filter(name => name.trim() !== '');
                if (imageFilenames.length > 0) {
                    await fetch(`${API_BASE_URL}/Image/delete.php`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ filenames: imageFilenames })
                    });
                }
            }
            const postDeleteRes = await fetch(`${API_BASE_URL}/Posts/delete.php`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: postToDelete.id })
            });
            const postDeleteResult = await postDeleteRes.json();
            if (postDeleteResult.success) {
                setPosts(posts.filter(p => p.id !== postToDelete.id));
                handleCloseModal();
                showAlert('ลบแล้ว!', 'โพสต์ของคุณถูกลบเรียบร้อยแล้ว');
            } else {
                showAlert('เกิดข้อผิดพลาด!', `ไม่สามารถลบโพสต์ได้: ${postDeleteResult.message}`);
            }
        } catch (error) {
            showAlert('เกิดข้อผิดพลาด!', `Server ไม่ตอบสนอง: ${error.message}`);
        }
    });
};

  const processedPosts = useMemo(() => {
    let filtered = posts.filter((post) => (selectedCategory === "all" || post.category_name === selectedCategory) && post.title.toLowerCase().includes(search.toLowerCase()));
    switch (sortOrder) {
        case 'likes_desc': filtered.sort((a, b) => (Number(b.likes) || 0) - (Number(a.likes) || 0)); break;
        case 'views_desc': filtered.sort((a, b) => (Number(b.views) || 0) - (Number(a.views) || 0)); break;
        default: filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); break;
    }
    return filtered;
  }, [posts, sortOrder, selectedCategory, search]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = processedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const isAuthor = selectedPost && userId && String(selectedPost.user_id) === String(userId);
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  
  const featuredImage = selectedPost?.image_urls ? selectedPost.image_urls.split(',')[0].trim() : null;
  const galleryImages = selectedPost?.image_urls ? selectedPost.image_urls.split(',').map(s => s.trim()).filter(Boolean).slice(1) : [];

  return (
    <>
      <CustomAlert {...alertInfo} />
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">📰 MyBlog</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto align-items-center">
              {username ? (
                <>
                  <li className="nav-item"><span className="nav-link">👋 {username}</span></li>
                  {role === "admin" && (<li className="nav-item"><Link to="/dashboard" className="btn btn-outline-warning btn-sm me-2">⚙️ Dashboard</Link></li>)}
                  <li className="nav-item"><button onClick={handleLogout} className="btn btn-outline-danger btn-sm">🚪 Logout</button></li>
                </>
              ) : (<li className="nav-item"><Link to="/login" className="btn btn-outline-primary btn-sm">🔑 Login</Link></li>)}
               <li className="nav-item ms-3">
                    <button className="btn btn-outline-secondary" onClick={() => setIsDarkMode(!isDarkMode)}>
                        {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
                    </button>
               </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="container my-5">
        <header className="text-center mb-5">
            <h1 className="display-4 fw-bold">Welcome to MyBlog</h1>
            <p className="lead text-muted">Discover stories, thinking, and expertise from writers on any topic.</p>
        </header>

        {username && (<div className="d-grid gap-2 mb-5"><button className="btn btn-primary btn-lg py-3" type="button" onClick={() => setShowCreateModal(true)}>✍️ เขียนบทความใหม่</button></div>)}
        
        <div className="d-flex flex-wrap gap-2 mb-4 p-3 border rounded bg-body-tertiary shadow-sm">
            <input type="text" className="form-control" style={{flexBasis: '300px', flexGrow: 1}} placeholder="🔍 ค้นหา..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <select className="form-select" style={{flexBasis: '200px'}} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="all">ทุกหมวดหมู่</option>
                {categories.map((cat, i) => (<option key={i} value={cat}>{cat}</option>))}
            </select>
            <select className="form-select" style={{flexBasis: '200px'}} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="latest">ล่าสุด</option>
                <option value="views_desc">ยอดนิยม</option>
                <option value="likes_desc">ถูกใจมากที่สุด</option>
            </select>
            <select className="form-select" style={{flexBasis: '150px'}} value={postsPerPage} onChange={(e) => { setPostsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
                <option value={6}>6 ต่อหน้า</option>
                <option value={9}>9 ต่อหน้า</option>
                <option value={12}>12 ต่อหน้า</option>
            </select>
        </div>

        {loading && <div className="text-center py-5"><div className="spinner-border" role="status" style={{width: '3rem', height: '3rem'}}><span className="visually-hidden">Loading...</span></div></div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && (
            <>
                <div className="blog-grid">
                    {currentPosts.length > 0 ? (
                        currentPosts.map((post) => (
                           <PostItem 
                                key={post.id} post={post} hasLiked={likedPosts.has(String(post.id))}
                                onPostClick={handleOpenPost} IMG_BASE_URL={IMG_BASE_URL}
                           />
                        ))
                    ) : (
                        <div className="col-12 text-center text-muted p-5 w-100" style={{gridColumn: '1 / -1'}}>
                            <h4>ไม่พบบทความ</h4>
                            <p>ลองเปลี่ยนคำค้นหาหรือตัวกรองของคุณ</p>
                        </div>
                    )}
                </div>
                <Pagination postsPerPage={postsPerPage} totalPosts={processedPosts.length} paginate={paginate} currentPage={currentPage} />
            </>
        )}
      </main>
      {showScrollTop && (<button onClick={scrollTop} className="btn btn-primary position-fixed bottom-0 end-0 m-3 rounded-circle p-3" style={{zIndex: 1050, width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.UpArrow /></button>)}

      {/* Create Post Modal */}
      <div className={`modal fade ${showCreateModal ? 'show' : ''}`} style={{ display: showCreateModal ? 'block' : 'none', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
                <div className="modal-header"><h5 className="modal-title">✍️ สร้างโพสต์ใหม่</h5><button type="button" className="btn-close" onClick={handleCloseModal}></button></div>
                <form onSubmit={handleCreatePost}>
                    <div className="modal-body">
                        <div className="mb-3"><label className="form-label">Title</label><input type="text" className="form-control" placeholder="หัวข้อโพสต์" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} /></div>
                        <div className="mb-3"><label className="form-label">Content</label><textarea className="form-control" placeholder="เนื้อหา..." rows="5" value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}></textarea></div>
                        <div className="mb-3"><label className="form-label">Category</label><select className="form-select" value={newPost.category_id} onChange={(e) => setNewPost({ ...newPost, category_id: e.target.value })}><option value="">เลือกหมวดหมู่</option>{categories.map((cat, i) => (<option key={i + 1} value={i + 1}>{cat}</option>))}</select></div>
                        <div className="mb-3">
                            <label className="form-label">รูปภาพ</label>
                            <input type="file" multiple className="form-control" onChange={(e) => handleFileChange(e, setNewPostImages)} accept="image/*" />
                        </div>
                        {newPostImages.length > 0 && (
                            <div className="d-flex flex-wrap gap-2 border p-2 rounded bg-body-tertiary">
                                {newPostImages.map((image, index) => (
                                    <div key={image.id} className="position-relative" style={{ width: '100px', height: '100px', cursor: 'grab' }} draggable onDragStart={(e) => handleDragStart(e, index)} onDragEnter={(e) => handleDragEnter(e, index)} onDragEnd={() => handleDrop(setNewPostImages)} onDragOver={(e) => e.preventDefault()}>
                                        <img src={image.url} alt={`preview ${index}`} className="img-thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button type="button" className="btn btn-sm btn-danger rounded-circle position-absolute top-0 end-0" style={{ transform: 'translate(50%, -50%)' }} onClick={() => removeImage(image.id, setNewPostImages)}>&times;</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleCloseModal} disabled={isUploading}>ยกเลิก</button>
                        <button type="submit" className="btn btn-success" disabled={isUploading}>{isUploading ? <><span className="spinner-border spinner-border-sm me-2"></span>กำลังโพสต์...</> : 'โพสต์'}</button>
                    </div>
                </form>
            </div>
        </div>
      </div>
      
      {/* View/Edit Post Modal */}
      {selectedPost && (
        <div className={`modal fade blog-modal ${selectedPost ? 'show' : ''}`} style={{ display: selectedPost ? 'block' : 'none', backgroundColor: 'rgba(0,0,0,0.7)' }} tabIndex="-1">
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
                {isEditing ? (
                    <>
                        <div className="modal-header" style={{padding: '1rem'}}><h5 className="modal-title">✍️ แก้ไขบทความ</h5><button type="button" className="btn-close" onClick={() => setIsEditing(false)}></button></div>
                        <div className="modal-body" style={{padding: '1rem'}}>
                            <form>
                                <div className="mb-3"><label className="form-label">Title</label><input type="text" className="form-control" value={editPostData.title} onChange={(e) => setEditPostData({...editPostData, title: e.target.value})}/></div>
                                <div className="mb-3"><label className="form-label">Content</label><textarea className="form-control" rows="10" value={editPostData.content} onChange={(e) => setEditPostData({...editPostData, content: e.target.value})}></textarea></div>
                                <div className="row">
                                    <div className="col-md-6 mb-3"><label className="form-label">Category</label><select className="form-select" value={editPostData.category_id} onChange={(e) => setEditPostData({...editPostData, category_id: e.target.value})}>{categories.map((cat, i) => (<option key={i + 1} value={i + 1}>{cat}</option>))}</select></div>
                                    <div className="col-md-6 mb-3"><label className="form-label">Status</label><select className="form-select" value={editPostData.status} onChange={(e) => setEditPostData({...editPostData, status: e.target.value})}><option value="draft">Draft</option><option value="published">Published</option></select></div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">รูปภาพ</label>
                                    <input type="file" multiple className="form-control" onChange={(e) => handleFileChange(e, setEditImages)} accept="image/*" />
                                </div>
                                {editImages.length > 0 && (
                                    <div className="d-flex flex-wrap gap-2 border p-2 rounded bg-body-tertiary">
                                        {editImages.map((image, index) => (
                                            <div key={image.id} className="position-relative" style={{ width: '100px', height: '100px', cursor: 'grab' }} draggable onDragStart={(e) => handleDragStart(e, index)} onDragEnter={(e) => handleDragEnter(e, index)} onDragEnd={() => handleDrop(setEditImages)} onDragOver={(e) => e.preventDefault()}>
                                                <img src={image.url} alt={`preview ${index}`} className="img-thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <button type="button" className="btn btn-sm btn-danger rounded-circle position-absolute top-0 end-0" style={{ transform: 'translate(50%, -50%)' }} onClick={() => removeImage(image.id, setEditImages)}>&times;</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </form>
                        </div>
                         <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setIsEditing(false)} disabled={isUploading}>ยกเลิก</button>
                            <button className="btn btn-primary" onClick={handleUpdatePost} disabled={isUploading}>
                               {isUploading ? <><span className="spinner-border spinner-border-sm me-2"></span>กำลังบันทึก...</> : 'บันทึกการเปลี่ยนแปลง'}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="modal-header">
                            {featuredImage && (
                                <>
                                    <img src={`${IMG_BASE_URL}/IMG/Posts/${featuredImage}`} className="blog-modal-featured-image" alt={selectedPost.title} />
                                    <div className="blog-modal-header-content">
                                        <h1 className="blog-modal-title">{selectedPost.title}</h1>
                                        <p className="blog-modal-meta">โดย {selectedPost.username} • เผยแพร่เมื่อ {new Date(selectedPost.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                </>
                            )}
                             {/* This button is now visible for all posts */}
                            <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                             {/* Header for posts without images */}
                            {!featuredImage && (
                                <div className="blog-modal-header-no-image">
                                    <h1 className="blog-modal-title">{selectedPost.title}</h1>
                                    <p className="blog-modal-meta">โดย {selectedPost.username} • เผยแพร่เมื่อ {new Date(selectedPost.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            )}
                        </div>
                        <div className="modal-body">
                            <p style={{whiteSpace: 'pre-wrap'}}>{selectedPost.content}</p>
                            {galleryImages.length > 0 && (
                                <>
                                <hr/><h5 className="mb-3">แกลเลอรี</h5>
                                <div className="blog-modal-gallery">
                                    {galleryImages.map((img, idx) => (<img key={idx} src={`${IMG_BASE_URL}/IMG/Posts/${img}`} alt={`gallery image ${idx+1}`}/>))}
                                </div>
                                </>
                            )}
                            <hr/>
                            <div className="d-flex justify-content-between align-items-center">
                                <button className={`btn ${likedPosts.has(String(selectedPost.id)) ? 'btn-danger' : 'btn-outline-danger'}`} onClick={handleToggleLike}>
                                    <Icons.Heart/> {likedPosts.has(String(selectedPost.id)) ? 'ถูกใจแล้ว' : 'ถูกใจ'} ({selectedPost.likes || 0})
                                </button>
                                {isAuthor && (
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-outline-danger" onClick={handleDeletePost}>ลบโพสต์</button>
                                        <button className="btn btn-outline-warning" onClick={handleEditPost}>แก้ไขโพสต์</button>
                                    </div>
                                )}
                            </div>
                            <div className="comment-section">
                                <h4><Icons.Comment /> ความคิดเห็น ({comments.length})</h4>
                                <div className="my-3">
                                  {comments.length > 0 ? (comments.map((c, i) => (
                                      <div key={i} className="comment">
                                          <strong>{c.user || "User"}</strong>
                                          <p className="mb-1">{c.content || c.text}</p>
                                          <small>{new Date(c.created_at).toLocaleString('th-TH')}</small>
                                      </div>
                                  ))) : (<p className="text-muted">ยังไม่มีความคิดเห็น</p>)}
                                </div>
                                {username && (
                                    <div className="input-group">
                                        <input type="text" className="form-control" placeholder="เขียนความคิดเห็น..." value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}/>
                                        <button className="btn btn-success" onClick={handleAddComment}>ส่ง</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
              </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;

