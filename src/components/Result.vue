<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { saveAs } from 'file-saver'
import IconsLoading from '@/components/icons/IconLoading.vue'
import IconImg from '@/components/icons/IconImg.vue'
import IconWave from '@/components/icons/IconWave.vue'
import IconDownload from '@/components/icons/IconDownload.vue'
import { Status, type ImgInfo } from '@/components/index.d'
import { u82img, fileToB64 } from '@/assets/compress/utils'

const props = defineProps<{ data: ImgInfo }>()

function save() {
  if (props.data.resultSize >= props.data.rawSize) {
    saveAs(props.data.rawData, props.data.name)
  } else {
    u82img(props.data.resultData).then(img => {
      saveAs(img, props.data.name)
    })
  }
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const type = computed(() => {
  // @ts-ignore
  return props.data?.type.split('/').pop().toUpperCase()
})
const ratio = computed(() => {
  const { rawSize, resultSize } = props.data
  if (!resultSize) return '0'
  return (((rawSize - resultSize) / rawSize) * -100).toFixed(2)
})

const preview = ref('')
watch(
  () => {
    return props.data.status
  },
  value => {
    if (value === 1) {
      u82img(props.data.resultData).then(img => {
        preview.value = img
      })
    }
  }
)
const rawPreview = ref('')
const myModal = ref()
async function showDiff() {
  if (props.data.status !== Status.success) return
  if (!rawPreview.value) {
    rawPreview.value = await fileToB64(props.data.rawData)
  }
  myModal.value?.showModal()
}
</script>

<template>
  <div class="w-full flex items-center">
    <div
      class="w-12 h-12 rounded-md bg-teal-50 mr-5 overflow-hidden flex cursor-pointer hover:opacity-90 active:opacity-70"
      @click="showDiff">
      <div v-if="data.status === 0" class="m-auto w-6 h-6">
        <IconsLoading class="w-full h-full"></IconsLoading>
      </div>
      <div v-else-if="data.status === 2" class="m-auto w-6 h-6 text-red-500">
        <IconImg class="w-full h-full"></IconImg>
      </div>
      <img v-else class="object-cover w-full h-full" :src="preview" :alt="data.name" />
    </div>

    <div>
      <div class="font-bold pb-1">{{ data.name }}</div>
      <div class="flex items-center">
        <div class="w-14 text-center text-[#039c93] bg-[#f2fafa] rounded-sm px-2 mr-2 font-bold">
          {{ type }}
        </div>
        <div>{{ formatFileSize(data.rawSize) }}</div>
      </div>
    </div>
    <div class="ml-auto flex items-center">
      <div v-if="data.status === 0" class="w-6 h-6 text-emerald-400 mr-2">
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
        :disabled="data.status === 0 || data.status === 2"
        @click="save">
        <div class="w-3 mr-2">
          <IconDownload />
        </div>
        <div class="w-10 font-bold">{{ type }}</div>
      </button>
    </div>
    <dialog ref="myModal" class="modal">
      <div class="modal-box max-w-5xl">
        <h3 class="text-lg font-bold pb-2">Comparison results</h3>
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>
        </form>
        <div class="diff aspect-[16/9]">
          <div
            class="diff-item-1 after:shadow-md after:bg-no-repeat after:bg-cover after:bg-[url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0iTTkuNzEgNi4yOWExIDEgMCAwIDAtMS40MiAwbC01IDVhMSAxIDAgMCAwIDAgMS40Mmw1IDVhMSAxIDAgMCAwIDEuNDIgMCAxIDEgMCAwIDAgMC0xLjQyTDUuNDEgMTJsNC4zLTQuMjlhMSAxIDAgMCAwIDAtMS40Mm0xMSA1LTUtNWExIDEgMCAwIDAtMS40MiAxLjQybDQuMyA0LjI5LTQuMyA0LjI5YTEgMSAwIDAgMCAwIDEuNDIgMSAxIDAgMCAwIDEuNDIgMGw1LTVhMSAxIDAgMCAwIDAtMS40MiIvPjwvc3ZnPg==)]">
            <img alt="daisy" :src="preview" />
          </div>
          <div class="diff-item-2 shadow-md">
            <img alt="daisy" :src="rawPreview" />
          </div>
          <div class="diff-resizer"></div>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped></style>
