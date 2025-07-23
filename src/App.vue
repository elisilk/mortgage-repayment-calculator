<script setup>
import InputForm from './components/InputForm.vue'
import OutputResults from './components/OutputResults.vue'
</script>

<template>
  <main class="app__main">
    <InputForm />
    <OutputResults />
  </main>
</template>

<style scoped>
.app__main {
  background-color: hsl(var(--color-background-primary));
  margin-block: var(--block-size-app-padding);
  margin-inline: auto;
  inline-size: min(100% - 2 * var(--inline-size-app-gutter), var(--inline-size-app-max));
  box-shadow: var(--shadow);
}

@media (min-width: 44rem) {
  .app__main {
    border-radius: var(--br-400);
    overflow: hidden;
  }
}

@media (min-width: 64rem) {
  .app__main {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
