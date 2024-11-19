<template>
    <div class="notes-sidebar" :class="{ open: isSidebarOpen }">
      <header>
        <div v-if="!selectedNote" @click="$emit('close-sidebar')" style="cursor: pointer; font-size: 1.5em;" data-bs-toggle="tooltip" title="收回">
          <i class="fa-solid fa-arrow-right"></i>
        </div>
        <div v-if="selectedNote && !isEditingNote" @click="backNote" style="cursor: pointer; font-size: 1.5em;" data-bs-toggle="tooltip" title="返回">
          <i class="fa-solid fa-arrow-left"></i>
        </div>
        <input 
          type="text" 
          class="form-control" 
          placeholder="輸入關鍵字進行搜索" 
          v-model="searchQuery"
          v-if="!selectedNote && !isEditingNote && !isAddingNote"
          @input="searchNote"
        />
        <div v-if="!selectedNote" @click="startAddingNote" style="cursor: pointer; font-size: 1.5em;" data-bs-toggle="tooltip" title="新增筆記">
          <i class="fa-solid fa-plus"></i>
        </div>
        <div v-if="selectedNote && !isEditingNote" @click="startEditingNote" style="cursor: pointer; font-size: 1.5em;" data-bs-toggle="tooltip" title="編輯筆記">
          <i class="fa-solid fa-file-pen"></i>
        </div>
      </header>
      <!-- 符合搜尋條件的筆記列表 -->
      <ul>
        <li v-for="note in notes" :key="note.id" @click="selectNote(note)"  v-if="!isAddingNote && !selectedNote">
          {{ note.title }}
        </li>
      </ul>
  
      <!-- 新增或編輯筆記區 -->
      <div v-if="isAddingNote">
        <h2>新增筆記</h2>
        <input type="text" v-model="newNote.title" placeholder="標題(必填且不得超過20字)" />
        <textarea v-model="newNote.content" placeholder="內文(必填)"></textarea>
        <div style="display: flex; gap: 20px; align-items: center;">
          <div @click="addNote" style="cursor: pointer; font-size: 1.5em;" data-bs-toggle="tooltip" title="新增">
              <i class="fa-solid fa-plus-circle"></i>
          </div>
          <div @click="cancelAddingNote" style="cursor: pointer; font-size: 1.5em;" data-bs-toggle="tooltip" title="取消">
              <i class="fa-solid fa-xmark"></i>
          </div>
        </div>
      </div>
      <div v-else-if="selectedNote" v-if="!isEditingNote">
        <h2> {{selectedNote.title}} </h2>
        <span> {{selectedNote.content}} </span>
      </div>
      <!-- 選取的筆記內容 -->
      <div v-if="isEditingNote">
        <h2 class="justify-cent">編輯筆記</h2>
        <input type="text" v-model="selectedNote.title"/>
        <textarea v-model="selectedNote.content"></textarea>
        <div style="display: flex; gap: 20px; align-items: center;">
          <div @click="saveNote" style="cursor: pointer; font-size: 1.5em;" data-bs-toggle="tooltip" title="保存">
            <i class="fa-solid fa-floppy-disk"></i>
          </div>
          <div @click="deleteNote" style="cursor: pointer; font-size: 1.5em;" data-bs-toggle="tooltip" title="刪除">
            <i class="fa-solid fa-trash"></i>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ElMessage } from 'element-plus'; // 引入 ElMessage
  
  export default {
    props: ['isSidebarOpen', 'token'],
    data() {
      return {
        isAddingNote: false,
        isEditingNote: false,
        notes: [], // 確保初始化為空數組
        newNote: { title: '', content: '' },
        selectedNote: null,
        searchQuery: '', // 綁定關鍵字
      };
    },
    created() {
      this.fetchNotes();
    },
    methods: {
      searchNote() {
        const token = this.$cookies.get("token");
        // 當輸入關鍵字時發送請求
        if (this.searchQuery.length > 0) {
            this.axios
            .post("/api/forum/search_note", {
                query: this.searchQuery, // 傳遞查詢關鍵字
            }, {
              headers: { 
                'Authorization': `Bearer ` + token
              }
            })
            .then((res) => {
                console.log(res.data);
                this.notes = res.data; // 更新查詢結果
            })
            .catch((err) => {
                console.log(err);
            });
        } else {
            this.notes = []; // 若輸入框為空則清除結果
            this.searchQuery = '';
            this.fetchNotes(); // 重新載入筆記
        }
      },
      async fetchNotes() {
        // 檢查是否有 token
        const token = this.$cookies.get("token");
        if (!token) {
          console.log("未登入，無法載入筆記");
          return; // 沒有 token 時跳過請求
        }

        try {
          const response = await this.axios.post("/api/forum/get_note", {}, {
            headers: { 
              'Authorization': `Bearer ` + token
            }
          });
          this.notes = response.data.success;
        } catch (error) {
          console.error("載入筆記失敗", error);
        }
      },
      startAddingNote() {
        this.isAddingNote = true;
        this.newNote = { title: '', content: '' };
        this.selectedNote = null;
      },
      async addNote() {
        const token = this.$cookies.get("token");
        try {
          await this.axios.post("/api/forum/note", {
            title: this.newNote.title,
            content: this.newNote.content
          }, {
            headers: { 
              'Authorization': `Bearer ` + token
            }
          });
          // 顯示成功訊息
          ElMessage.success('新增筆記成功！');

          this.isAddingNote = false;
          this.fetchNotes();  // 重新載入筆記
          this.newNote = { title: '', content: '' };
        } catch (error) {
          console.error("新增筆記失敗", error);
          // 顯示錯誤訊息
          ElMessage.error('新增筆記失敗');
        }
      },
      cancelAddingNote() {
        this.isAddingNote = false;
        this.newNote = { title: '', content: '' };
      },
      selectNote(note) {
        this.isAddingNote = false;
        this.isEditingNote = false;
        this.selectedNote = { ...note };
      },
      startEditingNote() {
        this.isEditingNote = true;
      },
      backNote() {
        this.isAddingNote = false;
        this.selectedNote = null;
      },
      async saveNote() {
        const token = this.$cookies.get("token");
        try {
          await this.axios.post("/api/forum/note", {
            title: this.selectedNote.title,
            content: this.selectedNote.content,
            note_id: this.selectedNote.id
          }, {
            headers: { 
              'Authorization': `Bearer ` + token
            }
          });
          // 顯示成功訊息
          ElMessage.success('筆記已保存');

          this.isEditingNote = false;
          this.fetchNotes();
        } catch (error) {
          console.error("保存筆記失敗", error);
          // 顯示錯誤訊息
          ElMessage.error('保存筆記失敗');
        }
      },
      async deleteNote() {
        const token = this.$cookies.get("token");
        try {
          await this.axios.post("/api/forum/del_note", {
            note_id: this.selectedNote.id
          }, {
            headers: { 
              'Authorization': `Bearer ` + token
            }
          });
          // 顯示成功訊息
          ElMessage.success('筆記已刪除');

          this.selectedNote = null;
          this.fetchNotes();
          this.isEditingNote = false;
        } catch (error) {
          console.error("刪除筆記失敗", error);
          // 顯示錯誤訊息
          ElMessage.error('刪除筆記失敗');
        }
      }
    },
  };
  </script>
  
  <style scoped>
  .notes-sidebar {
    width: 400px;
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #f9f9f9;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 9999;
    max-height: 100vh; /* 設置最大高度為視口高度 */
    overflow-y: auto; /* 啟用垂直滾動條 */
  }
  .notes-sidebar.open {
    transform: translateX(0);
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ddd; /* 下方分隔線 */
  }
  header input {
    width: 60%;
    padding: 5px;
  }
  h2 {
    text-align: center; /* 置中標題 */
    margin: 0;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
  }
  li:hover {
    background-color: #f0f0f0;
  }
  textarea {
    width: 100%;
    height: 100px;
    margin-top: 10px;
  }
  button {
    margin: 5px;
  }
  </style>
  