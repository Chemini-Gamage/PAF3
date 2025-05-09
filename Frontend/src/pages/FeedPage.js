"use client"

import { useState, useEffect } from "react"
import { getAllPosts } from "../services/feed"
import { useAuth } from "../context/AuthContext"
import Header from "./components/Header"
import CreatePostCard from "../components/CreatePostCard"
import PostCard from "./components/PostCard"
import "../styles/Feed.css"

const FeedPage = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { currentUser } = useAuth()

  // Apply background image directly to the container
  const feedContainerStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/bg4.jpg)`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("Fetching posts...")
        const postsData = await getAllPosts()
        console.log("Posts fetched:", postsData)
        setPosts(postsData)
      } catch (err) {
        console.error("Error fetching posts:", err)
        setError(err.message || "Failed to load posts. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handlePostCreated = (newPost) => {
    console.log("New post created:", newPost)
    setPosts([newPost, ...posts])
  }

  const handlePostUpdated = (updatedPost) => {
    console.log("Post updated:", updatedPost)
    setPosts(posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)))
  }

  const handlePostDeleted = (postId) => {
    console.log("Post deleted:", postId)
    setPosts(posts.filter((post) => post.id !== postId))
  }

  return (
    <>
      <Header />
      <div className="feed-container" style={feedContainerStyle}>
        <div className="feed-content">
          <div className="feed-sidebar">
            <div className="sidebar-card">
              <h3>Profile Overview</h3>
              <div className="profile-preview">
                {currentUser?.profilePicture ? (
                  <img
                    src={currentUser.profilePicture || "/placeholder.svg"}
                    alt={currentUser.firstName || "User"}
                    className="sidebar-profile-img"
                  />
                ) : (
                  <div className="sidebar-default-avatar">
                    {currentUser?.firstName ? currentUser.firstName.charAt(0) : currentUser?.email.charAt(0)}
                  </div>
                )}
                <div className="profile-info">
                  <p className="profile-name">
                    {currentUser?.firstName && currentUser?.lastName
                      ? `${currentUser.firstName} ${currentUser.lastName}`
                      : "Complete your profile"}
                  </p>
                  <p className="profile-headline">{currentUser?.position || "Add your skills"}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="feed-main">
            <CreatePostCard onPostCreated={handlePostCreated} />

            {loading ? (
              <div className="loading-feed">
                <div className="loading-spinner"></div>
                <p>Loading posts...</p>
              </div>
            ) : error ? (
              <div className="feed-error">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Try Again</button>
              </div>
            ) : posts.length === 0 ? (
              <div className="no-posts">
                <p>No posts yet. Be the first to share your skills!</p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onPostUpdated={handlePostUpdated}
                  onPostDeleted={handlePostDeleted}
                />
              ))
            )}
          </div>
          <div className="feed-sidebar">
            <div className="sidebar-card">
              <h3>SkillSync News</h3>
              <ul className="news-list">
                <li>
                  <span className="news-title">Top 10 most in-demand skills for 2025</span>
                  <span className="news-date">2 days ago</span>
                </li>
                <li>
                  <span className="news-title">How to showcase your coding skills effectively</span>
                  <span className="news-date">3 days ago</span>
                </li>
                <li>
                  <span className="news-title">New skill exchange program launched</span>
                  <span className="news-date">4 days ago</span>
                </li>
                <li>
                  <span className="news-title">The rise of micro-learning for skill development</span>
                  <span className="news-date">5 days ago</span>
                </li>
                <li>
                  <span className="news-title">Skill mentorship opportunities available</span>
                  <span className="news-date">1 week ago</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FeedPage
