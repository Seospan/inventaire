<template>
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="active" class="fixed inset-0 flex items-center justify-center z-50">
          <div class="absolute inset-0 bg-black opacity-50" @click="close"></div>
          <div class="bg-white dark:bg-gray-800 w-full max-w-md rounded-lg shadow-lg z-10 p-6 m-4">
            <h3 class="text-lg font-medium mb-2">{{ title }}</h3>
            
            <textarea
              v-model="localNote"
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md h-32 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="Ajouter une note"
            ></textarea>
            
            <div class="flex justify-end mt-4 space-x-2">
              <button @click="close" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                Annuler
              </button>
              <button @click="save" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps({
    active: Boolean,
    note: String,
    title: String
  });
  
  const emit = defineEmits(['close', 'save']);
  
  const localNote = ref('');
  
  // Synchroniser la note externe avec la locale
  watch(() => props.note, (newNote) => {
    localNote.value = newNote || '';
  }, { immediate: true });
  
  const close = () => {
    emit('close');
  };
  
  const save = () => {
    emit('save', localNote.value);
    close();
  };
  </script>
  
  <style scoped>
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.3s;
  }
  
  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }
  </style>