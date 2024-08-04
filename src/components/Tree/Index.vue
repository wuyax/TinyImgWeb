<!--
A nested tree component that recursively renders itself.
You can double click on an item to turn it into a folder.
-->

<script lang="ts" setup>
import { provide } from 'vue'
import { saveAs } from 'file-saver'
import zips from '../zip-manager'
import TreeItem from './TreeItem.vue'
import { useImageStore } from '@/stores/image'

defineProps<{ treeData: any }>()

const { getSuccessedImg } = useImageStore()
/* const treeData = ref([
  {
    uid: 'co7BjL',
    id: 1,
    pid: 0,
    directory: true,
    rfn: '_tacit',
    name: 'Downloads',
    type: 'application/octet-stream',
    status: 0,
    rawSize: 0,
    rawData: null,
    resultSize: 0,
    resultData: null,
    children: [
      {
        uid: 'iThXt5',
        id: 2,
        pid: 1,
        directory: false,
        rfn: '_tacit',
        name: 'download (12).png',
        type: 'image/png',
        status: 0,
        rawSize: 15254,
        rawData: null,
        resultSize: 0,
        resultData: null,
        children: []
      },
      {
        uid: 'skxDXi',
        id: 3,
        pid: 1,
        directory: false,
        rfn: '_tacit',
        name: 'carbon (13).png',
        type: 'image/png',
        status: 0,
        rawSize: 80482,
        rawData: null,
        resultSize: 0,
        resultData: null,
        children: []
      },
      {
        uid: 'COUoFQ',
        id: 4,
        pid: 1,
        directory: false,
        rfn: '_tacit',
        name: 'download (11).png',
        type: 'image/png',
        status: 0,
        rawSize: 93619,
        rawData: null,
        resultSize: 0,
        resultData: null,
        children: []
      }
    ]
  },
  {
    uid: 'f84aQv',
    id: 1,
    pid: 0,
    directory: true,
    rfn: 'dist.zip',
    name: 'dist',
    type: 'application/octet-stream',
    status: 0,
    rawSize: 0,
    rawData: null,
    resultSize: 0,
    resultData: null,
    children: [
      {
        uid: 'Gwpuyf',
        id: 4,
        pid: 1,
        directory: false,
        rfn: 'dist.zip',
        name: 'favicon.ico',
        type: 'image/x-icon',
        status: 0,
        rawSize: 1150,
        rawData: null,
        resultSize: 0,
        resultData: null,
        children: []
      },
      {
        uid: 'H93nAK',
        id: 7,
        pid: 1,
        directory: false,
        rfn: 'dist.zip',
        name: 'index.html',
        type: 'text/html',
        status: 0,
        rawSize: 2398,
        rawData: null,
        resultSize: 0,
        resultData: null,
        children: []
      },
      {
        uid: 'IHtImh',
        id: 11,
        pid: 1,
        directory: false,
        rfn: 'dist.zip',
        name: 'anov.png',
        type: 'image/png',
        status: 0,
        rawSize: 27942,
        rawData: null,
        resultSize: 0,
        resultData: null,
        children: []
      },
      {
        uid: 'Sx6x3q',
        id: 13,
        pid: 1,
        directory: true,
        rfn: 'dist.zip',
        name: 'css',
        type: 'text/css',
        status: 0,
        rawSize: 0,
        rawData: null,
        resultSize: 0,
        resultData: null,
        children: [
          {
            uid: 'ORlKia',
            id: 23,
            pid: 13,
            directory: false,
            rfn: 'dist.zip',
            name: 'app.dd2d0c7a.css',
            type: 'text/css',
            status: 0,
            rawSize: 104195,
            rawData: null,
            resultSize: 0,
            resultData: null,
            children: []
          },
          {
            uid: '4kOIZf',
            id: 26,
            pid: 13,
            directory: false,
            rfn: 'dist.zip',
            name: 'chunk-ant-design-vue.4117d4bf.css',
            type: 'text/css',
            status: 0,
            rawSize: 134407,
            rawData: null,
            resultSize: 0,
            resultData: null,
            children: []
          }
        ]
      },
      {
        uid: 'erkut3',
        id: 15,
        pid: 1,
        directory: true,
        rfn: 'dist.zip',
        name: 'js',
        type: 'text/javascript',
        status: 0,
        rawSize: 0,
        rawData: null,
        resultSize: 0,
        resultData: null,
        children: [
          {
            uid: '32k9ZK',
            id: 28,
            pid: 15,
            directory: false,
            rfn: 'dist.zip',
            name: 'anov.config.js',
            type: 'text/javascript',
            status: 0,
            rawSize: 172,
            rawData: null,
            resultSize: 0,
            resultData: null,
            children: []
          },
          {
            uid: 'Lqnxm4',
            id: 31,
            pid: 15,
            directory: false,
            rfn: 'dist.zip',
            name: 'chunk-anov.201f7a1b.js',
            type: 'text/javascript',
            status: 0,
            rawSize: 485192,
            rawData: null,
            resultSize: 0,
            resultData: null,
            children: []
          },
          {
            uid: 'CDw9bs',
            id: 35,
            pid: 15,
            directory: false,
            rfn: 'dist.zip',
            name: 'anovHelp.js',
            type: 'text/javascript',
            status: 0,
            rawSize: 6439,
            rawData: null,
            resultSize: 0,
            resultData: null,
            children: []
          },
          {
            uid: 'jucNHh',
            id: 37,
            pid: 15,
            directory: false,
            rfn: 'dist.zip',
            name: 'app.abf35449.js',
            type: 'text/javascript',
            status: 0,
            rawSize: 372350,
            rawData: null,
            resultSize: 0,
            resultData: null,
            children: []
          },
          {
            uid: '8si5Pz',
            id: 39,
            pid: 15,
            directory: false,
            rfn: 'dist.zip',
            name: 'chunk-ant-design.5706769a.js',
            type: 'text/javascript',
            status: 0,
            rawSize: 499695,
            rawData: null,
            resultSize: 0,
            resultData: null,
            children: []
          },
          {
            uid: 'grVUVv',
            id: 41,
            pid: 15,
            directory: false,
            rfn: 'dist.zip',
            name: 'chunk-ant-design-vue.26ce1e36.js',
            type: 'text/javascript',
            status: 0,
            rawSize: 333603,
            rawData: null,
            resultSize: 0,
            resultData: null,
            children: []
          },
          {
            uid: '620Uwh',
            id: 43,
            pid: 15,
            directory: false,
            rfn: 'dist.zip',
            name: 'chunk-vendors.a2bfaedc.js',
            type: 'text/javascript',
            status: 0,
            rawSize: 924438,
            rawData: null,
            resultSize: 0,
            resultData: null,
            children: []
          },
          {
            uid: 'kydf2E',
            id: 45,
            pid: 15,
            directory: false,
            rfn: 'dist.zip',
            name: 'chunk-lodash.4e4a442b.js',
            type: 'text/javascript',
            status: 0,
            rawSize: 94510,
            rawData: null,
            resultSize: 0,
            resultData: null,
            children: []
          }
        ]
      },
      {
        uid: 't52RMG',
        id: 17,
        pid: 1,
        directory: true,
        rfn: 'dist.zip',
        name: 'img',
        type: 'application/octet-stream',
        status: 0,
        rawSize: 0,
        rawData: null,
        resultSize: 0,
        resultData: null,
        children: [
          {
            uid: '0jNgNP',
            id: 47,
            pid: 17,
            directory: false,
            rfn: 'dist.zip',
            name: 'icon-dev.4afeea16.svg',
            type: 'image/svg+xml',
            status: 0,
            rawSize: 928,
            rawData: null,
            resultSize: 0,
            resultData: null,
            children: []
          },
          {
            uid: 'DTy3xV',
            id: 50,
            pid: 17,
            directory: true,
            rfn: 'dist.zip',
            name: 'sys-img',
            type: 'application/octet-stream',
            status: 0,
            rawSize: 0,
            rawData: null,
            resultSize: 0,
            resultData: null,
            children: [
              {
                uid: 'qDjMOV',
                id: 81,
                pid: 50,
                directory: false,
                rfn: 'dist.zip',
                name: 'loading-yellow.webp',
                type: 'image/webp',
                status: 0,
                rawSize: 112292,
                rawData: null,
                resultSize: 0,
                resultData: null,
                children: []
              },
              {
                uid: 'n5U2yV',
                id: 84,
                pid: 50,
                directory: false,
                rfn: 'dist.zip',
                name: 'loading-logo.png',
                type: 'image/png',
                status: 0,
                rawSize: 40601,
                rawData: null,
                resultSize: 0,
                resultData: null,
                children: []
              },
              {
                uid: 'dSzlno',
                id: 86,
                pid: 50,
                directory: false,
                rfn: 'dist.zip',
                name: 'loading-red.webp',
                type: 'image/webp',
                status: 0,
                rawSize: 108040,
                rawData: null,
                resultSize: 0,
                resultData: null,
                children: []
              },
              {
                uid: '138fKj',
                id: 88,
                pid: 50,
                directory: false,
                rfn: 'dist.zip',
                name: 'loading-warning-yellow.png',
                type: 'image/png',
                status: 0,
                rawSize: 3934,
                rawData: null,
                resultSize: 0,
                resultData: null,
                children: []
              },
              {
                uid: 'iAkAPl',
                id: 90,
                pid: 50,
                directory: false,
                rfn: 'dist.zip',
                name: 'logo.png',
                type: 'image/png',
                status: 0,
                rawSize: 5025,
                rawData: null,
                resultSize: 0,
                resultData: null,
                children: []
              },
              {
                uid: 'PX2I7g',
                id: 92,
                pid: 50,
                directory: false,
                rfn: 'dist.zip',
                name: 'loading-text-bg.png',
                type: 'image/png',
                status: 0,
                rawSize: 1265,
                rawData: null,
                resultSize: 0,
                resultData: null,
                children: []
              },
              {
                uid: 'NJGmRO',
                id: 94,
                pid: 50,
                directory: false,
                rfn: 'dist.zip',
                name: 'loading-warning-red.png',
                type: 'image/png',
                status: 0,
                rawSize: 3851,
                rawData: null,
                resultSize: 0,
                resultData: null,
                children: []
              },
              {
                uid: 'J3f1pC',
                id: 96,
                pid: 50,
                directory: false,
                rfn: 'dist.zip',
                name: 'bg.jpg',
                type: 'image/jpeg',
                status: 0,
                rawSize: 32923,
                rawData: null,
                resultSize: 0,
                resultData: null,
                children: []
              },
              {
                uid: 'eTlT9q',
                id: 98,
                pid: 50,
                directory: false,
                rfn: 'dist.zip',
                name: 'body-ani.png',
                type: 'image/png',
                status: 0,
                rawSize: 836763,
                rawData: null,
                resultSize: 0,
                resultData: null,
                children: []
              }
            ]
          },
          {
            uid: 'o5faT1',
            id: 52,
            pid: 17,
            directory: false,
            rfn: 'dist.zip',
            name: 'popup-bg.b417d6ab.png',
            type: 'image/png',
            status: 0,
            rawSize: 99899,
            rawData: null,
            resultSize: 0,
            resultData: null,
            children: []
          },
          {
            uid: 'Ll7JI9',
            id: 54,
            pid: 17,
            directory: false,
            rfn: 'dist.zip',
            name: 'close.46aff379.png',
            type: 'image/png',
            status: 0,
            rawSize: 68967,
            rawData: null,
            resultSize: 0,
            resultData: null,
            children: []
          },
          {
            uid: 'mkkWBt',
            id: 56,
            pid: 17,
            directory: false,
            rfn: 'dist.zip',
            name: 'logo.f3b7f0ad.png',
            type: 'image/png',
            status: 0,
            rawSize: 5025,
            rawData: null,
            resultSize: 0,
            resultData: null,
            children: []
          },
          {
            uid: '0uve68',
            id: 58,
            pid: 17,
            directory: false,
            rfn: 'dist.zip',
            name: 'logo-anov.e2a9ffd7.svg',
            type: 'image/svg+xml',
            status: 0,
            rawSize: 2874,
            rawData: null,
            resultSize: 0,
            resultData: null,
            children: []
          },
          {
            uid: 'wwnBrO',
            id: 60,
            pid: 17,
            directory: false,
            rfn: 'dist.zip',
            name: 'body-ani.61c436c2.png',
            type: 'image/png',
            status: 0,
            rawSize: 1340677,
            rawData: null,
            resultSize: 0,
            resultData: null,
            children: []
          },
          {
            uid: 'zPyJZc',
            id: 62,
            pid: 17,
            directory: false,
            rfn: 'dist.zip',
            name: 'logo-anov-text.9cb219db.svg',
            type: 'image/svg+xml',
            status: 0,
            rawSize: 1782,
            rawData: null,
            resultSize: 0,
            resultData: null,
            children: []
          },
          {
            uid: 'qEeYOa',
            id: 64,
            pid: 17,
            directory: false,
            rfn: 'dist.zip',
            name: 'video-2.2133b273.png',
            type: 'image/png',
            status: 0,
            rawSize: 5116,
            rawData: null,
            resultSize: 0,
            resultData: null,
            children: []
          },
          {
            uid: 'SvDdHP',
            id: 66,
            pid: 17,
            directory: false,
            rfn: 'dist.zip',
            name: 'video-1.8e7b500b.png',
            type: 'image/png',
            status: 0,
            rawSize: 4990,
            rawData: null,
            resultSize: 0,
            resultData: null,
            children: []
          }
        ]
      },
      {
        uid: 'DGmGEV',
        id: 19,
        pid: 1,
        directory: false,
        rfn: 'dist.zip',
        name: 'style.css',
        type: 'text/css',
        status: 0,
        rawSize: 5433,
        rawData: null,
        resultSize: 0,
        resultData: null,
        children: []
      },
      {
        uid: '8wQKFv',
        id: 21,
        pid: 1,
        directory: true,
        rfn: 'dist.zip',
        name: 'fonts',
        type: 'application/octet-stream',
        status: 0,
        rawSize: 0,
        rawData: null,
        resultSize: 0,
        resultData: null,
        children: [
          {
            uid: 'YnZPAd',
            id: 71,
            pid: 21,
            directory: false,
            rfn: 'dist.zip',
            name: 'iconfont.11ec568d.ttf',
            type: 'application/x-font-ttf',
            status: 0,
            rawSize: 21060,
            rawData: null,
            resultSize: 0,
            resultData: null,
            children: []
          },
          {
            uid: 'i7dndc',
            id: 73,
            pid: 21,
            directory: false,
            rfn: 'dist.zip',
            name: 'iconfont.86436a9d.ttf',
            type: 'application/x-font-ttf',
            status: 0,
            rawSize: 29276,
            rawData: null,
            resultSize: 0,
            resultData: null,
            children: []
          },
          {
            uid: '2z1FuL',
            id: 75,
            pid: 21,
            directory: false,
            rfn: 'dist.zip',
            name: 'iconfont.fbdfb804.ttf',
            type: 'application/x-font-ttf',
            status: 0,
            rawSize: 8228,
            rawData: null,
            resultSize: 0,
            resultData: null,
            children: []
          },
          {
            uid: 'WpzevI',
            id: 77,
            pid: 21,
            directory: false,
            rfn: 'dist.zip',
            name: 'H_Regular.48d656ed.ttf',
            type: 'application/x-font-ttf',
            status: 0,
            rawSize: 146616,
            rawData: null,
            resultSize: 0,
            resultData: null,
            children: []
          },
          {
            uid: 'eMSbmJ',
            id: 79,
            pid: 21,
            directory: false,
            rfn: 'dist.zip',
            name: 'acens.ttf',
            type: 'application/x-font-ttf',
            status: 0,
            rawSize: 10944,
            rawData: null,
            resultSize: 0,
            resultData: null,
            children: []
          }
        ]
      }
    ]
  }
]) */

const download = async (rfn: string) => {
  console.log(rfn)
  const zip = zips.get(rfn)
  if (!zip) return
  console.log(zip)
  const result = getSuccessedImg(rfn)
  console.log(result)
  result.forEach(img => {
    console.log(img.resultData)
    const imgEntry = zip.getById(img.id)
    // @ts-ignore
    imgEntry?.replaceUint8Array(img.resultData)
  })
  const d = await zip.exportBlob()
  saveAs(d )
  
}

provide('download', download)
</script>

<template>
  <ul>
    <TreeItem v-for="item in treeData" :model="item"></TreeItem>
  </ul>
</template>
