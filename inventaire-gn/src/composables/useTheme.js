// Gestion du thème clair/sombre
import { ref, watch, onMounted } from 'vue';

export function useTheme() {
  const isDark = ref(false);
  
  const toggleTheme = () => {
    isDark.value = !isDark.value;
    updateTheme();
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
  };
  
  const updateTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  onMounted(() => {
    // Récupère le thème depuis localStorage ou utilise les préférences système
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      isDark.value = savedTheme === 'dark';
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    updateTheme();
  });
  
  // Réagir aux changements de préférences système
  watch(() => window.matchMedia('(prefers-color-scheme: dark)').matches, (isDarkMode) => {
    if (localStorage.getItem('theme') === null) {
      isDark.value = isDarkMode;
      updateTheme();
    }
  });
  
  return {
    isDark,
    toggleTheme
  };
}