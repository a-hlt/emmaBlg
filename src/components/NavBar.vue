<script setup>
import { ref } from 'vue'

const showPopup = ref(false)

const direQueCaSertARien = () => {
  showPopup.value = true
  // On le cache automatiquement après 3 secondes si l'utilisateur ne clique pas
  setTimeout(() => {
    showPopup.value = false
  }, 9000)
}
</script>

<template>
  <nav class="bg-slate-900 text-white p-4 shadow-lg border-b-2 border-blue-900 relative">
    <div class="container mx-auto flex justify-between items-center">
      <router-link to="/">
      <h1 class="text-xl font-black tracking-tight text-blue-400 uppercase italic">
        Site De <span class="text-white">Con</span>
      </h1>
      </router-link>
      <div class="space-x-6 font-bold uppercase text-sm tracking-widest">
        <span @click="direQueCaSertARien" class="cursor-pointer hover:text-blue-400 transition-colors">Accueil</span>
        
        <a href="https://ihasabucket.com" class="cursor-pointer hover:text-blue-400 transition-colors">Projets</a>
        <a href="https://bedboat.fr/" class="cursor-pointer hover:text-blue-400 transition-colors">Contact</a>
           <router-link to="/archives">
      <h1 class="cursor-pointer hover:text-blue-400 transition-colors">
        archives
      </h1>
      </router-link>
        
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showPopup" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div class="bg-white border-8 border-slate-900 p-8 max-w-sm w-full shadow-[15px_15px_0px_0px_rgba(59,130,246,1)] text-center">
          <div class="text-5xl mb-4">🚫</div>
          <h3 class="text-2xl font-black text-slate-900 uppercase mb-4">Alerte Inutilité</h3>
          <p class="text-slate-600 font-bold mb-6">
            Ce bouton ne sert strictement à rien. Essaye les autres.
          </p>
          <button 
            @click="showPopup = false" 
            class="w-full bg-blue-500 text-white py-3 font-black uppercase border-4 border-slate-900 hover:bg-yellow-400 hover:text-slate-900 transition-colors"
          >
            D'accord, je suis nul
          </button>
        </div>
      </div>
    </Transition>
  </nav>
</template>