import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { mergeWith, isArray } from 'lodash-es'
import { clear } from '@/components/zip-manager'
import { Status, type ImgInfo, type TreeNode } from '@/components/index.d'

function findAndUpdateNodeByUid(
  data: TreeNode[],
  targetUid: string,
  updateData: Partial<TreeNode>
): [TreeNode | null, boolean] {
  function searchAndUpdate(item: TreeNode): [TreeNode | null, boolean] {
    if (item.uid === targetUid) {
      // 找到匹配项，更新属性
      Object.assign(item, updateData)
      return [item, true]
    }

    if (item.children && item.children.length > 0) {
      for (let i = 0; i < item.children.length; i++) {
        const [result, updated] = searchAndUpdate(item.children[i])
        if (updated) {
          return [result, true]
        }
      }
    }

    return [null, false]
  }

  for (let item of data) {
    const [result, updated] = searchAndUpdate(item)
    if (updated) {
      return [result, true]
    }
  }

  return [null, false]
}

function findAndAddChildren(
  data: TreeNode[],
  targetUid: string,
  newChildren: TreeNode | TreeNode[]
): boolean {
  function searchAndAdd(item: TreeNode): boolean {
    if (item.uid === targetUid) {
      // 找到匹配项，添加新的子项
      if (!item.children) {
        item.children = []
      }
      if (Array.isArray(newChildren)) {
        item.children.push(...newChildren)
      } else {
        item.children.push(newChildren)
      }
      return true
    }

    if (item.children && item.children.length > 0) {
      for (let child of item.children) {
        if (searchAndAdd(child)) {
          return true
        }
      }
    }

    return false
  }

  for (let item of data) {
    if (searchAndAdd(item)) {
      return true
    }
  }

  return false
}

function mergeObjects(obj1: TreeNode, obj2: TreeNode): void {
  mergeWith(obj1, obj2, (objValue, srcValue, key, object, source) => {
    if (key === 'children' && isArray(objValue) && isArray(srcValue)) {
      const obj1ChildrenMap = new Map(objValue.map(child => [child.uid, child]))

      srcValue.forEach(child => {
        if (!obj1ChildrenMap.has(child.uid)) {
          // If the child doesn't exist in obj1, add it
          objValue.push(child)
        }
      })

      // Return undefined to skip the default merge behavior for children
      return undefined
    }

    // For all other properties, keep obj1's values
    return objValue
  })
}

function filterItems(data: TreeNode[], rfn: string, status: number): TreeNode[] {
  const result: TreeNode[] = []

  function traverse(item: TreeNode) {
    if (item.rfn === rfn && item.status === status) {
      result.push(item)
    }
    if (item.children && item.children.length > 0) {
      item.children.forEach(traverse)
    }
  }

  data.forEach(traverse)
  return result
}

export const useImageStore = defineStore('image', () => {
  const images = ref<TreeNode[]>([])

  // 使用 Map 来提高查找效率
  // const imageMap = computed(() => new Map(images.value.map(img => [img.uid, img])))

  // 添加图片
  /* function addImage(image: ImgInfo) {
    images.value.push(image)
  } */

  // 批量添加图片
  function addImages(newImages: TreeNode) {
    const addedFolder = images.value.find(({ rfn }) => {
      return rfn === newImages.rfn
    })
    if (addedFolder) {
      mergeObjects(addedFolder, newImages)
    } else {
      images.value.push(newImages)
    }
  }

  // 更新图片信息
  function updateImage(uid: string, updates: Partial<ImgInfo>, rfn?: string) {
    if (rfn) {
      const treeItem = images.value.filter(image => image.rfn === rfn)
      return findAndUpdateNodeByUid(treeItem, uid, updates)
    } else {
      return findAndUpdateNodeByUid(images.value, uid, updates)
    }
  }

  // 删除图片
  /*   function removeImage(id: string) {
    const index = images.value.findIndex(img => img.uid === id)
    if (index !== -1) {
      images.value.splice(index, 1)
    }
  } */

  // 清空所有图片
  function clearImages() {
    images.value = []
    clear()
  }

  // 获取指定状态的图片
  const finish = computed(() => {
    return images.value.every(img => {
      return img.status !== Status.compressing
    })
  })

  const getSuccessedImg = computed(() => {
    return (rfn: string) => {
      return filterItems(images.value, rfn, 1)
    }
  })

  return {
    images,
    finish,
    // addImage,
    addImages,
    updateImage,
    // removeImage,
    clearImages,
    getSuccessedImg
  }
})
