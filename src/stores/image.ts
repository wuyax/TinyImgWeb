import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { Status, type ImgInfo } from '@/components/index.d'

export const useImageStore = defineStore('image', () => {
  const images = ref<ImgInfo[]>([])

  // 使用 Map 来提高查找效率
  const imageMap = computed(() => new Map(images.value.map(img => [img.id, img])))

  // 添加图片
  function addImage(image: ImgInfo) {
    images.value.push(image)
  }

  // 批量添加图片
  function addImages(newImages: ImgInfo[]) {
    images.value.push(...newImages)
  }

  // 更新图片信息
  function updateImage(id: string, updates: Partial<ImgInfo>) {
    const image = imageMap.value.get(id)
    if (image) {
      Object.assign(image, updates)
    }
  }

  // 删除图片
  function removeImage(id: string) {
    const index = images.value.findIndex(img => img.id === id)
    if (index !== -1) {
      images.value.splice(index, 1)
    }
  }

  // 清空所有图片
  function clearImages() {
    images.value = []
  }

  // 获取指定状态的图片
  const finish = computed(() => {
    return images.value.every(img => {
      return img.status !== Status.compressing
    })
  })

  return {
    images,
    finish,
    addImage,
    addImages,
    updateImage,
    removeImage,
    clearImages
  }
})
