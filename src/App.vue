<template>
  <router-view />
</template>

<script>
export default {
  name: 'App'
}

</script>
 
<style>

/* Overall app background */
body.dark {
  background-color: #1e1e1e;
}

body.dark .sidebar {
  background-color: #1e1e1e;
}
/* Optional: background for cards or sections */
body.dark .card,
body.dark .section,
body.dark .main-content {
  background-color: #2a2a2a;
}

</style>
