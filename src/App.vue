<script setup>
import Navbar from './components/NavBar.vue'
// import HomeView from './views/Home.vue'
</script>

<template>
  <div class="antialiased font-sans">
   <div class="min-h-screen flex flex-col bg-slate-50 font-sans antialiased text-slate-900">
    <Navbar />
    <main class="flex-grow">
      <router-view />
    </main>
    <footer class="py-6 text-center text-slate-400 text-sm border-t border-slate-200">
      © 2026 - Un homme discret qui a un peu trop de temps à perdre
    </footer>
  </div>
  </div>
</template>