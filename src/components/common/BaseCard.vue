<template>
  <div :class="['card', 'bg-white', 'dark:bg-gray-800', 'text-gray-900', 'dark:text-gray-100', 'w-full', noTopRadius ? 'no-top-radius' : '']">
    <!-- 標題插槽 -->
    <div v-if="$slots.header" class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <slot name="header" />
    </div>

    <!-- 默認內容插槽 -->
    <div class="px-6 py-4">
      <slot />
    </div>

    <!-- 底部插槽 -->
    <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps({
  noTopRadius: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.card {
  border-radius: 12px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}
.no-top-radius {
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
}
</style>
