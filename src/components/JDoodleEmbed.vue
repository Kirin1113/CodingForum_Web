<template>
    <div>
      <!-- JDoodle的嵌入容器 -->
      <div ref="jdoodleContainer"></div>
    </div>
</template>
  
<script>
  export default {
    name: 'JDoodleEmbed',
    mounted() {
      // 確保在組件掛載後執行嵌入的JavaScript代碼
      this.loadJDoodle();
    },
    methods: {
      loadJDoodle() {
        // 創建一個`script`元素
        const script = document.createElement('script');
        script.src = 'https://www.jdoodle.com/assets/jdoodle-pym.min.js';
        script.type = 'text/javascript';
        script.onload = () => {
          // 當script載入完畢後，將JDoodle嵌入代碼插入
          const div = document.createElement('div');
          div.setAttribute('data-pym-src', 'https://www.jdoodle.com/embed/v1/96bece6a9329ef85');
          this.$refs.jdoodleContainer.appendChild(div);
  
          // 確保Pym.js初始化
          // @ts-ignore
          if (window.pym) {
            // @ts-ignore
            window.pym.autoInit();
          }
        };
  
        // 將script元素添加到document
        document.body.appendChild(script);
      }
    }
  };
</script>
  
  