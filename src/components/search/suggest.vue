<template>
  <div
  ref="rootRef"
  class="suggest"
  v-loading:[loadingText]="loading"
  v-no-result:[noResultText]="noResult"
  >
    <ul class="suggest-list">
      <li class="suggest-item"
      v-if="singer"
      @click="selectSinger(singer)"
      >
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li class="suggest-item"
      v-for="song in songs"
      :key="song.id"
      @click="selectSong(song)"
      >
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">
            {{ song.singer }}-{{ song.name }}
          </p>
        </div>
    </li>
    <div
      class="suggest-item"
      v-loading:[loadingText]="pullUpLoading"
    ></div>
    </ul>
  </div>
</template>

<script>
import { ref, watch, computed, nextTick } from 'vue'
import { search } from '@/service/search'
import { processSongs } from '@/service/song'
import usePullUpLoad from './use-pull-up-load'
export default {
  name: 'suggest',
  props: {
    query: String,
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  emits: ['select-song', 'select-singer'],
  setup(props, { emit }) {
    const singer = ref(null)
    const songs = ref([])
    const hasMore = ref(true)
    const page = ref(1)
    const loadingText = ref('')
    const searching = ref(false)
    const manualLoading = ref(false)
    const preventPullUpLoad = computed(() => {
      return manualLoading.value || loading.value
    })
    const { rootRef, isPullUpLoad, scroll } = usePullUpLoad(searchMore, preventPullUpLoad)
    const pullUpLoading = computed(() => {
      return isPullUpLoad.value && hasMore.value
    })
    const loading = computed(() => {
      return searching.value && !singer.value && !songs.value.length
    })
    const noResultText = ref('抱歉，暂无搜索结果')
    const noResult = computed(() => {
      return !singer.value && !songs.value.length && !hasMore.value
    })
    watch(() => props.query, async (newQuery) => {
      if (!newQuery) {
        return
      }
      await searchFirst()
    })
    async function searchFirst() {
      if (!props.query) {
        return
      }
      page.value = 1
      songs.value = []
      singer.value = null
      hasMore.value = true
      searching.value = true
      try {
        const result = await search(props.query, page.value, props.showSinger)
        if (!result) {
          songs.value = []
          singer.value = null
          hasMore.value = false
          return
        }
        songs.value = await processSongs(result.songs || [])
        singer.value = result.singer || null
        hasMore.value = result.hasMore !== false
        await nextTick()
        await makeItScrollable()
      } finally {
        searching.value = false
      }
    }
    async function searchMore() {
      if (!hasMore.value || !props.query) {
        return
      }
      page.value++
      const result = await search(props.query, page.value, props.showSinger)
      if (!result || !result.songs) return
      songs.value = songs.value.concat(await processSongs(result.songs))
      hasMore.value = result.hasMore !== false
      await nextTick()
      await makeItScrollable()
    }
    async function makeItScrollable() {
      if (scroll.value.maxScrollY >= -1) {
        manualLoading.value = true
        await searchMore()
        manualLoading.value = false
      }
    }
    function selectSong(song) {
      emit('select-song', song)
    }
    function selectSinger(singer) {
      emit('select-singer', singer)
    }
    return {
      singer,
      songs,
      loading,
      loadingText,
      noResult,
      noResultText,
      rootRef,
      isPullUpLoad,
      pullUpLoading,
      makeItScrollable,
      selectSong,
      selectSinger
    }
  }
}
</script>

<style lang="scss" scoped>
  .suggest {
    height: 100%;
    overflow: hidden;
    touch-action: none; /* 由 BetterScroll 接管触摸，避免冲突 */
    touch-action: none; /* 由 BetterScroll 处理触摸 */
    touch-action: pan-y; /* 移动端触摸滚动 */
    .suggest-list {
      padding: 0 30px;
      .suggest-item {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        .icon {
          flex: 0 0 30px;
          width: 30px;
          [class^="icon-"] {
            font-size: 14px;
            color: $color-text-d;
          }
        }
        .name {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-d;
          overflow: hidden;
          .text {
            @include no-wrap();
          }
        }
      }
    }
  }
</style>
