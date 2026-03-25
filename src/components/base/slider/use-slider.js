import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import { onMounted, onUnmounted, ref, nextTick, onActivated, onDeactivated } from 'vue'

BScroll.use(Slide)

export default function useSlider(wrapperRef) {
  const slider = ref(null)
  const currentPageIndex = ref(0)
  onMounted(() => {
    nextTick(() => {
      if (!wrapperRef.value || !wrapperRef.value.querySelector('.slider-page')) return
      const sliderVal = slider.value = new BScroll(wrapperRef.value, {
        click: true,
        scrollX: true,
        scrollY: false,
        momentum: false,
        bounce: false,
        probeType: 2,
        slide: true
      })
      sliderVal.on('slidePageChanged', (page) => {
        currentPageIndex.value = page.pageX
      })
      nextTick(() => sliderVal.refresh())
    })
  })

  onUnmounted(() => {
    if (slider.value) slider.value.destroy()
  })
  onActivated(() => {
    if (slider.value) {
      slider.value.enable()
      slider.value.refresh()
    }
  })
  onDeactivated(() => {
    if (slider.value) slider.value.disable()
  })
  return {
    slider,
    currentPageIndex
  }
}
