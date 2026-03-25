<template>
  <div ref="rootRef" class="scroll-wrapper">
    <slot></slot>
  </div>
</template>

<script>
  import useScroll from './use-scroll'
  import { ref } from 'vue'

  export default {
    name: 'scroll',
    props: {
      click: {
        type: Boolean,
        default: true
      },
      probeType: {
        type: Number,
        default: 0
      }
    },
    emits: ['scroll'],
    setup(props, context) {
      const { emit } = context
      const rootRef = ref(null)
      const { scroll } = useScroll(rootRef, {
        click: props.click,
        probeType: props.probeType
      }, emit)
      return {
        rootRef,
        scroll
      }
    }
  }
</script>

<style scoped>
.scroll-wrapper {
  /* 移动端：manipulation 允许触摸滚动，PC 端配合 mouseWheel 插件 */
  touch-action: manipulation;
  -webkit-overflow-scrolling: touch;
}
</style>
