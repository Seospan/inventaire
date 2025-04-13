<template>
    <div class="theme-toggle">
      <button class="theme-toggle-btn" @click="toggleTheme">
        <span v-if="isDarkTheme">☀️</span>
        <span v-else>🌙</span>
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ThemeToggle',
    data() {
      return {
        isDarkTheme: false
      }
    },
    mounted() {
      // Vérifier le thème précédemment sauvegardé
      const savedTheme = localStorage.getItem('theme');

      if (savedTheme) {
            // Utiliser le thème sauvegardé
            this.isDarkTheme = savedTheme === 'dark';
        } else {
            // Sinon, utiliser les préférences système
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.isDarkTheme = prefersDark;
        }
        
        // Appliquer le thème
        if (this.isDarkTheme) {
            document.body.classList.add('dark-theme');
        }
        
        // Écouter les changements de préférence système
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            if (!localStorage.getItem('theme')) { // Ne pas écraser le choix manuel
            this.isDarkTheme = event.matches;
            document.body.classList.toggle('dark-theme', this.isDarkTheme);
            }
        });
    
      /*if (savedTheme === 'dark') {
        this.isDarkTheme = true;
        document.body.classList.add('dark-theme');
      }*/
    },
    methods: {
      toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        
        if (this.isDarkTheme) {
          document.body.classList.add('dark-theme');
          localStorage.setItem('theme', 'dark');
        } else {
          document.body.classList.remove('dark-theme');
          localStorage.setItem('theme', 'light');
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .theme-toggle {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
  }
  
  .theme-toggle-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--primary);
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 2px 5px var(--shadow-color);
    transition: all 0.3s ease;
  }
  
  .theme-toggle-btn:hover {
    transform: scale(1.1);
    background-color: var(--primary-light);
  }
  </style>