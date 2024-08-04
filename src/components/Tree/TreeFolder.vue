<script setup lang="ts">
import { inject } from 'vue'
const props = defineProps<{
  name: string | undefined
  isOpen: boolean
  isRootFolder: boolean
  rfn: string
}>()

defineEmits(['toggle'])

const downloadInject = inject<(p: string) => void>('download')
function download() {
  downloadInject?.(props.rfn)
}
</script>

<template>
  <div
    class="flex items-center justify-between w-full py-2 rounded font-bold bg-slate-100 cursor-pointer px-3"
    @click="$emit('toggle')">
    <div class="flex items-center">
      <div class="font-bold mr-4">{{ name }}</div>
      <button v-if="isRootFolder" class="btn btn-xs btn-success text-white" @click.stop="download">
        Download
      </button>
    </div>
    <div>
      <span>[{{ isOpen ? '-' : '+' }}]</span>
    </div>
  </div>
</template>

<style scoped></style>
