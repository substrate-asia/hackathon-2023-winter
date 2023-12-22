<template>
    <div id="app">
        <el-container>
            <el-header>
                <a href="http://web-ass3bly.vercel.app">
                    <img width="150px" style="margin-right: 4px;" src="../assets/logo.jpg" />
                </a>
            </el-header>
            <el-container style="display: flex; flex-direction: row-reverse;">
                <el-aside style="line-height: normal;" width="300px">
                    <Profile />
                    <Graph />
                    <VotingButton />
                    <Comment />
                </el-aside>
                <el-main style="line-height: normal;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <i class="el-icon-s-comment" style="font-size: 2rem;"></i>
                        <div style="display: flex; gap: 20px;">
                            <i class="el-icon-star-off icon-transition"
                                :style="{ fontSize: '2rem', color: isStarActive ? 'red' : 'inherit' }"
                                @click="toggleStar"></i>
                            <i class="el-icon-download" style="font-size: 2rem;"></i>
                            <i class="el-icon-collection" style="font-size: 2rem;"></i>
                        </div>
                    </div>
                    <RichText :readOnly="true" />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
  
<script>
// import Profile from "@/components/Profile.vue";
import Profile from "@/components/PolkadotProfile.vue"
import RichText from "@/components/RichText.vue";
import Comment from '@/components/Comment.vue'
import VotingButton from '@/components/VotingButton.vue'
import Graph from "@/components/Graph.vue";


export default {
    name: "App",
    components: {
        Graph,
        RichText,
        Profile,
        Comment,
        VotingButton
    },
    data() {
        return {
            id: 1,
            isStarActive: false
        }
    },
    methods: {
        toggleStar() {
            this.isStarActive = !this.isStarActive
        },
        getGraphById() {
            
        },
        goToMain() {
            this.$router.push('/');
        }

    },

};
</script>
  
<style>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin: 40px;
}

header {
    align-items: center;
    display: flex;
    margin-bottom: 5px;
    width: 100%;
}

.el-header,
.el-footer {
    background-color: #FFF;
    color: #333;
    text-align: center;
    line-height: 60px;
}

.el-aside {
    background-color: #FFF;
    color: #333;
    text-align: center;
    line-height: 200px;
}

.el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
}

body>.el-container {
    margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
    line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
    line-height: 320px;
}

.icon-transition {
    transition: color 0.3s;
}
</style>
