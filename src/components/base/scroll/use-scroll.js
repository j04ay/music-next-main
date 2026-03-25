import BScroll from '@better-scroll/core'
import { onMounted, onUnmounted, ref, onActivated, onDeactivated } from 'vue'
import ObserveDOM from '@better-scroll/observe-dom'

BScroll.use(ObserveDOM)
export default function useScroll(wrapperRef, options, emit) {
  const scroll = ref(null)
  onMounted(() => {
    scroll.value = new BScroll(wrapperRef.value, {
      ...options,
      observeDOM: true
    })
    if (options?.probeType > 0) {
      scroll.value.on('scroll', (pos) => {
        emit('scroll', pos)
      })
    }
  })
  onUnmounted(() => {
    if (scroll.value) scroll.value.destroy()
  })
  onActivated(() => {
    if (scroll.value) {
      scroll.value.enable()
      scroll.value.refresh()
    }
  })
  onDeactivated(() => {
    if (scroll.value) scroll.value.disable()
  })
  return {
    scroll
  }
}
