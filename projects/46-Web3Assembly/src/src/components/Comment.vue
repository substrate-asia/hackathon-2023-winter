<template>
    <div class="comment-box">
      <el-row style="line-height: normal;">
        <el-col :span="24" class="col-content">
          <div class="comments-view" ref="commentsView">
            
            <!-- fake data -->
            <div class="comment">
              <div class="avatar-container">
                <img src="../assets/avatar1.jpg" alt="Avatar" class="comment-avatar">
              </div>
              <div class="comment-text">
                  <div class="name">cool.eth</div>
                  <div class="comment-text">good!</div>
              </div>
            </div>
            <div class="comment">
              <div class="avatar-container">
                <img src="../assets/avatar2.jpg" alt="Avatar" class="comment-avatar">
              </div>
              <div class="comment-text">
                  <div class="name">0xade123434...5dfe</div>
                  <div class="comment-text">impressive</div>
              </div>
            </div>
            <div class="comment">
              <div class="avatar-container">
                <img src="../assets/avatar3.jpg" alt="Avatar" class="comment-avatar">
              </div>
              <div class="comment-text">
                <div class="name">aos.eth</div>
                <div class="comment-text">really good intro</div>
               </div>
            </div>
            <!-- end fake data -->

            <div v-for="comment in comments" :key="comment.id" class="comment">
              <!-- <img :src="comment.avatar" alt="Avatar" class="comment-avatar"> -->
              <div class="avatar-container">
                <img src="../assets/wonderpal3981.png" alt="Avatar" class="comment-avatar">
              </div>
              <div class="comment-text">
                <div class="name">{{ comment.name }}</div>
                <div class="comment-text">{{ comment.text }}</div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-input v-model="newCommentText" placeholder="Comments here~"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-edit" circle @click="addComment"></el-button>
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        newCommentText: '',
        comments: [],
        testComments: [{
          id: 123,
          name: "cool.eth",
          avatar: "../assets/avatar1.jpg",
          text: "really impressive"
        },{
          id: 124,
          name: "0xade123434...5dfe",
          avatar: "../assets/avatar2.jpg",
          text: "really impressive"
        },{
          id: 125,
          name: "aos.eth",
          avatar: "../assets/avatar3.jpg",
          text: "really impressive"
        }]
      };
    },
    mounted() {
      this.loadComments();
    },
    methods: {
      addComment() {
        if (!this.newCommentText.trim()) return;
  
        const newComment = {
          id: Date.now(),
          name: "tian.eth",
          avatar: "wonderpal3981.png",
          text: this.newCommentText.trim()
        };
  
        this.comments.push(newComment);
        this.newCommentText = '';
        this.saveComments();
      },
      loadComments() {
        const comments = localStorage.getItem('vue-comments');
        if (comments) {
          this.comments = JSON.parse(comments);
        }
      },
      saveComments() {
        localStorage.setItem('vue-comments', JSON.stringify(this.comments));
      }
    }
  };
  </script>
  
<style scoped>
.avatar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
}
.comment-box {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.comments-view {
  height: 280px;
  width: 100%;
  overflow-y: scroll;
  margin-bottom: 20px;
}
.comment {
  display: flex;
  align-items: center;
  padding: 5px 0;
  border: 1px solid #eee;
  border-radius: 5%;
}
.comment:not(:last-child) {
  margin-bottom: 5px;
}
.comment-avatar {
    width: 40px; /* Adjust as needed */
    height: 40px; /* Adjust as needed */
    border-radius: 50%;
}
.comment-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.col-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.name {
    font-weight: bold;
    margin-bottom: 1px; /* Adjust as needed */
}
.comment-text {
    font-size: 14px; /* Adjust as needed */
}
</style>
  