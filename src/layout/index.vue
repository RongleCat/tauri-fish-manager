<template>
  <div class="h-screen w-screen flex-col">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-slide" mode="out-in" appear>
        <keep-alive>
          <suspense>
            <component :is="Component" :key="route.fullPath" />
          </suspense>
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>
