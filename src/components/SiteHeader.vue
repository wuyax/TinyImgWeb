<script setup lang="ts"></script>

<template>
  <header class="header">
    <nav class="container relative flex flex-wrap items-center justify-between px-8 m-auto">
      <!-- logo -->
      <div class="order-0">
        <a class="flex items-center" href="#">
          <img
            class="overflow-hidden rounded-md"
            src="../assets/logo.jpg"
            height="30"
            width="30"
            alt="logo" />
          <span class="pl-3 font-serif text-xl font-bold">TinyIMG</span>
        </a>
      </div>
      <!-- navbar toggler -->
      <input id="nav-toggle" type="checkbox" class="hidden" />
      <label
        id="show-button"
        for="nav-toggle"
        class="order-1 flex cursor-pointer items-center lg:order-1 lg:hidden">
        <svg class="h-6 fill-current" viewBox="0 0 20 20">
          <title>Menu Open</title>
          <path d="M0 3h20v2H0V3z m0 6h20v2H0V9z m0 6h20v2H0V0z"></path>
        </svg>
      </label>
      <label
        id="hide-button"
        for="nav-toggle"
        class="order-2 hidden cursor-pointer items-center lg:order-1">
        <svg class="h-6 fill-current" viewBox="0 0 20 20">
          <title>Menu Close</title>
          <polygon
            points="11 9 22 9 22 11 11 11 11 22 9 22 9 11 -2 11 -2 9 9 9 9 -2 11 -2"
            transform="rotate(45 10 10)"></polygon>
        </svg>
      </label>
      <!-- /navbar toggler -->
      <ul
        id="nav-menu"
        class="text-center lg:text-left order-2 hidden w-full flex-[0_0_100%] lg:order-1 lg:flex lg:w-auto lg:flex-auto lg:justify-center lg:space-x-5">
        <li class="nav-item">
          <a
            href=""
            class="block p-3 py-2 text-[15px] text-dark transition hover:text-primary md:px-2 lg:inline-block active"
            >Home</a
          >
        </li>
        <li class="nav-item">
          <a
            href="#"
            class="block p-3 py-2 text-[15px] text-dark transition hover:text-primary md:px-2 lg:inline-blockink"
            >Price</a
          >
        </li>
        <li class="nav-item">
          <a
            href="#"
            class="block p-3 py-2 text-[15px] text-dark transition hover:text-primary md:px-2 lg:inline-block"
            >Blog</a
          >
        </li>
        <li class="nav-item">
          <a
            href="#"
            class="block p-3 py-2 text-[15px] text-dark transition hover:text-primary md:px-2 lg:inline-block"
            >About</a
          >
        </li>
        <li class="nav-item">
          <a
            href="#"
            class="block p-3 py-2 text-[15px] text-dark transition hover:text-primary md:px-2 lg:inline-block"
            >Contact</a
          >
        </li>
        <li class="nav-item mt-3.5 lg:hidden">
          <a class="btn btn-white btn-sm border-border" href="#">Sing Up Now</a>
        </li>
      </ul>
      <div class="order-1 ml-auto hidden items-center md:order-2 md:ml-0 lg:flex">
        <a class="btn btn-white btn-sm" href="#">Sing Up Now</a>
      </div>
    </nav>
  </header>
</template>

<style scoped>
input#nav-toggle:checked ~ label#show-button {
  @apply hidden;
}

input#nav-toggle:checked ~ label#hide-button {
  @apply flex lg:hidden;
}

input#nav-toggle:checked ~ #nav-menu {
  @apply block lg:flex;
}

.header {
  @apply sticky top-0 z-50  bg-white py-6 transition-all duration-300 lg:bg-transparent;
}
.header-sticky {
  @apply bg-white shadow;
}

.nav-link {
  /* &.active {
    @apply relative;

    &::after {
      @apply absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-tl content-[''];
    }
  } */
}

/* .nav-dropdown {
  @apply mr-0;
}

.nav-dropdown-list {
  @apply z-10 mx-auto ml-1 mt-4 min-w-[180px] rounded-lg border-0 border-solid  border-primary/25 bg-primary/5 px-4 py-3  shadow-sm duration-300 lg:mt-0 lg:border lg:bg-white lg:shadow-[0_0.9rem_1.56rem_rgb(0,0,0,0.1)];
}

.nav-dropdown-item {
  @apply mb-1;
}

.nav-dropdown-link {
  @apply min-w-[150px] py-1 text-sm font-medium text-dark transition hover:text-primary;
} */
</style>
