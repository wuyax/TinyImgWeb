<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef, type Ref } from 'vue'
import { compress, WorkerManager } from '@/assets/compress/index'

// import Worker from '../assets/compress/compress_worker.ts?worker'
const manager = new WorkerManager(3)

const b64Img = shallowRef('')
const ratio = ref('--')

function fileChange(event: any) {
  console.log(Array.from(event.target.files))
  console.log(event.target.files.length)
  const file = event.target.files[0]
  if (file) {
    // compressFile(file)
    const sourthFileSize = file.size
    compress(file)
      .then(imgData => {
        b64Img.value = imgData.toBase64()
        const size = imgData.size()
        ratio.value = (((sourthFileSize - size) / sourthFileSize) * 100).toFixed(2)
        console.log(sourthFileSize, size)

        /* const file = imgData.toFile()
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64String = e.target.result;
          b64Img.value = base64String;
        };
        reader.readAsDataURL(file); */
      })
      .catch(errCode => {
        console.log(errCode)
      })
  }
}

const fileInput: Ref<HTMLInputElement | undefined> = ref()
const dropzone: Ref<HTMLDivElement | undefined> = ref()
const events = ['dragenter', 'dragover', 'dragleave', 'drop']
function preventDefaults(e) {
  e.preventDefault()
  e.stopPropagation()
}

function handleDrop(e) {
  const dt = e.dataTransfer
  const files = dt.files
  console.log(files)

  Array.from(files as File[]).map(file => {
    manager.compress(file).then(imgData => {
      b64Img.value = imgData.toBase64()
      const size = imgData.size()

      console.log(size, b64Img.value)
    })
  })

  // handleFiles(files)
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
</script>

<template>
  <main>
    <section class="section banner relative py-16">
      <div class="container">
        <div class="row items-center flex flex-wrap">
          <div class="w-1/2">
            <h1 class="banner-title text-5xl font-serif">
              Scale design & dev operations with Avocode Enterprise
            </h1>
            <p class="mt-6">
              A fully integrated suite of authentication & authoriz products, Stytch’s platform
              removes the headache of.
            </p>
            <a
              class="btn btn-white mt-8 inline-block h-[52px] border px-8 py-2 text-sm font-medium leading-[36px] transition-all duration-200"
              href="#"
              >Download</a
            >
          </div>
          <div class="w-1/2 h-96 p-10">
            <div
              ref="dropzone"
              class="w-full h-full flex flex-col justify-center items-center p-6 border-2 border-dashed border-gray-400 rounded-lg bg-orange-100 bg-opacity-25 backdrop-blur-sm text-center">
              <input type="file" ref="fileInput" class="hidden" multiple @change="fileChange" />
              <p class="text-gray-500">拖动文件到此处或点击上传</p>
              <button
                id="uploadButton"
                class="inline-block h-14 border px-8 py-2 text-sm font-medium rounded-full bg-white mt-4"
                @click.stop="openFileSelect">
                选择文件
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
    <!-- <div class="pt-4">
      <input type="file" accept=".png, .jpeg, .jpg, .webp" @change="fileChange" />
    </div> -->
    <!-- <div class="min-h-screen flex items-center justify-center bg-gray-100"></div> -->
    <div>
      <img id="img" :src="b64Img" alt="" />
    </div>
    <div>压缩率: {{ ratio }} %</div>
  </main>
</template>
