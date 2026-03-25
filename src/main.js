import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueLazyload from 'vue3-lazy'
import '@/assets/scss/index.scss'
import loadingDirective from '@/components/base/loading/directive.js'
import noResultDirective from '@/components/base/no-result/directive.js'
import { load, saveAll } from '@/assets/js/array-store'
import { PLAY_KEY, FAVORITE_KEY } from '@/assets/js/constant'
import { processSongs } from '@/service/song'

const favoriteSongs = load(FAVORITE_KEY)
if (favoriteSongs.length > 0) {
  processSongs(favoriteSongs).then((songs) => {
    store.commit('setFavoriteList', songs)
    saveAll(songs, FAVORITE_KEY)
  })
}

const historySongs = load(PLAY_KEY)
if (historySongs.length > 0) {
  processSongs(historySongs).then((songs) => {
    store.commit('setPlayHistory', songs)
    saveAll(songs, PLAY_KEY)
  })
}
const app = createApp(App)
app.use(store).use(router)
app.use(VueLazyload, {
  loading: require('@/assets/images/default.png'),
  error: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
})
app.directive('loading', loadingDirective)
app.directive('no-result', noResultDirective)
app.mount('#app')
