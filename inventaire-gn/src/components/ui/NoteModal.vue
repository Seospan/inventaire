<!-- src/components/ui/NoteModal.vue -->
<template>
  <div v-if="active" class="fixed inset-0 flex items-center justify-center z-50">
    <div class="absolute inset-0 bg-black opacity-50" @click="$emit('close')"></div>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 p-6 m-4 max-w-lg w-full">
      <h3 class="text-lg font-medium mb-4">Note pour : {{ title }}</h3>
      <textarea
        v-model="localNote"
        class="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        rows="4"
      ></textarea>
      <div class="mt-4 flex justify-end space-x-2">
        <button
          @click="saveNote"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Enregistrer
        </button>
        <button
          @click="$emit('close')"
          class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  active: Boolean,
  note: String,
  title: String
});

const emit = defineEmits(['close', 'save']);

const localNote = ref(props.note);

watch(() => props.note, (newNote) => {
  localNote.value = newNote;
});

const saveNote = () => {
  emit('save', localNote.value);
  emit('close');
};
</script>