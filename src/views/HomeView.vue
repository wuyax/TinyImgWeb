<script setup lang="ts">
import { BlobWriter, ZipWriter, Uint8ArrayReader, BlobReader } from '@zip.js/zip.js'
import { saveAs } from 'file-saver'
import { Status } from '@/components/index.d'
import { useImageStore } from '@/stores/image'
import Result from '@/components/Result.vue'
import DropBox from '@/components/DropBox.vue'
import Tree from '@/components/Tree/Index.vue'

const store = useImageStore()
const { clearImages } = store

async function downloadAll() {
  const zipFileWriter = new BlobWriter()
  const zipWriter = new ZipWriter(zipFileWriter)
  for (let i = 0; i < store.images.length; i++) {
    const img = store.images[i]
    if (img.status === Status.success && img.rawSize > img.resultSize) {
      // 压缩成功
      const imgReader = new Uint8ArrayReader(img.resultData)
      await zipWriter.add(img.name, imgReader)
    } else {
      const rawFile = new BlobReader(img.rawData)
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
            <DropBox></DropBox>
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
    <section v-if="store.images.length > 1" class="pb-3">
      <div class="container flex justify-end">
        <button
          class="bg-red-500 hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300 active:bg-red-700 px-5 py-2 text-sm leading-5 rounded-full font-semibold text-white mr-3 disabled:bg-gray-400"
          :disabled="!store.finish"
          @click="clearImages">
          清除全部
        </button>
        <button
          class="bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring focus:ring-emerald-300 active:bg-emerald-700 px-5 py-2 text-sm leading-5 rounded-full font-semibold text-white disabled:bg-gray-400"
          :disabled="!store.finish"
          @click="downloadAll">
          下载全部
        </button>
      </div>
    </section>
    <!-- <section class="pb-10">
      <ul class="container divide-y divide-slate-200 dark:divide-stone-700 p-3">
        <li class="first:pt-0 last:pb-0 py-3" v-for="data in store.images">
          <Result :data="data"></Result>
        </li>
      </ul>
    </section> -->

    <section class="pb-10">
      <div class="container">
        <Tree :treeData="store.images"></Tree>
      </div>
    </section>
  </main>
</template>
