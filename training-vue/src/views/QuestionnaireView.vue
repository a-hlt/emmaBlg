<script setup>
import { ref } from 'vue'

// --- ÉTATS DU QUESTIONNAIRE ---
const step = ref(0)
const currentAnswer = ref("")
const uploadedImage = ref(null) // Pour l'URL de prévisualisation (le lien Blob)
const rawFile = ref(null)      // Pour stocker le VRAI fichier (le binaire)
const results = ref([])        // Pour l'affichage final sur cette page

// --- TES 15 QUESTIONS ---
const questions = [
  { q: "Combien de Chocapic faut-il empiler pour atteindre le sommet de la Tour Eiffel ?" },
  { q: "Tu préfères avoir des mains à la place des pieds, ou des pieds à la place des mains ? (Argumente, c'est pour la science)." },
  { q: "Si les objets inanimés pouvaient parler, lequel serait le plus malpoli avec toi ?" },
  { q: "Quelle est la couleur du vent le mardi après-midi ?" },
  { q: "Quel est le mensonge le plus drôle que tes parents t'ont fait croire quand tu étais petite ?" },
  { q: "Quelle est la chanson que tu écoutes en boucle mais que tu aurais trop honte d'avouer en public ?" },
  { q: "Ta réaction si tu croises un pigeon qui te demande l'heure avec une voix de baryton ?" },
  { q: "L'ambiance dans ton cerveau à 14h un lundi ?" },
  { q: "Selon ta théorie personnelle, où vont vraiment les chaussettes qui disparaissent dans la machine à laver ?" },
  { q: "Quel est le talent totalement inutile que tu aimerais voir inscrit sur ton CV avec la mention 'Expert' ?" },
  { q: "Combien de canards en plastique faut-il pour faire flotter un piano à queue au milieu de l'Atlantique ?" },
  { q: "Si ton frigo décidait de faire grève, quelle serait ta première blague de qualité pour le convaincre ?" },
  { q: "Quelle est la loi française que tu trouves la plus ridicule, mais que tu respectes quand même en secret ?(invente si tu veux)" },
  { q: "Combien de fois un chat doit-il miauler pour obtenir la nationalité française et une carte Vitale ?" },
  { q: "trouve moi une image ou photo, qui représente ma tête pendant la création du questionnaire ?" }
]

// --- LOGIQUE DE GESTION D'IMAGE ---
const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    rawFile.value = file // On garde le fichier réel pour le serveur
    uploadedImage.value = URL.createObjectURL(file) // On crée un aperçu pour l'utilisateur
  }
}

const removeImage = () => {
  uploadedImage.value = null
  rawFile.value = null
}

// --- COMMUNICATION AVEC LE SERVEUR ---
const next = async () => {
  // 1. On prépare l'enveloppe (FormData)
  const formData = new FormData()
  formData.append('question', questions[step.value].q)
  formData.append('answer', currentAnswer.value)
  
  if (rawFile.value) {
    formData.append('image', rawFile.value) // Ajoute le fichier image si présent
  }

  try {
    // 2. On envoie au serveur (assure-toi que node server.js tourne sur le port 3001)
    const response = await fetch('http://localhost:3001/api/save', {
      method: 'POST',
      body: formData // Pas besoin de headers Content-Type, FormData s'en occupe !
    })

    if (!response.ok) throw new Error('Erreur lors de la sauvegarde')

    const data = await response.json()

    // 3. On sauvegarde localement pour l'écran final de la session
    results.value.push({
      q: questions[step.value].q,
      a: currentAnswer.value,
      img: data.imagePath || uploadedImage.value // On utilise le chemin renvoyé par le serveur
    })

    // 4. Nettoyage et passage à la suite
    currentAnswer.value = ""
    uploadedImage.value = null
    rawFile.value = null
    step.value++
    window.scrollTo(0,0)
    
  } catch (error) {
    console.error("Détails de l'erreur:", error)
    alert("⚠️ Le serveur de sauvegarde est-il bien allumé ? (node server.js)")
  }
}
</script>

<template>
  <div class="min-h-[90vh] py-12 px-6 flex justify-center bg-slate-50">
    <div class="max-w-3xl w-full bg-white border-8 border-slate-900 p-8 md:p-12 shadow-[20px_20px_0px_0px_rgba(250,204,21,1)] relative h-fit">
      
      <div v-if="step < questions.length">
        <div class="flex justify-between items-center mb-6">
          <span class="bg-slate-900 text-white px-3 py-1 text-xs font-black uppercase tracking-widest">
            Dossier #{{ step + 1 }}
          </span>
        </div>

        <h2 class="text-3xl md:text-4xl font-black mb-10 leading-tight uppercase italic tracking-tighter text-slate-900">
          {{ questions[step].q }}
        </h2>

        <div v-if="uploadedImage" class="mb-6 relative inline-block">
          <img :src="uploadedImage" class="max-h-64 border-4 border-yellow-400 shadow-lg object-contain" />
          <button @click="removeImage" class="absolute -top-4 -right-4 bg-red-600 text-white w-10 h-10 rounded-full font-black border-4 border-slate-900 hover:bg-red-700 transition shadow-md">X</button>
        </div>

        <div class="space-y-6">
          <textarea 
            v-model="currentAnswer" 
            placeholder="Argumente avec conviction (ou n'importe quoi)..." 
            class="w-full p-6 border-4 border-slate-900 font-bold text-xl min-h-[150px] focus:outline-none focus:bg-yellow-50 transition-colors shadow-inner"
          ></textarea>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="cursor-pointer bg-white border-4 border-slate-900 py-4 px-6 font-black uppercase text-center hover:bg-slate-100 transition shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-x-1 active:translate-y-1">
              <span>📷 Joindre une photo Gif</span>
              <input type="file" accept="image/*" class="hidden" @change="onFileChange" />
            </label>

            <button 
              @click="next" 
              :disabled="!currentAnswer.trim() && !rawFile" 
              class="bg-slate-900 text-white py-4 font-black text-xl uppercase hover:bg-yellow-400 hover:text-slate-900 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] disabled:opacity-50"
            >
              Envoyer & Suivant
            </button>
          </div>
        </div>
      </div>

      <div v-else class="space-y-8">
        <div class="text-center border-b-4 border-slate-900 pb-8">
            <h2 class="text-5xl md:text-6xl font-black mb-4 uppercase italic tracking-tighter text-slate-900">Résultat ?</h2>
            <p class="text-xl text-slate-500 font-bold uppercase tracking-widest">Attention je vais pouvoir tout lire.</p>
        </div>

        <div class="space-y-10 py-6">
            <div v-for="(res, i) in results" :key="i" class="p-8 border-4 border-slate-900 bg-white shadow-[10px_10px_0px_0px_rgba(15,23,42,1)]">
                <p class="text-xs font-black text-yellow-500 uppercase mb-2">Photo #{{ i + 1 }}</p>
                <h4 class="font-black text-xl mb-4 leading-tight uppercase">{{ res.q }}</h4>
                <div class="flex flex-col gap-6">
                    <p v-if="res.a" class="italic text-slate-700 text-lg bg-slate-50 p-4 border-l-4 border-slate-900">
                      "{{ res.a }}"
                    </p>
                    <img v-if="res.img" :src="res.img" class="max-w-full md:max-w-md border-4 border-slate-900 shadow-md self-center" />
                </div>
            </div>
        </div>

       <div class="text-center border-b-8 border-blue-900 pb-12 relative overflow-hidden bg-blue-50 rounded-t-3xl p-8">
  
  <div class="absolute top-4 left-10 text-4xl animate-bounce delay-75">🐠</div>
  <div class="absolute bottom-4 right-10 text-4xl animate-bounce delay-300">🐡</div>
  <div class="absolute top-1/2 right-5 text-2xl animate-pulse">🐟</div>

  <h2 class="text-6xl md:text-7xl font-black mb-6 uppercase italic tracking-tighter text-blue-900 drop-shadow-lg">
    Félicitations <span class="text-3xl not-italic">🐟</span>
  </h2>

  <p class="text-xl md:text-2xl text-blue-700 font-black uppercase tracking-widest leading-relaxed max-w-2xl mx-auto">
    Les réponses <span class="underline decoration-yellow-400">prouvent</span> que tu es un poisson, 
    ascendant Poisson. Tu es <span class="text-pink-500">empathique</span> et marseillaise...
    (enfin, c'est ce que <span class="underline decoration-yellow-400">disent</span> les étoiles, c'est pas moi ).
  </p>

  <div class="mt-8 text-5xl">
    🌊🌊🌊
  </div>
</div>

        <router-link to="/" class="block text-center bg-slate-900 text-white py-6 font-black text-3xl uppercase hover:bg-yellow-400 hover:text-slate-900 transition-all border-4 border-slate-900 shadow-[10px_10px_0px_0px_rgba(250,204,21,1)]">
          Retour au menu
        </router-link>
      </div>

    </div>
  </div>
</template>