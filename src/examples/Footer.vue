<template>
  <footer class="py-3 footer" style="margin-top: 40vh!important;">
    <div class="container-fluid">
      <div class="row align-items-center justify-content-lg-between">
        <div class="mb-4 col-lg-6 mb-lg-0">
          <div class="text-sm text-center copyright text-muted"
            :class="this.$store.state.isRTL ? 'text-lg-end' : 'text-lg-start'">
            程式交流網
          </div>
        </div>
        <div class="col-lg-6">
          <ul class="nav nav-footer justify-content-center justify-content-lg-end">
            <li class="nav-item">
              <a href="https://onlinejudge.org/" target="_blank" class="mx-3 text-secondary me-xl-5 me-3 mb-sm-0">
                UVa
              </a>
            </li>
            <li class="nav-item">
              <a href="https://www.pu.edu.tw/" target="_blank" class="mx-3 text-secondary me-xl-5 me-3 mb-sm-0">
                靜宜大學
              </a>
            </li>
            <li class="nav-item">
              <a href="https://cpe.cse.nsysu.edu.tw/index.php" target="_blank"
                class="mx-3 text-secondary me-xl-5 me-3 mb-sm-0">
                CPE
              </a>
            </li>

          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "app-footer",
};
</script>
