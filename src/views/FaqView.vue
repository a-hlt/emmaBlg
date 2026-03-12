<script setup>
import { ref, computed, onUnmounted } from 'vue'

const feedback = ref('')
const isSending = ref(false)
const showNotification = ref(false)
const magicColor = ref('bg-slate-50')
const isChasing = ref(false)

// --- CONFIGURATION PIXEL ART ---
const COLOR_MAP = {
  '.': 'transparent',
  'B': '#1f2937',  // Contour sombre
  'D1': '#ea580c', // Orange Chien 1
  'L1': '#fef3c7', // Beige Chien 1
  'D2': '#475569', // Gris Chien 2
  'L2': '#f1f5f9', // Blanc Chien 2
  'D3': '#78350f', // Brun Chien 3
  'L3': '#d97706'  // Ambre Chien 3
}

const DOG_F1 = [
  "................", "................", "................", "................",
  "..........BB....", ".........BXBB...", "........BXBXB...", ".......BXXXXYYB.",
  "BB...BBXXXXXXYBB", "BXB.BXXXXXXXXXYB", ".BXBXXXXXXXXXXBB", "..BXXXXXXXXXXB..",
  "...BXXXXBBXXXB..", "...BXB....BXB...", "..BXB......BXB..", "..BB........BB.."
]

const DOG_F2 = [
  "................", "................", "................", "................",
  "................", "..........BB....", ".........BXBB...", "........BXBXB...",
  "...BBB.BXXXXYYB.", "..BXBBBXXXXXXYBB", "..BXBXXXXXXXXXYB", "...BXXXXXXXXXBB.",
  "....BXXXXXXXB...", "....BXBBBBXB....", "....BXB..BXB....", "....BB....BB...."
]

const injectDogColors = (frames, dos, ventre) => {
  return frames.map(frame => 
    frame.flatMap(row => row.split('').map(char => {
      if (char === 'X') return dos
      if (char === 'Y') return ventre
      return COLOR_MAP[char] || 'transparent'
    }))
  )
}

const dog1Frames = injectDogColors([DOG_F1, DOG_F2], COLOR_MAP.D1, COLOR_MAP.L1)
const dog2Frames = injectDogColors([DOG_F1, DOG_F2], COLOR_MAP.D2, COLOR_MAP.L2)
const dog3Frames = injectDogColors([DOG_F1, DOG_F2], COLOR_MAP.D3, COLOR_MAP.L3)

const animFrame = ref(0)
let animInterval = null

const currentDog1Pixels = computed(() => dog1Frames[animFrame.value])
const currentDog2Pixels = computed(() => dog2Frames[animFrame.value])
const currentDog3Pixels = computed(() => dog3Frames[animFrame.value])

const faqs = ref([
  { id: 1, question: "C'est quoi ce site encore ?", answer: "En gros, j'ai mis trop de temps à t'écrire une réponse et tout, tu connais l'histoire, je t'en ai parlé sur WhatsApp. Du coup, j'ai fait ça pour pratiquer un peu le code. J'ai utilisé de l'IA par flemme, parce que je ne savais pas trop quoi mettre sur le site et que j'ai galéré... bref !", open: false },
  { id: 2, question: "Est-ce que mon patron peut voir ce que j'écris ?", answer: "Techniquement, s'il est derrière ton épaule en ce moment, oui. Sinon, t'inquiète pas, je ne vais pas conserver les réponses. À terme, le site est voué à disparaître.", open: false },
  { id: 3, question: "Pourquoi le quiz est-il si bizarre ?", answer: "C'est l'une des seules idées que j'ai eues, donc tu n'as pas trop le choix !", open: false },
  { id: 4, question: "C'est qui Cyril et l'histoire de la Tour Eiffel ?", answer: "Une légende urbaine. Ou un traumatisme collectif. On préfère ne plus en parler sans la présence de notre avocat (qui est un chat).", open: false },
  { id: 5, question: "C'est quoi cette question 4 ?", answer: "C'est l'IA qui l'a faite. Ça m'a fait un peu rire, donc je te la laisse.", open: false }
])

const toggleFaq = (id) => {
  const item = faqs.value.find(f => f.id === id)
  if (item) item.open = !item.open
}

// --- FONCTION DE SAUVEGARDE RÉELLE ---
const submitFeedback = async () => {
  if (!feedback.value.trim()) return
  isSending.value = true
  try {
    const response = await fetch('http://localhost:3001/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: feedback.value })
    })

    if (response.ok) {
      feedback.value = ''
      showNotification.value = true
      setTimeout(() => { showNotification.value = false }, 3000)
    } else {
      console.error("Le serveur a renvoyé une erreur")
    }
  } catch (error) {
    console.error("Erreur de connexion au serveur :", error)
  } finally {
    isSending.value = false
  }
}

const runMagie = () => {
  const colors = ['bg-red-200', 'bg-yellow-200', 'bg-green-200', 'bg-blue-200', 'bg-purple-200', 'bg-pink-200', 'bg-orange-200']
  magicColor.value = colors[Math.floor(Math.random() * colors.length)]
  
  if (!isChasing.value) {
    isChasing.value = true
    animInterval = setInterval(() => {
      animFrame.value = animFrame.value === 0 ? 1 : 0
    }, 80)

    setTimeout(() => {
      isChasing.value = false
      clearInterval(animInterval)
    }, 2500)
  }
}

onUnmounted(() => {
  if (animInterval) clearInterval(animInterval)
})
</script>

<template>
  <div :class="['flex flex-col min-h-screen transition-colors duration-500 overflow-x-hidden', magicColor]">
    
    <transition name="slide-fade">
      <div 
        v-if="showNotification" 
        class="fixed bottom-10 right-10 z-50 bg-green-400 border-4 border-slate-900 p-4 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex items-center gap-3 transform rotate-1"
      >
        <span class="text-2xl">✅</span>
        <p class="font-black uppercase text-slate-900 tracking-tight">Avis envoyé !</p>
      </div>
    </transition>

    <header class="py-20 px-6 bg-slate-900 text-white border-b-4 border-pink-500">
      <div class="container mx-auto max-w-4xl text-center">
        <h2 class="text-6xl font-black mb-8 uppercase tracking-tighter italic">
          La Foire Aux <span class="text-pink-500">Questions</span> (Inutiles)
        </h2>
        <p class="text-xl text-slate-300 font-bold uppercase tracking-widest">
          Tu te poses des questions ? Moi aussi
        </p>
      </div>
    </header>

    <main class="py-20 px-6 flex-grow">
      <div class="container mx-auto max-w-3xl">
        <div class="space-y-6">
          <div 
            v-for="faq in faqs" :key="faq.id"
            class="bg-white border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] overflow-hidden"
          >
            <button @click="toggleFaq(faq.id)" class="w-full flex justify-between items-center p-6 text-left hover:bg-pink-50 transition-colors">
              <span class="text-xl font-black uppercase text-slate-900">{{ faq.question }}</span>
              <span class="text-3xl font-bold text-pink-600 transition-transform duration-300" :class="{ 'rotate-45': faq.open }">+</span>
            </button>
            <div v-show="faq.open" class="p-6 border-t-4 border-slate-900 bg-slate-50 text-slate-700 text-lg leading-relaxed italic">
              {{ faq.answer }}
            </div>
          </div>
        </div>

        <div class="mt-24 p-8 bg-pink-100 border-4 border-slate-900 shadow-[10px_10px_0px_0px_rgba(15,23,42,1)]">
          <h3 class="text-3xl font-black uppercase mb-4 text-slate-900">Lâche ton meilleur avis</h3>
          <p class="text-slate-700 mb-6 font-bold">Si tu as un truc à dire sur le site ou sur mes blagues nulles, c'est ici :</p>
          <textarea v-model="feedback" rows="4" placeholder="Écris ton venin ici..." class="w-full p-4 border-4 border-slate-900 rounded-none focus:ring-0 focus:outline-none text-lg font-medium mb-4 shadow-inner"></textarea>
          <button @click="submitFeedback" :disabled="isSending" class="bg-slate-900 text-white px-8 py-3 font-black uppercase hover:bg-pink-600 transition-colors flex items-center gap-2 disabled:opacity-50">
            {{ isSending ? 'Envoi...' : 'Envoyer l\'avis 💬' }}
          </button>
        </div>

        <div class="mt-20 text-center">
          <p class="text-2xl font-bold text-slate-900 mb-6 italic">C'est fini</p>
          <img src="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3cGlmc3VmdnprbDdod3dpdWxtMjYxZGV5dW1sNXZrbXJnMTlnbzI3MiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3o7qDEq2bMbcbPRQ2c/giphy.gif" class="w-64 h-auto rounded-2xl border-4 border-slate-700 shadow-2xl mx-auto" />
        </div>

        <div class="mt-16 text-center">
          <router-link to="/" class="inline-block px-10 py-4 bg-yellow-400 border-4 border-slate-900 font-black uppercase text-xl hover:bg-yellow-300 hover:-translate-y-1 transition-all shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
            Retourner bosser
          </router-link>
        </div>
      </div>
    </main>

    <footer class="pt-16 pb-8 bg-white border-t-4 border-slate-900 mt-auto relative">
      <div v-if="isChasing" class="absolute top-[-4px] left-0 -translate-y-full flex items-end animate-chase z-20 pointer-events-none">
          <div class="grid-pixel mr-24 opacity-80">
              <div v-for="(color, i) in currentDog3Pixels" :key="'d3'+i" class="w-full h-full" :style="{ backgroundColor: color }"></div>
          </div>
          <div class="grid-pixel mr-12">
              <div v-for="(color, i) in currentDog1Pixels" :key="'d1'+i" class="w-full h-full" :style="{ backgroundColor: color }"></div>
          </div>
          <div class="grid-pixel">
              <div v-for="(color, i) in currentDog2Pixels" :key="'d2'+i" class="w-full h-full" :style="{ backgroundColor: color }"></div>
          </div>
      </div>

      <div class="max-w-2xl mx-auto text-center px-6">
        <div class="flex flex-wrap items-center justify-center gap-4 mb-8">
          <p class="text-lg font-bold text-slate-500 uppercase tracking-tighter">
            "Il n'y a rien ici sauf un bouton incroyable"
          </p>
          <button 
            @click="runMagie"
            class="bg-purple-600 text-white px-4 py-1 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] font-black uppercase text-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            magie
          </button>
        </div>
        <p class="text-sm text-slate-400 mt-8">— Fais-moi confiance, c'est Socrate</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.slide-fade-enter-active { transition: all 0.3s ease-out; }
.slide-fade-leave-active { transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1); }
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateX(20px) rotate(5deg);
  opacity: 0;
}

.grid-pixel {
  display: grid;
  grid-template-columns: repeat(16, 1fr);
  grid-template-rows: repeat(16, 1fr);
  width: 64px;
  height: 64px;
}

@keyframes chase {
  0% { transform: translateX(-400px); }
  100% { transform: translateX(100vw); }
}

.animate-chase {
  animation: chase 2.5s linear forwards;
}
</style>