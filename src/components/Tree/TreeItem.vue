<script lang="ts" setup>
import { ref, computed } from 'vue'
import TreeFolder from './TreeFolder.vue'
import Result from '../Result.vue'

const props = defineProps({
  model: Object
})

const isOpen = ref(true)
const isFolder = computed(() => {
  // return props.model.children && props.model.children.length
  return props.model.directory
})

const isRootFolder = computed(() => {
  return props.model.pid === 0
})

function toggle() {
  isOpen.value = !isOpen.value
}

function changeType() {
  if (!isFolder.value) {
    props.model.children = []
    addChild()
    isOpen.value = true
  }
}

function addChild() {
  props.model.children.push({ name: 'new stuff' })
}
</script>

<template>
  <li
    :class="[
      isRootFolder
        ? 'border rounded-md mb-4'
        : isFolder
        ? 'border rounded-md rounded-e-none mb-4 border-r-0 !border-b'
        : 'item py-3'
    ]">
    <TreeFolder
      v-if="isFolder"
      :isRootFolder="isRootFolder"
      :isOpen="isOpen"
      :name="model.name"
      :rfn="model.rfn"
      @toggle="toggle"></TreeFolder>
    <!-- <div
      v-else
      class="flex items-center justify-between w-full py-2 rounded"
      :class="[isFolder ? 'font-bold bg-slate-100 cursor-pointer px-3' : '']"
      @click="toggle">
      <div :class="[isFolder ? 'font-bold' : '']">{{ model.name }}</div>
      <div v-if="isFolder">
        <span>[{{ isOpen ? '-' : '+' }}]</span>
      </div>
    </div> -->

    <Result v-else :data="model"></Result>
    <ul
      v-show="isOpen"
      v-if="isFolder"
      class="divide-y divide-slate-200 dark:divide-stone-700 pl-8">
      <!--
        A component can recursively render itself using its
        "name" option (inferred from filename if using SFC)
      -->
      <TreeItem v-for="model in model.children" :model="model"> </TreeItem>
    </ul>
  </li>
</template>
