<script setup lang="ts">
import { saveAs } from 'file-saver'
import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { WorkerManager } from '@/assets/compress/index'
import Result from '@/components/Result.vue'
import { uId, fileToBlob, fileToB64 } from '@/assets/compress/utils'
import { BlobWriter, ZipWriter, Data64URIReader, BlobReader } from '@zip.js/zip.js'

enum Statu {
  compressing,
  success,
  error
}

interface ImgInfo {
  id: any
  name: string
  size: number
  type: string
  resultSize: number
  statu: Statu
  data: any
}

const dataStruct = [
  {
    id: '123',
    folder: false,
    name: 'test.png',
    size: 1233,
    type: 'image/png',
    resultSize: 1100,
    statu: Statu.compressing,
    data: ''
  },
  {
    id: '123',
    folder: true,
    name: 'test.zip',
    size: 1233,
    type: 'application/zip',
    resultSize: 1100,
    statu: Statu.compressing,
    data: '',
    children: [
      {
        id: '1234',
        folder: false,
        name: 'test.png',
        size: 1233,
        type: 'image/png',
        resultSize: 1100,
        statu: Statu.compressing,
        data: ''
      }
    ]
  }
]

const manager = new WorkerManager(3)
// @ts-ignore
window.manager = manager

const uploadFiles = ref<ImgInfo[]>([])

const fileInput: Ref<HTMLInputElement | undefined> = ref()
const dropzone: Ref<HTMLDivElement | undefined> = ref()
const events = ['dragenter', 'dragover', 'dragleave', 'drop']
function preventDefaults(e: any) {
  e.preventDefault()
  e.stopPropagation()
}

function fileChange(event: any) {
  const files = event.target.files
  handleFiles(files)
}

function handleDrop(e: any) {
  const files = e.dataTransfer.files
  // 检查文件类型
  /* for (const file of files) {
    if (!file.type.startsWith('image/')) {
      // 仅允许图片类型
      alert('只允许上传图片文件')
      return
    }
  } */
  handleFiles(files)
}

function compress(file: File, id: string) {
  manager
    .compress(file)
    .then(async imgData => {
      const data = imgData.toBase64()
      const size = imgData.size()

      // console.log(size, b64Img.value)
      // ({resultSize: size, data, id })
      const findFile = uploadFiles.value.find(f => {
        return f.id === id
      })
      if (findFile) {
        if (size > findFile.size) {
          findFile.resultSize = findFile.size
          findFile.data = await fileToB64(file)
          findFile.statu = Statu.success
        } else {
          findFile.resultSize = size
          findFile.data = data
          findFile.statu = Statu.success
        }
      }
    })
    .catch(async errCode => {
      console.log('文件压缩发生错误了', errCode, id)
      const findFile = uploadFiles.value.find(f => {
        return f.id === id
      })
      if (findFile) {
        findFile.data = await fileToBlob(file)
        findFile.statu = Statu.error
      }
    })
}
function handleFiles(files: any) {
  console.log(files)
  const fileInfos = Array.from(files as File[])
    .filter(file => file.type.startsWith('image/'))
    .map(file => {
      // console.log(file)
      const id = uId()
      compress(file, id)

      return {
        id,
        name: file.name,
        size: file.size,
        type: file.type,
        resultSize: 0,
        statu: Statu.compressing,
        data: ''
      }
    })

  uploadFiles.value.push(...fileInfos)
}
onMounted(() => {
  events.forEach(eventName => {
    dropzone.value?.addEventListener(eventName, preventDefaults, false)
  })

  dropzone.value?.addEventListener('drop', handleDrop, false)
})

function openFileSelect() {
  fileInput.value?.click()
}
onBeforeUnmount(() => {
  manager.kill()
})

function clearAll() {
  uploadFiles.value = []
}

async function downloadAll() {
  const zipFileWriter = new BlobWriter()
  const zipWriter = new ZipWriter(zipFileWriter)
  for (let i = 0; i < uploadFiles.value.length; i++) {
    const img = uploadFiles.value[i]
    if (img.statu === Statu.success) {
      // 压缩成功
      const imgReader = new Data64URIReader(img.data)
      await zipWriter.add(img.name, imgReader)
    } else {
      const rawFile = new BlobReader(img.data)
      await zipWriter.add(img.name, rawFile)
    }
  }
  const data = await zipWriter.close()
  saveAs(data, 'download.zip')
}
</script>

<template>
  <main>
    <section class="section banner relative py-16">
      <div class="container">
        <div class="row items-center flex flex-wrap">
          <div class="w-1/2">
            <h1 class="banner-title text-5xl font-serif">
              Smart <span class="line-through">WebP</span>, PNG and JPEG Compression for Faster
              Websites
            </h1>
            <p class="mt-6">
              Tailored solutions for website owners, developers, and designers, ensuring optimal
              website performance for every project. Discover the advantages of faster loading times
              with our image optimization tools.
            </p>
          </div>
          <div class="w-1/2 h-96 p-5">
            <div class="h-full p-5 rounded-lg bg-orange-100 bg-opacity-25 backdrop-blur-sm">
              <button
                ref="dropzone"
                class="w-full h-full flex flex-col justify-center items-center p-6 border-2 border-dashed border-blue-500 border-opacity-50 text-center rounded-lg hover:bg-orange-100 hover:bg-opacity-25 hover:backdrop-blur-sm"
                @click.stop="openFileSelect">
                <input
                  type="file"
                  accept="image/*"
                  ref="fileInput"
                  class="hidden"
                  multiple
                  @change="fileChange" />
                <p class="flex flex-col">
                  <span class="text-lg font-bold pb-1">Drop your images here!</span>
                  <span class="text-gray-500">Convert images automatically</span>
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <img
          class="banner-shape absolute -top-28 right-0 -z-[1] w-full max-w-[30%]"
          src="/images/banner-shape.svg"
          alt="" />
      </div>
    </section>
    <!-- <section>
      <div class="container">
        <button class="border px-2" @click="save">保存图片</button>
        <img id="img" :src="b64Img" alt="" />
        <div>压缩率: {{ ratio }} %</div>
      </div>
    </section> -->
    <section v-if="uploadFiles.length > 1" class="pb-3">
      <div class="container flex justify-end">
        <button
          class="bg-red-500 hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300 active:bg-red-700 px-5 py-2 text-sm leading-5 rounded-full font-semibold text-white mr-3"
          @click="clearAll">
          清除全部
        </button>
        <button
          class="bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring focus:ring-emerald-300 active:bg-emerald-700 px-5 py-2 text-sm leading-5 rounded-full font-semibold text-white"
          @click="downloadAll">
          下载全部
        </button>
      </div>
    </section>
    <section>
      <ul class="container divide-y divide-slate-200 dark:divide-stone-700 p-3">
        <li class="first:pt-0 last:pb-0 py-3" v-for="data in uploadFiles">
          <Result :data="data"></Result>
        </li>
      </ul>
    </section>
  </main>
</template>
