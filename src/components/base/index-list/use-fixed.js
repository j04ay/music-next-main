import { ref, watch, nextTick, computed } from 'vue'
export default function useFixed(props) {
  const groupRef = ref(null)
  const listHeights = ref([])
  const scrollY = ref(0)
  const currentIndex = ref(0)
  const distance = ref(0)
  const TITLE_HEIGHT = 30
  watch(() => props.data, async () => {
    await nextTick()
    calculate()
  })
  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return ''
    }
    const currentGroup = props.data[currentIndex.value]
    return currentGroup ? currentGroup.title : ''
  })
  watch(scrollY, (scrollYVal) => {
    for (let i = 0; i < listHeights.value.length - 1; i++) {
      const heightTop = listHeights.value[i]
      const heightBottom = listHeights.value[i + 1]
      if (scrollYVal >= heightTop && scrollYVal <= heightBottom) {
        currentIndex.value = i
        distance.value = heightBottom - scrollYVal
      }
    }
  })
  const fixedStyle = computed(() => {
    const distanceVal = distance.value
    const diff = (distanceVal > 0 && distanceVal < TITLE_HEIGHT)
      ? distanceVal - TITLE_HEIGHT
      : 0
    return {
      transform: `translate3d(0,${diff}px,0)`
    }
  })
  function calculate() {
    const list = groupRef.value.children
    let height = 0
    listHeights.value.length = 0
    listHeights.value.push(height)
    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight
      listHeights.value.push(height)
    }
  }

  function onScroll(pos) {
    scrollY.value = -pos.y
  }

  return {
    groupRef,
    onScroll,
    currentIndex,
    fixedTitle,
    fixedStyle
  }
}
