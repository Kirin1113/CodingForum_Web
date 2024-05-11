<template>
  <footer class="py-5 footer mtp">
    <div class="container">
      <div class="row">
        <div class="mx-auto mb-4 text-center col-lg-8">

          <a href="https://onlinejudge.org/" target="_blank" class="mb-2 text-secondary me-xl-5 me-3 mb-sm-0">
            UVa
          </a>
          <router-link class="" :to="{ name: 'Dashboard' }">
            <img src="@/assets/img/logo3.png" class="footer_logoicon" alt="main_logo" />
          </router-link>
          <a href="https://cpe.cse.nsysu.edu.tw/index.php" target="_blank"
            class="mb-2 text-secondary me-xl-5 me-3 mb-sm-0">
            CPE
          </a>

        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "app-footer"
};
</script>
<style scoped>
@media (min-width: 1200px) {
  .me-xl-5 {
    margin: 3rem !important;
  }
}

@media (max-width: 1200px) {
  .me-xl-5 {
    margin: 2rem !important;
  }
}
</style>
