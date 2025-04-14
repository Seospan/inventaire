<template>
    <div :class="['note-modal', { active }]" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Ajouter une note</h3>
          <span class="close" @click="$emit('close')">&times;</span>
        </div>
        <textarea v-model="localNote" placeholder="Écrire une note..."></textarea>
        <button class="save-btn" @click="saveNote">Enregistrer</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NoteModal',
    props: {
      active: {
        type: Boolean,
        required: true
      },
      note: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        localNote: this.note
      };
    },
    watch: {
      note(newVal) {
        this.localNote = newVal;
      }
    },
    methods: {
      saveNote() {
        this.$emit('save', this.localNote);
      }
    }
  }
  </script>