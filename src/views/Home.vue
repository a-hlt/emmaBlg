<script setup>
import { ref } from 'vue'

const survivreRef = ref([
  {
    id: 1,
    title: "Question pour un con",
    description: "T'inquiète, tu verras bien assez tôt.",
    icon: "🧠",
    color: "bg-pink-100 text-pink-600",
    route: "/quiz" 
  },
  {
    id: 2,
    title: "Texte Perso",
    description: "C'est un message qui vient de ton technicien pour ton store.",
    icon: "🛠️", 
    color: "bg-pink-100 text-pink-600",
    route: "/texte" 
  },
    {
    id: 3,
    title: "FAQ",
    description: "Des petites choses",
    icon: "[O_O]", 
    color: "bg-pink-100 text-pink-600",
    route: "/faq" 
  }
])
</script>

<template>
  <div class="flex flex-col">
    
    <section class="py-24 px-6 bg-slate-900 text-white border-b-4 border-yellow-400">
      <div class="container mx-auto max-w-4xl text-center">
        <h2 class="text-6xl font-black mb-8 uppercase tracking-tighter italic">
          Tu n'es pas au <span class="text-yellow-400">chômage</span> ou presque.
        </h2>
        <div class="mt-12 flex justify-center">
          <img 
            src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHgycWpoc3J6a3l0bGt6YXhnaTkybHo4YTZsN3RtMWVlZDRodHc5YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT5LMGufvl9b2Jlbji/giphy.gif" 
            alt="Meme"
            class="w-64 md:w-80 h-auto rounded-2xl border-4 border-slate-700 shadow-2xl "
          />
        </div>
      </div>
    </section>

    <section class="py-20 px-6 bg-slate-50">
      <div class="container mx-auto">
        
        <div class="text-center mb-16">
          <p class="text-4xl font-bold text-slate-900 mb-4 ">En espérant que tu pourras rire un peu</p>
          <p class="text-xl font-bold text-slate-900 mb-4 ">C'est un site internet pour passer le temps ou oublier certains problèmes au boulot.</p>
          <p class="text-slate-500 text-lg max-w-2xl mx-auto">
            Comment ne pas devenir fou lorsque Cyril nous donne la Tour Eiffel comme cadeau (heureusement non).
          </p>
          <img 
            src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWZjazU5OWVremF4dzd1anB6Zm9laXVrNXY5ZnRoemN1Y2I2Mmd4bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/H5C8CevNMbpBqNqFjl/giphy.gif" 
            alt="Side eye meme"
            class="w-20 md:w-52 h-auto rounded-2xl border-4 border-slate-700 shadow-2xl mx-auto mt-8"
          />
        </div>

        <div class="text-center mb-16 ">
          <div class="my-20"> ------------------------------------------------------------------------------------------------------</div>
          <p class="text-4xl font-bold text-slate-900 mb-4 ">Les regles à suivres STP</p>
        <p class="text-slate-500 text-lg max-w-2xl mx-auto">Fais les choses jusqu’au bout, si possible, et dans l’ordre. Si jamais tu ne veux pas répondre ou que tu veux écrire n’importe quoi, fais-le, même une seule lettre pour aller jusqu’au bout. Il n’y a pas d’obligation. Tu pourras tout revoir à la fin si besoin, mais seulement une fois que tout sera terminé.</p>
          <img 
            src="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3YzlvaWEyc3RzaTE0ZXQweW5wN2E1bmIxcWdkZ3NtcjM3MGh3bjBmbyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/W9d37aHZgWyuMCGAsU/giphy.gif" 
            alt="Side eye meme"
            class="w-20 md:w-52 h-auto rounded-2xl border-4 border-slate-700 shadow-2xl mx-auto mt-8"
          />
        </div>

        <div class="flex flex-wrap justify-center gap-8">
          <router-link 
            v-for="card in survivreRef" 
            :key="card.id" 
            :to="card.route"
            class="bg-white p-8 rounded-tr-[50px] rounded-bl-[50px] border-l-4 border-slate-900 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 block w-full max-w-sm text-center"
          >
            <div :class="`w-16 h-16 ${card.color} rounded-full flex items-center justify-center text-3xl mb-6 shadow-inner mx-auto` ">
              {{ card.icon }}
            </div>
            <h4 class="text-2xl font-black mb-4 uppercase text-slate-800">{{ card.title }}</h4>
            <p class="text-slate-600 text-lg leading-relaxed">{{ card.description }}</p>
          </router-link>
        </div>

      </div>
    </section>

    <section class="py-16 px-6 text-center bg-white">
      <div class="max-w-2xl mx-auto border-4 border-slate-900 p-8 transform -rotate-1 shadow-[10px_10px_0px_0px_rgba(15,23,42,1)]">
        <p class="text-2xl font-black text-slate-900 leading-tight">
          "Souviens-toi : si tu marches assez longtemps vers l'Est, tu finis par arriver par l'Ouest. C'est ça, la persévérance (ou un très mauvais GPS)."
        </p>
        <p class="mt-4 text-slate-500 font-bold uppercase tracking-widest">— Socrate ( c fo ) </p>
      </div>
    </section>

  </div>
</template>