<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
/* import {
  filesystemService,
  downloadService,
  i18nService,
  storageService,
  zipService,
  shareTargetService,
  fileHandlersService,
  stylesheetService,
  environmentService,
  keyboardService,
  themeService,
  documentService,
  windowService,
  musicService
} from '@/services/index.js'
import { constants, features, getUIState, getEventHandlers } from '@/business/index.js'
import { getMessages } from '@/messages/index.js'
const {
  getCommonFeatures,
  getEntriesFeatures,
  getFoldersFeatures,
  getSelectedFolderFeatures,
  getHighlightedEntriesFeatures,
  getFilesystemFeatures,
  getDownloadsFeatures,
  getClipboardFeatures,
  getOptionsFeatures,
  getAppFeatures,
  getMiscFeatures
} = features
const messages = getMessages({ i18nService })
const apiFilesystem = zipService.createZipFileSystem()
const { root } = apiFilesystem
const rootZipFilename = messages.ROOT_ZIP_FILENAME
console.log(root, rootZipFilename) */
/* const {
    initSelectedFolderFeatures,
    openPromptCreateFolder,
    createFolder,
    closePromptCreateFolder,
    addFiles,
    dropFiles,
    closeChooseAction,
    importZipFile,
    openPromptExportZip,
    exportZip,
    paste,
    closePromptExportZip,
    closePromptImportPassword,
    showAddFilesPicker,
    showImportZipFilePicker,
    onSelectedFolderKeyDown
  } = getSelectedFolderFeatures({
    disabledPaste,
    disabledExportZip,
    zipFilesystem,
    selectedFolder,
    rootZipFilename,
    clipboardData,
    dialogs,
    setHighlightedIds,
    setClipboardData,
    setDialogs,
    setClickedButtonName,
    refreshSelectedFolder,
    highlightEntries,
    saveZipFile,
    getOptions,
    openDisplayError,
    filesystemService,
    fileHandlersService,
    shareTargetService,
    modifierKeyPressed,
    constants
  }); */

// legacy logic

import { WorkerManager } from '@/assets/compress/index'
import { uId } from '@/assets/compress/utils'

import { useImageStore } from '@/stores/image'
import { Status } from './index.d'

const { addImages, updateImage } = useImageStore()

const fileInput: Ref<HTMLInputElement | undefined> = ref()

const dropzone: Ref<HTMLDivElement | undefined> = ref()
const events = ['dragenter', 'dragover', 'dragleave', 'drop']

const manager = new WorkerManager(3)
function preventDefaults(e: any) {
  e.preventDefault()
  e.stopPropagation()
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

onMounted(() => {
  events.forEach(eventName => {
    dropzone.value?.addEventListener(eventName, preventDefaults, false)
  })

  dropzone.value?.addEventListener('drop', handleDrop, false)
})
onBeforeUnmount(() => {
  manager.kill()
})

function openFileSelect() {
  fileInput.value?.click()
}

function fileChange(event: any) {
  const files = event.target.files
  handleFiles(files)
}

function handleFiles(files: any) {
  const fileInfos = Array.from(files as File[])
    .filter(file => file.type.startsWith('image/'))
    .map(file => {
      // console.log(file)
      const id = uId()
      compress(file, id)

      return {
        id,
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
  // uploadFiles.value.push(...fileInfos)
}

function compress(file: File, id: string) {
  manager
    .compress(file)
    .then(async imgData => {
      const resultData = imgData.toRaw()
      const resultSize = imgData.size()

      const updateData = {
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
        <span class="text-gray-500">Convert images automatically</span>
      </p>
    </button>
  </div>
</template>

<style scoped></style>
