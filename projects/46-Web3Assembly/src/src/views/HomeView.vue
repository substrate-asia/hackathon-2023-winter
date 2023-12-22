<template>
  <div>
    <FirstPage>
    </FirstPage>
  </div>
</template>

<script>
// @ is an alias to /src
import FirstPage from '@/components/FirstPage.vue'
// import Profile from '@/components/Profile.vue'
import Profile from '@/components/PolkadotProfile.vue'
import Comment from '@/components/Comment.vue'
import VotingButton from '@/components/VotingButton.vue'

export default {
    name: 'HomeView',
    components: {
      FirstPage,
      Profile,
      Comment,
      VotingButton
  }
}
</script>
