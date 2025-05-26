<template>
  <div class="detail-wrapper">
    <!-- Header -->
    <div class="header">
      <img src="@/assets/images/DEC.png" alt="Logo" class="logo-image" />
      <h1 class="page-title">Item Description</h1>
      <img src="@/assets/images/return.png" alt="Back" class="back-button" @click="goBack" />
    </div>

    <!-- Main Content -->
    <div v-if="item" class="card">
      <div class="image-section image-hover-wrapper">
        <img :src="item.image_url" class="item-image" />

        <!-- Overlay with report icon -->
        <div class="image-overlay" @click="showReportModal = true">
          <img src="@/assets/images/report.png" alt="Report" class="report-icon" />
        </div>
      </div>

      <div class="details-section">
        <!-- User Info -->
        <div class="user-card">
          <img :src="item.profile_url || defaultImage" alt="User" class="avatar-img" />
          <div>
            <strong>{{ item.username || 'Unknown User' }}</strong>
            <p class="email">{{ item.email || '' }}</p>
          </div>
        </div>

        <!-- Item Info -->
        <div class="item-info">
          <p><strong>Description:</strong> {{ item.description }}</p>
          <p><strong>Date & Time:</strong> {{ item.date_lost }}</p>
          <p><strong>Room/Facility:</strong> {{ item.location }}</p>
        </div>

        <!-- Comments -->
        <div class="comments-section">
          <h1>Comments</h1>

          <div v-if="comments.length === 0" class="no-comments">No comments yet.</div>

          <div class="comment-list">
            <div v-for="comment in comments" :key="comment.id" class="comment">
              <img :src="comment.profile_url || defaultImage" alt="Profile" class="avatar-img" />
              <div class="comment-content">
                <strong>{{ comment.username || 'User' }}</strong>
                <p class="comment-text">{{ comment.text }}</p>
              </div>
            </div>
          </div>

          <!-- Comment Form -->
          <div class="comment-form">
            <img :src="currentUser.profile_url || defaultImage" alt="You" class="avatar-img" />
            <input v-model="newComment" placeholder="Post a comment..." />
            <button @click="postComment">➤</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="loading">Loading item details...</div>

    <!-- Report Modal -->
    <div v-if="showReportModal" class="modal-backdrop">
  <div class="modal">
    <h2>Report This Post</h2>
    <textarea v-model="reportReason" placeholder="Enter your reason..."></textarea>
    <div class="modal-actions">
      <button class="submit-btn" @click="submitReport">SUBMIT</button>
      <button class="cancel" @click="showReportModal = false">CANCEL</button>
    </div>
  </div>
</div>
</div>
</template>


<script>
import defaultProfile from '@/assets/images/user.png';

export default {
  data() {
    return {
      item: null,
      comments: [],
      newComment: '',
      defaultImage: defaultProfile,
      currentUser: JSON.parse(localStorage.getItem("user")) || {},
      showReportModal: false,
      reportReason: ''
    };
  },
  created() {
    const itemId = this.$route.params.id;
    this.fetchItem(itemId);
    this.fetchComments(itemId);
  },
  watch: {
    '$route.params.id': {
      handler(newId) {
        this.fetchItem(newId);
        this.fetchComments(newId);
      },
      immediate: true,
    }
  },
  methods: {
    goBack() {
      this.$router.push("/lost");
    },
    fetchItem(id) {
      fetch(`http://localhost:3000/api/lost-items/${id}`)
        .then(res => res.json())
        .then(data => {
          this.item = data;
        })
        .catch(err => {
          console.error("Failed to fetch item:", err);
        });
    },
    fetchComments(id) {
      fetch(`http://localhost:3000/api/comments/${id}`)
        .then(res => res.json())
        .then(data => {
          this.comments = data;
        })
        .catch(err => {
          console.error("Failed to fetch comments:", err);
        });
    },
    postComment() {
      if (!this.newComment.trim()) return;

      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      fetch(`http://localhost:3000/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          item_id: this.item.id,
          text: this.newComment
        })
      })
        .then(res => res.json())
        .then(() => {
          this.newComment = '';
          this.fetchComments(this.item.id);

          if (user.username !== this.item.username) {
            this.sendNotification(this.item.user_id, `${user.username} commented on your post.`);
          }
        })
        .catch(err => {
          console.error("Failed to post comment:", err);
        });
    },
    sendNotification(receiverId, message) {
      fetch("http://localhost:3000/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          receiver_id: receiverId,
          message
        })
      }).catch(err => console.error("Failed to send notification:", err));
    },
    submitReport() {
      if (!this.reportReason.trim()) {
        alert("Please enter a reason for reporting.");
        return;
      }

      console.log("Reporting item:", this.item.id, "Reason:", this.reportReason);

      // You can replace this with your backend call.
      this.reportReason = '';
      this.showReportModal = false;

      alert("Report submitted. Thank you.");
    }
  }
};
</script>



<style scoped>
.detail-wrapper {
  background-color: #f9f9f9;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.logo-image{
  margin-top: 0.4rem;
  left: 0.5rem;
  width: 48px;
  height: 48px;
  margin-left: 0.5rem;
}
.back-button {
  height: 40px;
  cursor: pointer;
  margin-right: 1rem;
  margin-bottom: 0.1rem;
}

.page-title {
  font-size: 36px;
  font-weight: 600;
  color: #222;
  font-family: 'Bebas Neue', sans-serif;
 
}

.card {
  display: flex;
  flex-direction: row;
  gap: 30px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);

}

.image-section {
  flex: 0 0 400px;
}

.item-image {
  width: 100%;
  height: 450px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.details-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.details-section strong {
font-weight: bold;
font-size: 18px;
}

.item-info p{
  font-size: 20px;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 1;
}

.comment {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  background: #f1f1f1;
  padding: 10px 12px;
  border-radius: 8px;
  color: #000000;
  margin-bottom: 10px; /* ✅ Adds spacing between each comment */
}

.comment-list {
  max-height: 200px; /* Set this to whatever fixed height you want */
  overflow-y: auto;
  margin-top: 10px;
  padding-right: 5px; /* optional: prevents scrollbar overlap with content */
}


.comments-section h1 {
  margin-left: 24rem;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 25px;


}
.avatar {
  font-size: 24px;
  margin-top: 2px;
}

.avatar-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 0.6rem;
}

.item-info strong{
  font-weight: bold;
}

.comment-content {
  display: flex;
  flex-direction: column;
}

.comment-header strong p {
  font-size: 14px;
  color: #222;
}

.comment-text {
  margin: 2px 0 0;
  font-size: 13px;
  line-height: 1.4;
  color: #444;
  
}

.comment-form {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
}

.comment-form input {
  flex: 1;
  padding: 8px 14px;
  border-radius: 20px;
  border: 1px solid #ccc;
  font-size: 14px;
}

.comment-form button {
  background-color: #d43038;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
}

.comment-form button:hover {
  background-color: #0056b3;
}

.comments-section p {
  font-size: 17px;

}


.loading {
  text-align: center;
  font-size: 18px;
  color: #777;
}


.image-hover-wrapper {
  display: inline-block; /* shrink to image size */
  position: relative;
  cursor: pointer;
}

.image-hover-wrapper:hover .item-image {
  filter: blur(3px);
  transition: filter 0.3s ease-in-out;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 20px;
  pointer-events: none; /* Let clicks through unless hovered */
}


.image-hover-wrapper:hover .image-overlay {
  opacity: 1;
  pointer-events: auto;
}

.image-hover-wrapper:hover .item-image {
  filter: blur(3px);
}

.item-image {
  display: block;
  max-width: 100%;
  width: 100%;
  height: 450px;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: filter 0.3s ease-in-out;
}
.report-icon {
  width: 50px;
  height: 50px;
  opacity: 0.9;
}

/*  Submit Modal  */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal {
  background: white;
  padding: 20px 30px;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.2);
}

.modal h2 {
  margin-bottom: 15px;
  font-size: 25px;
  font-family: 'Bebas Neue', sans-serif;
}

.modal textarea {
  width: 100%;
  min-height: 100px;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
  
}

.modal-actions button {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 15px;
  transition: background-color 0.3s ease;
}

.modal-actions .cancel {
  background-color: #ccc;
  font-weight: bold;
}

.modal-actions button:not(.cancel) {
  background-color: #d43038;
  color: white;
  font-weight: bold;
}

.modal-actions .submit-btn {
  background-color: #d43038;
  color: white;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.modal-actions .submit-btn:hover {
  background-color: #dc2626;
}


/* ✅ Add hover effect */
.modal-actions button:not(.cancel):hover {
  background-color: #dc2626;
}

@media (max-width: 768px) {
  .card {
    flex-direction: column;
  }

  .image-section {
    width: 100%;
  }

  .item-image {
    height: auto;
  }
}
</style>
