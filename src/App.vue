<template>
<m-header></m-header>
<tab></tab>
<router-view :style="viewStyle" v-slot="{ Component }">
  <keep-alive>
    <component :is="Component" />
  </keep-alive>
</router-view>
<player></player>
</template>

<script>
import Header from '@/components/header/header.vue'
import Tab from '@/components/tab/tab.vue'
import Player from '@/components/player/player.vue'
import { mapState } from 'vuex'
export default {
  components: {
    MHeader: Header,
    Tab,
    Player
  },
  computed: {
    ...mapState([
      'playlist'
    ]),
    viewStyle() {
      const bottom = this.playlist.length ? '60px' : '0'
      return {
        bottom
      }
    }
  }
}

</script>
<style lang="scss">

</style>
