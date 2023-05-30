<script setup lang="ts">
  import { useRouter } from 'vue-router'

  const router = useRouter()
</script>

<template>
  <div class="page h-screen w-screen">
    <button @click="router.push('/')">首页</button>
  </div>
</template>
