<template>
  <div class="singer-wrapper">
    <div class="singer">
      <index-list :data="singers" @select="selectSinger"></index-list>
    </div>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger"></component>
      </transition>
    </router-view>
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer'
import IndexList from '@/components/base/index-list/index-list.vue'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'
export default {
  name: 'singer',
  components: {
    IndexList
  },
  data() {
    return {
      singers: [],
      selectedSinger: null
    }
  },
  methods: {
    selectSinger(singer) {
      this.selectedSinger = singer
      this.cacheSinger(singer)
      this.$router.push({
        path: `/singer/${singer.mid}`
      })
    },
    cacheSinger(singer) {
      storage.session.set(SINGER_KEY, singer)
    }
  },
  async created() {
    try {
      const result = await getSingerList()
      console.log(result)
      this.singers = result?.singers ?? []
    } catch (e) {
      console.error(e)
      this.singers = []
    }
  }
}
</script>

<style lang="scss" scoped>
.singer-wrapper {
  position: fixed;
  width: 100%;
  top: 88px;
  left: 0;
  right: 0;
  /* bottom 由 App 传入的 style 提供 */
}

.singer {
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
}
</style>
