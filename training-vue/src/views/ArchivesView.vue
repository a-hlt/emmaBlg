<script setup>
import { ref, onMounted, computed } from 'vue'

const archives = ref([])
const contracts = ref([]) // Liste des noms de fichiers images
const loading = ref(true)
const activeTab = ref('questions') // 'questions' ou 'contrats'
const activeSessionIndex = ref(null)

// Découpage des questions par 15
const chunkedArchives = computed(() => {
  const size = 15
  const chunks = []
  for (let i = 0; i < archives.value.length; i += size) {
    chunks.push(archives.value.slice(i, i + size))
  }
  return chunks
})

const fetchData = async () => {
  loading.value = true
  try {
    // On récupère les questions
    const resQuestions = await fetch('http://localhost:3001/api/responses')
    archives.value = await resQuestions.json()

    // On récupère la liste des contrats
    const resContracts = await fetch('http://localhost:3001/api/contracts')
    contracts.value = (await resContracts.json()).reverse() // Les plus récents en premier
  } catch (error) {
    console.error("Erreur de chargement:", error)
  } finally {
    loading.value = false
  }
}

const toggleSession = (index) => {
  activeSessionIndex.value = activeSessionIndex.value === index ? null : index
}

onMounted(() => { fetchData() })
</script>

<template>
  <div class="min-h-screen py-12 px-6 bg-slate-50">
    <div class="container mx-auto max-w-5xl">
      
      <div class="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h2 class="text-6xl font-black uppercase italic tracking-tighter text-slate-900">
            Les <span class="text-yellow-400">Archives</span>
          </h2>
          <p class="text-xl text-slate-500 font-bold uppercase italic tracking-widest">Registre central d'infiltration</p>
        </div>
        <button @click="fetchData" class="bg-slate-900 text-white px-6 py-2 font-black uppercase hover:bg-yellow-400 hover:text-slate-900 transition border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Actualiser
        </button>
      </div>

      <div class="flex gap-4 mb-10 border-b-4 border-slate-900 pb-0">
        <button 
          @click="activeTab = 'questions'"
          :class="activeTab === 'questions' ? 'bg-slate-900 text-white border-b-0' : 'bg-white text-slate-500 hover:bg-slate-100'"
          class="px-8 py-4 font-black uppercase tracking-widest border-4 border-slate-900 transition-all transform translate-y-1"
        >
          Rapports (Questions)
        </button>
        <button 
          @click="activeTab = 'contrats'"
          :class="activeTab === 'contrats' ? 'bg-red-600 text-white border-b-0' : 'bg-white text-slate-500 hover:bg-slate-100'"
          class="px-8 py-4 font-black uppercase tracking-widest border-4 border-slate-900 transition-all transform translate-y-1"
        >
          Actes (Contrats)
        </button>
      </div>

      <div v-if="loading" class="text-center py-20">
        <p class="text-3xl font-black animate-pulse uppercase">Ouverture du coffre-fort...</p>
      </div>

      <div v-else>
        
        <div v-if="activeTab === 'questions'" class="space-y-6">
          <div v-if="chunkedArchives.length === 0" class="text-center py-10 font-bold text-slate-400 italic">
            Aucun rapport disponible pour le moment.
          </div>
          <div v-for="(session, sIndex) in chunkedArchives" :key="sIndex">
            <button 
              @click="toggleSession(sIndex)"
              class="w-full flex items-center justify-between p-6 bg-white border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-yellow-50"
              :class="{'bg-yellow-100': activeSessionIndex === sIndex}"
            >
              <div class="flex items-center gap-6">
                <span class="text-3xl font-black text-slate-300">#{{ chunkedArchives.length - sIndex }}</span>
                <div class="text-left">
                  <h4 class="text-xl font-black uppercase">Session d'infiltration ({{ session.length }} questions)</h4>
                  <p class="text-sm font-bold text-slate-500 uppercase">{{ new Date(session[0].timestamp).toLocaleString() }}</p>
                </div>
              </div>
              <div class="text-2xl font-black">{{ activeSessionIndex === sIndex ? '−' : '+' }}</div>
            </button>

            <Transition name="expand">
              <div v-if="activeSessionIndex === sIndex" class="mt-4 space-y-4 pl-6 border-l-8 border-slate-900 pb-10">
                <div v-for="(item, iIndex) in session" :key="iIndex" 
                     class="bg-white border-4 border-slate-900 p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col md:flex-row gap-8 items-start">
                  <div class="flex-grow">
                    <p class="text-xs font-black text-yellow-500 uppercase mb-2">Item {{ iIndex + 1 }}</p>
                    <h3 class="text-xl font-black mb-4 leading-tight uppercase">{{ item.question }}</h3>
                    <p class="italic text-slate-700 bg-slate-50 p-4 border-l-4 border-slate-900 shadow-inner italic">"{{ item.answer || 'Aucune preuve.' }}"</p>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div v-if="contracts.length === 0" class="col-span-full text-center py-10 font-bold text-slate-400 italic">
            Aucune âme n'a été vendue aujourd'hui. Dommage.
          </div>
          <div v-for="(fileName, index) in contracts" :key="index" 
               class="bg-white border-4 border-slate-900 p-4 shadow-[10px_10px_0px_0px_rgba(239,68,68,1)] transform hover:rotate-0 transition-all rotate-1">
            <p class="text-[10px] font-black uppercase text-slate-400 mb-2 italic">Contrat ID: {{ fileName.split('_')[2] }}</p>
            <img :src="`http://localhost:3001/src/assets/${fileName}`" class="w-full h-auto border-2 border-slate-200" />
            <div class="mt-4 flex justify-between items-center">
              <span class="text-xs font-black text-red-600 uppercase">● Officiel</span>
              <a :href="`http://localhost:3001/src/assets/${fileName}`" download class="text-[10px] font-bold underline uppercase">Télécharger la preuve</a>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>
.expand-enter-active, .expand-leave-active { transition: all 0.3s ease; max-height: 5000px; overflow: hidden; }
.expand-enter-from, .expand-leave-to { max-height: 0; opacity: 0; }
</style>