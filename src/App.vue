<script setup lang="ts">
import { RouterView } from 'vue-router'
import SiteHeader from '@/components/SiteHeader.vue'
import IconWasm from '@/components/icons/IconWasm.vue'
</script>

<template>
  <SiteHeader></SiteHeader>

  <RouterView />

  <footer class="w-full h-10 text-center fixed bottom-0 bg-white flex justify-center items-center">
    <span class="pr-2">It's free. From your friend</span>
    <a class="underline underline-offset-4" href="https://github.com/wuyax" target="_blank">@wuyax</a>
    <span class="pl-2">powered by</span>
    <a class="flex items-center underline underline-offset-4" href="https://webassembly.org/" target="_blank"><IconWasm class="ml-2 mr-1"/> WASM</a>
  </footer>
</template>

<style scoped>
.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  .logo {
    margin: 0 2rem 0 0;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
