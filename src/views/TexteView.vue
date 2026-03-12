<script setup>
import { ref, onMounted, nextTick } from 'vue'
import html2canvas from 'html2canvas'

// --- ÉTATS ---
const canvasRef = ref(null)
const contractElement = ref(null) // Pour capturer tout le bloc du contrat
const isDrawing = ref(false)
const showContract = ref(false)   // Bascule l'affichage
const signatureImg = ref(null)    // Image de la signature seule
let ctx = null

// --- LOGIQUE DESSIN (CANVAS) ---
onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#0f172a'
  }
})

const startDrawing = (e) => {
  isDrawing.value = true
  draw(e)
}

const stopDrawing = () => {
  isDrawing.value = false
  ctx.beginPath()
}

const draw = (e) => {
  if (!isDrawing.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left
  const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top
  ctx.lineTo(x, y)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x, y)
}

const clearSignature = () => {
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
}

// --- LOGIQUE DE SAUVEGARDE COMPLÈTE ---
const validerContrat = async () => {
  // 1. On transforme le dessin en image pour l'afficher DANS le contrat
  signatureImg.value = canvasRef.value.toDataURL('image/png')
  
  // 2. On affiche le contrat HTML
  showContract.value = true

  // 3. On attend que Vue affiche le contrat (nextTick)
  await nextTick()

  // 4. On capture tout le bloc "contractElement" en image
  if (contractElement.value) {
    const canvasFull = await html2canvas(contractElement.value, {
      backgroundColor: '#ffffff',
      scale: 2 // Haute qualité
    })
    
    const fullImageBase64 = canvasFull.toDataURL('image/png')

    // 5. On envoie l'image complète au serveur
    try {
      await fetch('http://localhost:3001/api/save-contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: fullImageBase64 })
      })
      console.log("Contrat complet sauvegardé dans assets !")
    } catch (err) {
      console.error("Erreur de sauvegarde serveur :", err)
    }
  }
  
  window.scrollTo(0, 0)
}
</script>

<template>
  <div class="min-h-screen bg-slate-900 flex items-center justify-center p-6 py-20">
    
    <div v-if="!showContract" class="text-center max-w-4xl">
      <h1 class="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none mb-16">
        Ceci est un message <br />
        <span class="text-yellow-400">très important</span> <br />
        de ton technicien.
      </h1>

      <div class="max-w-2xl mx-auto space-y-10">
        
        <div class="space-y-6">
          <p class="text-slate-400 text-lg md:text-xl leading-relaxed font-medium italic">
            Bon, petit message sérieux. Je voulais t'annoncer mes sentiments, te dire ce que je trouve de plus beau, marrant et incroyable chez toi.Te dire pourquoi je t'aime .
          </p>
          <p class="text-slate-400 text-lg md:text-xl leading-relaxed font-medium italic">
            J'ai menti, c'est faux... 
            Je comprends, en vrai : le fait de ne pas faire le taf que tu es censé faire, c'est chiant. Tu n'apprends rien et tu te poses peut-être la question de pourquoi tu es encore là. J'ai quelques points qui peuvent peut-être t'aider à relativiser.
          </p>
          <p class="text-slate-400 text-lg md:text-xl leading-relaxed font-medium italic font-bold text-slate-400">
            C'est ta dernière année !! Alors oui, tu dois serrer les dents, mais après, tu seras libre de faire ce que tu veux. Changer de taf, ne faire que de la pâtisserie... who knows ?
          </p>
        </div>

        <div class="flex justify-center py-4">
          <img 
            src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExam8wOHg1MzltcDU0Z200eTVhZ25kbXhuZWJ2OG5ram52NjFscDB5NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4HnRkHk77nStQSGxgi/giphy.gif" 
            class="w-64 md:w-80 h-auto rounded-2xl border-4 border-slate-700 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500"
          />
        </div>

        <div class="space-y-6">
          <p class="text-slate-400 text-lg md:text-xl leading-relaxed font-medium italic">
            Si tu as l'impression de ne rien apprendre et que ton taf n'a pas vraiment de « mérite » : quand tu as du temps, essaie d'apprendre un truc dont tu as toujours eu envie. Tu as 15 minutes devant toi ? Tu as toujours voulu apprendre la langue des signes ou le dessin ? Regarde et apprends pendant ce temps-là. Je ne pense pas qu'ils vont cramer si, dans la journée, tu fais des choses pour toi (enfin, j'espère...).
          </p>
          <p class="text-slate-400 text-lg md:text-xl leading-relaxed font-medium italic">
            Sinon, quand tu te fais chier comme un rat mort, il y a des gens autour de toi qui sont peut-être toujours dispos pour une pause et pour parler.
          </p>
        </div>

        <div class="flex justify-center py-4">
          <img 
            src="../assets/thoms.png" 
            class="w-64 md:w-80 h-auto rounded-2xl border-4 border-slate-700 shadow-2xl -rotate-2 hover:rotate-0 transition-transform duration-500"
          />
        </div>

        <div class="space-y-6">
          <p class="text-slate-400 text-lg md:text-xl leading-relaxed font-medium italic">
            Je ne sais pas s'il est possible pour toi de t'entraîner à faire des mini-projets dans ton domaine pour monter en compétences toute seule, mais essaie toujours, ou prépare tes futurs projets.
          </p>
          <p class="text-slate-400 text-lg md:text-xl leading-relaxed font-medium italic">
            En plus, imagine : tu as une idée pro, tu peux accéder à TBSeed. Tu la développes pendant ton temps de « réunion » avec ton N+1 qui vient de partir... et let's go !
          </p>
          <p class="text-slate-400 text-lg md:text-xl leading-relaxed font-medium italic">
            Non, en vrai, c'est toujours plus facile à dire qu'à faire, et je ne suis pas loin d'avoir le même problème que toi. Alors je te dis juste des choses qui, je pense, peuvent aider une personnalité comme la tienne. J'ai demandé aux constellations, t'inquiète, mes sources sont correctes :D
          </p>
          <p class="text-slate-400 text-xl md:text-xl font-black uppercase tracking-tight pt-4">
            Bref, je ne suis pas douée pour les messages, mais tu as dû comprendre l'essentiel. Si jamais tu veux en parler, je m'appelle Virginie.
          </p>
        </div>
      </div>

      <div class="mt-20 flex flex-col items-center">
        <p class="text-yellow-400 font-black uppercase mb-4 italic tracking-widest">Signe ici pour accuser réception :</p>
        <div class="relative bg-white border-4 border-slate-700 shadow-[10px_10px_0px_0px_rgba(250,204,21,1)]">
          <canvas
            ref="canvasRef" width="400" height="180"
            class="cursor-crosshair touch-none bg-white"
            @mousedown="startDrawing" @mousemove="draw" @mouseup="stopDrawing"
            @touchstart.prevent="startDrawing" @touchmove.prevent="draw" @touchend.prevent="stopDrawing"
          ></canvas>
          <button @click="clearSignature" class="absolute top-2 right-2 text-xs font-bold text-slate-400 uppercase">Effacer</button>
        </div>

        <button @click="validerContrat" class="mt-10 bg-white text-slate-900 px-10 py-4 font-black uppercase hover:bg-yellow-400 transition-all border-4 border-slate-700 shadow-[8px_8px_0px_0px_rgba(250,204,21,1)]">
          Valider et Partir
        </button>
      </div>
    </div>

    <div v-else 
         ref="contractElement"
         class="max-w-2xl w-full bg-white border-8 border-slate-900 p-8 md:p-12 shadow-[20px_20px_0px_0px_rgba(239,68,68,1)] transform -rotate-1">
      
      <div class="text-center border-b-4 border-slate-900 pb-6 mb-8">
        <h2 class="text-4xl font-black uppercase tracking-tighter text-red-600 leading-none">ACTE DE CESSION D'ÂME</h2>
        <p class="text-xs font-bold text-slate-500 italic mt-2">Document officiel - Réf: 666-Gratos-Virginie</p>
      </div>

      <div class="space-y-4 text-slate-800 font-bold text-sm md:text-base text-justify leading-snug">
        <p>1. Par la présente, l'utilisateur accepte de céder l'intégralité de son âme (et de son temps libre) à Virginie, Aubin et Thomas pour la somme symbolique de **0,00€**.</p>
        <p>2. Cette cession inclut le droit exclusif sur les futurs projets de pâtisserie et les talents cachés développés pendant les heures de bureau.</p>
        <p>3. L'utilisateur s'engage à serrer les dents jusqu'à la libération finale, sans possibilité de recours auprès du N+1.</p>
        <p>4. Fait sous l'œil bienveillant des constellations marseillaises.</p>
        <p>5. Et à l’obligation d’offrir un menu chez Kamel, lorsque la demande émane de l’une des personnes citées précédemment.</p>
      </div>

      <div class="mt-12 flex justify-between items-end">
        <div class="text-left">
          <p class="text-[10px] uppercase font-black text-slate-400">Fait le {{ new Date().toLocaleDateString() }}</p>
          <p class="font-black text-xl uppercase mt-2">Aubin</p>
          <p class="text-xs italic">La technicienne des âmes</p>
        </div>
        <div class="text-right">
          <p class="text-[10px] uppercase font-black text-slate-400 mb-2">Signature du Pigeon :</p>
          <img :src="signatureImg" class="h-20 md:h-24 w-auto grayscale contrast-125 border-b-2 border-slate-200" />
        </div>
      </div>

      <router-link to="/" class="block text-center mt-12 bg-slate-900 text-white py-4 font-black uppercase hover:bg-red-600 transition-colors">
        J'ai vendu mon âme, adieu.
      </router-link>
    </div>

  </div>
</template>

<style scoped>
.touch-none { touch-action: none; }
</style>