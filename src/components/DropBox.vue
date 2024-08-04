<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { WorkerManager } from '@/assets/compress/index'
import { uId, support } from '@/assets/compress/utils'
import { useImageStore } from '@/stores/image'
import { Status, type TreeNode } from './index.d'
import { getMimeType } from '@zip.js/zip.js'
import zips, { tacit, createZipFileSystem } from './zip-manager'

const { addImages, updateImage } = useImageStore()

const fileInput: Ref<HTMLInputElement | undefined> = ref()
const dropzone: Ref<HTMLDivElement | undefined> = ref()
const events = ['dragenter', 'dragover', 'dragleave', 'drop']

function preventDefaults(e: any) {
  e.preventDefault()
  e.stopPropagation()
}
function handleDrop(e: DragEvent) {
  const files = e.dataTransfer?.files
  if (!files) return
  handleFiles(files)
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

function fileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files) return
  handleFiles(files)
}

function buildUid(rfn, id) {
  return `${rfn}_*_${id}`
}

function buildTree(data: TreeNode[]): TreeNode[] {
  const nodeMap: Record<number, TreeNode> = {}
  const roots: TreeNode[] = []

  // 首先,创建一个以id为键的节点映射
  data.forEach(node => {
    nodeMap[node.id] = { ...node, children: [] }
  })

  // 然后,遍历所有节点,将它们添加到父节点的children数组中,或者添加到根数组中
  data.forEach(node => {
    if (node.pid === 0) {
      roots.push(nodeMap[node.id])
    } else {
      const parent = nodeMap[node.pid]
      if (parent) {
        parent.children?.push(nodeMap[node.id])
      }
    }
  })

  return roots
}

interface AddedFile {
  rfn: string
  id: number
}
async function handleZip(files: FileList) {
  const fileHandleingList: Promise<AddedFile>[] = Array.from(files).map(file => {
    return new Promise(async (reslove, reject) => {
      if (file.type.startsWith('image/')) {
        console.log('image')
        let defaultZip = zips.get(tacit)
        if (!defaultZip) return
        let dir = defaultZip.getChildByName('Downloads')

        if (!dir) {
          dir = defaultZip.addDirectory('Downloads')
        }
        try {
          // @ts-ignore
          const entry = await dir.addFile(file)
          console.log(entry)
          reslove({ rfn: tacit, id: entry.id })
        } catch (error) {
          // todo 文件添加失败！
          console.log(error)
          reject(false)
        }
        console.log('defaultZip', defaultZip)
        // @ts-ignore
        const zipEntries = defaultZip.entries
        // transformEntries(zipEntries, tacit)
      } else if (file.type === 'application/zip') {
        // zip file
        const fileName = file.name
        let zipFilesystem = zips.get(fileName)

        if (!zipFilesystem) {
          zips.set(fileName, createZipFileSystem())
          zipFilesystem = zips.get(fileName)
        } else {
          console.warn(`${fileName} is alreay exist!`)
          return
        }
        // @ts-ignore
        const zipEntries = await zipFilesystem.importBlob(file)
        // transformEntries(zipEntries, fileName)
        reslove({ rfn: fileName, id: 0 })
      } else {
        console.warn(`不支持的文件格式：${file.name}`)
        reject(false)
      }
    })
  })
  console.log(fileHandleingList)
  return Promise.allSettled(fileHandleingList)
}

function transformEntries(zipEntries: any, rootFileName: string) {
  const fileList = zipEntries
    .map((entriy: any) => {
      // const uid = uId()
      let status = Status.compressing
      const type = entriy.data?.type || getMimeType(entriy.name)
      const isSpportTye = support.includes(type)
      if (!isSpportTye) {
        status = Status.unsupport
      }
      return {
        uid: buildUid(rootFileName, entriy.id),
        id: entriy.id,
        pid: entriy.parent?.id,
        directory: entriy.directory || false,
        rfn: rootFileName,
        name: entriy.name,
        type,
        status,
        rawSize: entriy.data?.size || entriy.uncompressedSize,
        rawData: null,
        resultSize: 0,
        resultData: null
      }
    })
    .filter((item: any) => {
      const isOSFile = ['__MACOSX', '.DS_Store'].includes(item.name)
      return !isOSFile && (!item.name || !item.name?.startsWith('.'))
    })
  console.log(fileList)
  const tree = buildTree(fileList)
  return tree
}
interface Item {
  status: string
  value: AddedFile
}

function getUniqueRfnValues(data: PromiseSettledResult<AddedFile>[]): string[] {
  const rfnSet = new Set<string>()

  data.forEach(item => {
    if (item.status === 'fulfilled' && item.value && item.value.rfn) {
      rfnSet.add(item.value.rfn)
    }
  })

  return Array.from(rfnSet)
}

function getFileFromZipById(addedFiles: AddedFile[]) {
  addedFiles.forEach(({ rfn, id }) => {
    const zip = zips.get(rfn)
    if (!zip) return
    if (rfn === tacit) {
      const imgEntry = zip.getById(id)
      imgEntry
        // @ts-ignore
        ?.getUint8Array()
        .then((img: any) => {
          compress(img, buildUid(rfn, id))
        })
        .catch(error => {
          console.log(error)
        })
    } else {
      // zip package
      // @ts-ignore
      const imgEntryInZip = zip.entries.filter(entry => {
        console.log(entry.name)
        return (
          !entry.directory &&
          !['__MACOSX', '.DS_Store'].includes(entry.name) &&
          // hidden file
          !entry.name.startsWith('.') &&
          getMimeType(entry.name).includes('image/')
        )
      })
      imgEntryInZip.forEach(imgEntry => {
        // @ts-ignore
        imgEntry
          ?.getUint8Array()
          .then(img => {
            // console.log(img)
            compress(img, buildUid(rfn, imgEntry.id))
          })
          .catch(error => {
            console.log(error)
          })
      })
      console.log(imgEntryInZip)
    }
  })
}

async function handleFiles(files: FileList) {
  try {
    const addedFiles = await handleZip(files)
    console.log(addedFiles)
    const rfns = getUniqueRfnValues(addedFiles)

    rfns.forEach(rfn => {
      const zip = zips.get(rfn)
      if (!zip) return
      // @ts-ignore
      const tree = transformEntries(zip.entries, rfn)
      console.log(tree)
      addImages(tree[0])
    })
    const fileList = addedFiles.map(({ value }) => {
      return value
    })
    getFileFromZipById(fileList)

    /* let list: any[] = []
    zips.forEach((value, key) => {
      console.log(`${String(key)}: `, value)
      
      const tree = transformEntries(value.entries, key)
      Array.prototype.push.apply(list, tree)
      console.log(list)
    }) */
  } catch (error) {
    console.warn(error)
    return
  }
  return
  // todo handle zip files
  const fileInfos = Array.from(files)
    .filter(file => file.type.startsWith('image/'))
    .map(file => {
      // console.log(file)
      const uid = uId()
      compress(file, uid)

      return {
        uid,
        name: file.name,
        type: file.type,
        status: Status.compressing,
        rawSize: file.size,
        resultSize: 0,
        rawData: file,
        resultData: undefined
      }
    })
  addImages(fileInfos)
}

const manager = new WorkerManager(3)
function compress(file: File, id: string) {
  manager
    .compress(file)
    .then(async imgData => {
      const resultData = imgData.toRaw()
      const resultSize = imgData.size()

      const updateData = {
        rawData: file,
        resultSize,
        resultData,
        status: Status.success
      }
      updateImage(id, updateData)
    })
    .catch(async errCode => {
      console.log('文件压缩发生错误了', errCode, id)
      const updateData = {
        status: Status.error
      }
      updateImage(id, updateData)
    })
}
onBeforeUnmount(() => {
  manager.kill()
})
</script>

<template>
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
        <span class="text-gray-500"
          >Compression happens on your device, no data is sent to our servers</span
        >
      </p>
    </button>
  </div>
</template>

<style scoped></style>
