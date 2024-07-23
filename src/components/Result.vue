<script setup lang="ts">
import { computed } from 'vue'
import { saveAs } from 'file-saver'
import IconsLoading from '@/components/icons/IconLoading.vue'
import IconImg from '@/components/icons/IconImg.vue'
import IconWave from '@/components/icons/IconWave.vue'
const props = defineProps<{ data: any }>()

function save() {
  saveAs(props.data.data, props.data.name)
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const type = computed(() => {
  return props.data.type.split('/').pop().toUpperCase()
})
const ratio = computed(() => {
  if (!props.data.resultSize) {
    return '0'
  }
  return (((props.data.size - props.data.resultSize) / props.data.size) * -100).toFixed(2)
})
</script>

<template>
  <div class="w-full flex items-center">
    <div class="w-12 h-12 rounded-md bg-teal-50 mr-5 overflow-hidden flex">
      <div v-if="data.statu === 0" class="m-auto w-6 h-6">
        <IconsLoading class="w-full h-full"></IconsLoading>
      </div>
      <div v-else-if="data.statu === 2" class="m-auto w-6 h-6 text-red-500">
        <IconImg class="w-full h-full"></IconImg>
      </div>
      <img v-else class="object-cover w-full h-full" :src="data.data" alt="" />
    </div>

    <div>
      <div class="font-bold pb-1">{{ data.name }}</div>
      <div class="flex items-center">
        <div class="w-14 text-center text-[#039c93] bg-[#f2fafa] rounded-sm px-2 mr-2 font-bold">
          {{ type }}
        </div>
        <div>{{ formatFileSize(data.size) }}</div>
      </div>
    </div>
    <div class="ml-auto flex items-center">
      <div v-if="data.statu === 0" class="w-6 h-6 text-emerald-400 mr-2">
        <IconWave class="w-full h-full"></IconWave>
      </div>
      <div v-else class="flex flex-col justify-end items-end mr-2">
        <div class="font-bold pb-1" :class="[!ratio.startsWith('-') ? 'text-red-600' : '']">
          {{ ratio }}%
        </div>
        <div class="">{{ formatFileSize(data.resultSize) }}</div>
      </div>
      <button
        class="bg-[#f2fafa] text-[#039c93] flex items-center h-8 px-3 rounded-e-lg hover:bg-[#cdebe9] disabled:bg-gray-100 disabled:text-gray-400 transition-all duration-150"
        :disabled="data.statu === 0 || data.statu === 2"
        @click="save">
        <div class="w-3 mr-2">
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="file-arrow-down"
            class="svg-inline--fa fa-file-arrow-down fa-flip-horizontal"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512">
            <path
              fill="currentColor"
              d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM216 232V334.1l31-31c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-72 72c-9.4 9.4-24.6 9.4-33.9 0l-72-72c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l31 31V232c0-13.3 10.7-24 24-24s24 10.7 24 24z"></path>
          </svg>
        </div>
        <div class="w-10 font-bold">{{ type }}</div>
      </button>
    </div>
  </div>
</template>

<style scoped></style>
