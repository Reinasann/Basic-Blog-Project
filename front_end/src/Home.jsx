import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; // ✅ 1. Import SweetAlert

// ✅ 2. ไอคอนสำหรับปุ่มต่างๆ
const Icons = {
    Sun: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>,
    Moon: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>,
    UpArrow: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 1.41-1.41L12 15.17l5.59-5.58L19 11l-7 7z"/></svg>,
};

// ✅ 3. Component สำหรับ Pagination
const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i);
    }

    if (pageNumbers.length <= 1) return null;

    return (
        <nav>
            <ul className="pagination justify-content-center">
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <button onClick={() => paginate(number)} className="page-link">
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
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

  // ✅ 4. State ใหม่สำหรับฟีเจอร์เพิ่มเติม
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sortOrder, setSortOrder] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [showScrollTop, setShowScrollTop] = useState(false);


  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const API_BASE = "/API";

  //upload to server
  //const API_BASE = "http://student.crru.ac.th/661463026/BASIC-BLOG-API/API";

  // ✅ 5. useEffect สำหรับจัดการ Dark Mode และ Scroll-to-Top
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', isDarkMode ? 'dark' : 'light');
    
    const checkScrollTop = () => {
        if (!showScrollTop && window.pageYOffset > 400) {
            setShowScrollTop(true);
        } else if (showScrollTop && window.pageYOffset <= 400) {
            setShowScrollTop(false);
        }
    };
    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [isDarkMode, showScrollTop]);

  // 👉 Logout (ใช้ SweetAlert)
  const handleLogout = () => {
    Swal.fire({
      title: 'ต้องการออกจากระบบ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ออกจากระบบ',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/login");
      }
    });
  };

  // 👉 โหลด Posts
  useEffect(() => {
    const fetchPosts = async () => {
        setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/Posts/read.php`);
        const data = await res.json();
        if (data.records) {
          setPosts(data.records);
          const uniqueCategories = [...new Set(data.records.map((post) => post.category_name || "อื่นๆ").filter(Boolean))];
          setCategories(uniqueCategories);
        } else {
          setError("No posts found.");
        }
      } catch (err) {
        setError("Server ไม่ตอบสนอง: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // 👉 เปิด Modal และบันทึก Views
  const handleOpenPost = async (post) => {
    setSelectedPost(post);
    setIsEditing(false);
    try {
      await fetch(`${API_BASE}/Posts/updateViews.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: post.id }),
      });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, views: (Number(p.views) || 0) + 1 } : p
        )
      );
    } catch (err) {
      console.error("❌ Update views error:", err);
    }
    try {
      const res = await fetch(`${API_BASE}/Comments/read_one.php?post_id=${post.id}`);
      const data = await res.json();
      setComments(data.records || []);
    } catch (err) {
      setComments([]);
    }
  };

  const handleToggleLike = async () => {
    if (!userId) {
      Swal.fire('กรุณาเข้าสู่ระบบ', 'คุณต้องเข้าสู่ระบบก่อนจึงจะสามารถกดไลค์ได้', 'warning');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/Posts/toggleLike.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: selectedPost.id, user_id: userId }),
      });
      const data = await res.json();
      if (data.success) {
        const updatedLikes = data.liked ? (Number(selectedPost.likes) || 0) + 1 : (Number(selectedPost.likes) || 0) - 1;
        setSelectedPost((prev) => ({ ...prev, likes: updatedLikes }));
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.id === selectedPost.id ? { ...p, likes: updatedLikes } : p
          )
        );
      }
    } catch (err) {
      console.error("❌ Toggle like error:", err);
    }
  };

  const handleAddComment = async () => {
    if (!userId) {
       Swal.fire('กรุณาเข้าสู่ระบบ', 'คุณต้องเข้าสู่ระบบก่อนจึงจะสามารถแสดงความคิดเห็นได้', 'warning');
      return;
    }
    if (!commentText.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/Comments/create.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: selectedPost.id,
          user_id: userId,
          content: commentText,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setComments((prev) => [...prev, { user: username, content: commentText, created_at: new Date().toISOString() }]);
        setCommentText("");
      }
    } catch (err) {
      console.error("❌ Add comment error:", err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!userId) {
       Swal.fire('กรุณาเข้าสู่ระบบ', 'คุณต้องเข้าสู่ระบบก่อนจึงจะสามารถสร้างโพสต์ได้', 'warning');
      return;
    }
    if (!newPost.title.trim() || !newPost.content.trim()) {
       Swal.fire('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกชื่อเรื่องและเนื้อหาของโพสต์', 'error');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/Posts/create.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          category_id: newPost.category_id || 1,
          title: newPost.title,
          content: newPost.content,
          status: "published",
        }),
      });
      const data = await res.json();
      if (data.success) {
        const newPostData = data.post;
        setPosts([newPostData, ...posts]);
        setNewPost({ title: "", content: "", category_id: "" });
        const modalElement = document.getElementById('createPostModal');
        const modalInstance = window.bootstrap?.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
        Swal.fire({ icon: 'success', title: 'สร้างโพสต์สำเร็จ!', showConfirmButton: false, timer: 1500 });
        handleOpenPost(newPostData);
      } else {
        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด!', text: data.message });
      }
    } catch (err) {
      console.error("❌ Create post error:", err);
      Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาดในการเชื่อมต่อ!', text: err.message });
    }
  };

  const handleEditPost = () => {
    setEditPostData(selectedPost);
    setIsEditing(true);
  };
  
  const handleUpdatePost = async () => {
    if (!editPostData.title.trim()) {
      Swal.fire('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกชื่อเรื่อง', 'error');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/Posts/update.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editPostData)
      });
      const result = await res.json();
      if (result.success) {
        const updatedPostFromServer = result.post;
        const updatedPosts = posts.map(p => 
          p.id === updatedPostFromServer.id ? updatedPostFromServer : p
        );
        setPosts(updatedPosts);
        setSelectedPost(updatedPostFromServer);
        setIsEditing(false);
        Swal.fire({ icon: 'success', title: 'อัปเดตโพสต์สำเร็จ!', showConfirmButton: false, timer: 1500 });
      } else {
        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด!', text: result.message });
      }
    } catch (error) {
      console.error("❌ Update post error:", error);
    }
  };

  const handleDeletePost = async () => {
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: "คุณจะไม่สามารถกู้คืนโพสต์นี้ได้!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${API_BASE}/Posts/delete.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: selectedPost.id })
          });
          const resultData = await res.json();
          if (resultData.success) {
            setPosts(posts.filter(p => p.id !== selectedPost.id));
            const modalElement = document.getElementById('postModal');
            const modalInstance = window.bootstrap?.Modal.getInstance(modalElement);
            if (modalInstance) {
              modalInstance.hide();
            }
            setSelectedPost(null);
            Swal.fire('ลบแล้ว!', 'โพสต์ของคุณถูกลบเรียบร้อยแล้ว', 'success');
          } else {
            Swal.fire('เกิดข้อผิดพลาด!', resultData.message, 'error');
          }
        } catch (error) {
          console.error("❌ Delete post error:", error);
        }
      }
    });
  };

  // ✅ 6. Logic สำหรับการจัดเรียงและฟิลเตอร์ และ Pagination
  const processedPosts = useMemo(() => {
    let processablePosts = [...posts];

    // Filtering
    let filtered = processablePosts.filter(
      (post) =>
        (selectedCategory === "all" || post.category_name === selectedCategory) &&
        post.title.toLowerCase().includes(search.toLowerCase())
    );

    // Sorting
    switch (sortOrder) {
        case 'likes_desc':
            filtered.sort((a, b) => (Number(b.likes) || 0) - (Number(a.likes) || 0));
            break;
        case 'likes_asc':
            filtered.sort((a, b) => (Number(a.likes) || 0) - (Number(b.likes) || 0));
            break;
        case 'views_desc':
            filtered.sort((a, b) => (Number(b.views) || 0) - (Number(a.views) || 0));
            break;
        case 'views_asc':
            filtered.sort((a, b) => (Number(a.views) || 0) - (Number(b.views) || 0));
            break;
        case 'latest':
        default:
             filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
    }
    return filtered;
  }, [posts, sortOrder, selectedCategory, search]);

  // Pagination Logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = processedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  const isAuthor = selectedPost && userId && String(selectedPost.user_id) === String(userId);
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">📰 MyBlog</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto align-items-center">
              {username ? (
                <>
                  <li className="nav-item">
                    <span className="nav-link text-success">👋 {username}</span>
                  </li>
                  {role === "admin" && (
                    <li className="nav-item">
                      <Link to="/dashboard" className="btn btn-warning btn-sm me-2">⚙️ Dashboard</Link>
                    </li>
                  )}
                  <li className="nav-item">
                    <button onClick={handleLogout} className="btn btn-danger btn-sm">🚪 Logout</button>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link to="/login" className="btn btn-primary btn-sm">🔑 Login</Link>
                </li>
              )}
               <li className="nav-item ms-3">
                    <button className="btn btn-outline-secondary" onClick={() => setIsDarkMode(!isDarkMode)}>
                        {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
                    </button>
                </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container my-4">
        {username && (
          <div className="d-grid gap-2 mb-4">
            <button className="btn btn-primary btn-lg" type="button" data-bs-toggle="modal" data-bs-target="#createPostModal">
              ✍️ เขียนโพสต์ใหม่
            </button>
          </div>
        )}
        <h2 className="mb-4">📌 Latest Posts</h2>
        
        <div className="d-flex flex-wrap gap-2 mb-4 p-3 border rounded bg-body-tertiary shadow-sm">
            <input type="text" className="form-control" style={{flexBasis: '300px', flexGrow: 1}} placeholder="🔍 ค้นหาชื่อโพสต์..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <select className="form-select" style={{flexBasis: '200px'}} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="all">ทุกหมวดหมู่</option>
                {categories.map((cat, i) => (<option key={i} value={cat}>{cat}</option>))}
            </select>
            <select className="form-select" style={{flexBasis: '200px'}} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="latest">ล่าสุด</option>
                <option value="views_desc">ยอดวิว (มากไปน้อย)</option>
                <option value="views_asc">ยอดวิว (น้อยไปมาก)</option>
                <option value="likes_desc">ยอดไลค์ (มากไปน้อย)</option>
                <option value="likes_asc">ยอดไลค์ (น้อยไปมาก)</option>
            </select>
             <select className="form-select" style={{flexBasis: '150px'}} value={postsPerPage} onChange={(e) => setPostsPerPage(Number(e.target.value))}>
                <option value={5}>5 ต่อหน้า</option>
                <option value={10}>10 ต่อหน้า</option>
                <option value={20}>20 ต่อหน้า</option>
            </select>
        </div>

        {loading && <div className="text-center"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
            <>
                <div className="list-group mb-4">
                    {currentPosts.length > 0 ? (
                        currentPosts.map((post) => (
                    <button key={post.id} className="list-group-item list-group-item-action" data-bs-toggle="modal" data-bs-target="#postModal" onClick={() => handleOpenPost(post)}>
                        <h5>{post.title}</h5>
                        <p className="text-truncate">{post.content}</p>
                        <small>📅 {new Date(post.created_at).toLocaleString()} | 👁 {post.views || 0} | 👍 {post.likes || 0}</small>
                    </button>
                    ))
                    ) : (
                        <p className="text-center text-muted p-5">ไม่พบโพสต์ที่ตรงกับเงื่อนไข</p>
                    )}
                </div>
                <Pagination postsPerPage={postsPerPage} totalPosts={processedPosts.length} paginate={paginate} currentPage={currentPage} />
            </>
        )}
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
          <button onClick={scrollTop} className="btn btn-dark position-fixed bottom-0 end-0 m-3 rounded-circle p-3" style={{zIndex: 1050}}>
              <Icons.UpArrow />
          </button>
      )}

      {/* ... (โค้ด Modal ทั้งหมดเหมือนเดิม) ... */}
       <div className="modal fade" id="createPostModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">✍️ สร้างโพสต์ใหม่</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form onSubmit={handleCreatePost}>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label">Title</label>
                            <input type="text" className="form-control" placeholder="หัวข้อโพสต์" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Content</label>
                            <textarea className="form-control" placeholder="เนื้อหา..." rows="5" value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}></textarea>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Category</label>
                            <select className="form-select" value={newPost.category_id} onChange={(e) => setNewPost({ ...newPost, category_id: e.target.value })}>
                                <option value="">เลือกหมวดหมู่</option>
                                {categories.map((cat, i) => (<option key={i + 1} value={i + 1}>{cat}</option>))}
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">ยกเลิก</button>
                        <button type="submit" className="btn btn-success">โพสต์</button>
                    </div>
                </form>
            </div>
        </div>
      </div>
      {selectedPost && (
        <div className="modal fade" id="postModal" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                {isEditing ? (
                    <input 
                        type="text" 
                        className="form-control"
                        value={editPostData.title}
                        onChange={(e) => setEditPostData({...editPostData, title: e.target.value})}
                    />
                ) : (
                    <h5 className="modal-title">{selectedPost.title}</h5>
                )}
                <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => setIsEditing(false)}></button>
              </div>
              <div className="modal-body">
                {isEditing ? (
                    <form>
                        <div className="mb-3">
                            <label className="form-label">Content</label>
                            <textarea 
                                className="form-control" 
                                rows="10"
                                value={editPostData.content}
                                onChange={(e) => setEditPostData({...editPostData, content: e.target.value})}
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Category</label>
                            <select 
                                className="form-select" 
                                value={editPostData.category_id} 
                                onChange={(e) => setEditPostData({...editPostData, category_id: e.target.value})}
                            >
                                {categories.map((cat, i) => (
                                    <option key={i + 1} value={i + 1}>{cat}</option> 
                                ))}
                            </select>
                        </div>
                         <div className="mb-3">
                            <label className="form-label">Status</label>
                            <select 
                                className="form-select" 
                                value={editPostData.status}
                                onChange={(e) => setEditPostData({...editPostData, status: e.target.value})}
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                    </form>
                ) : (
                    <>
                        <p>{selectedPost.content}</p>
                        <hr />
                        <p><strong>👤 ผู้เขียน:</strong> {selectedPost.username}</p>
                        <p><strong>📅 วันที่เขียน:</strong> {new Date(selectedPost.created_at).toLocaleString()}</p>
                        <p><strong>👁 Views:</strong> {selectedPost.views || 0}</p>
                        <p><strong>👍 Likes:</strong> {selectedPost.likes || 0}</p>
                        
                        <button className="btn btn-outline-primary me-2" onClick={handleToggleLike}>👍 Like</button>
                        <hr/>
                        <h6 className="mt-3">💬 Comments</h6>
                        <div className="mb-2">
                          {comments.length > 0 ? (
                            comments.map((c, i) => (
                              <div key={i} className="border-bottom pb-2 mb-2">
                                <strong>{c.user || "User"}</strong>: {c.content || c.text}
                                <br />
                                <small className="text-muted">{new Date(c.created_at).toLocaleString()}</small>
                              </div>
                            ))
                          ) : (
                            <p className="text-muted">ยังไม่มีความคิดเห็น</p>
                          )}
                        </div>
                        {username && (
                          <div className="input-group">
                            <input type="text" className="form-control" placeholder="เขียนความคิดเห็น..." value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                            <button className="btn btn-success" onClick={handleAddComment}>ส่ง</button>
                          </div>
                        )}
                    </>
                )}
              </div>
              <div className="modal-footer">
                {isEditing ? (
                    <>
                        <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>ยกเลิก</button>
                        <button className="btn btn-primary" onClick={handleUpdatePost}>บันทึกการเปลี่ยนแปลง</button>
                    </>
                ) : (
                    <>
                        {isAuthor && (
                            <>
                                <button className="btn btn-outline-danger me-auto" onClick={handleDeletePost}>ลบโพสต์</button>
                                <button className="btn btn-outline-warning" onClick={handleEditPost}>แก้ไขโพสต์</button>
                            </>
                        )}
                        <button className="btn btn-secondary" data-bs-dismiss="modal">ปิด</button>
                    </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;

