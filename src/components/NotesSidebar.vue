<template>
    <div class="notes-sidebar" :class="{ open: isSidebarOpen }">
      <header>
        <button @click="$emit('close-sidebar')">→ 收回</button>
        <button @click="startAddingNote">新增筆記</button>
      </header>
  
      <!-- 符合搜尋條件的筆記列表 -->
      <ul>
        <li v-for="note in notes" :key="note.id" @click="selectNote(note)"  v-if="!isAddingNote && !isEditingNote">
          {{ note.title }}
        </li>
      </ul>
  
      <!-- 新增或編輯筆記區 -->
      <div v-if="isAddingNote">
        <h2>新增筆記</h2>
        <input type="text" v-model="newNote.title" placeholder="標題(必填且不得超過20字)" />
        <textarea v-model="newNote.content" placeholder="內文(必填)"></textarea>
        <button @click="addNote">新增</button>
        <button @click="cancelAddingNote">取消</button>
      </div>
  
      <!-- 選取的筆記內容 -->
      <div v-else-if="selectedNote" v-if="isEditingNote">
        <h2>編輯筆記</h2>
        <input type="text" v-model="selectedNote.title"/>
        <textarea v-model="selectedNote.content"></textarea>
        <button @click="saveNote">保存</button>
        <button @click="deleteNote">刪除</button>
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
        token: this.$cookies.get("token"),
        note_id: '',
      };
    },
    methods: {
      async fetchNotes() {
        try {
          const response = await this.axios.post("/api/forum/get_note", {}, {
            headers: { 
              'Authorization': `Bearer ` + this.token
            }
          });
          this.notes = response.data.success;
        } catch (error) {
          console.error("載入筆記失敗", error);
          ElMessage.error('筆記載入失敗');
        }
      },
      startAddingNote() {
        this.isAddingNote = true;
        this.newNote = { title: '', content: '' };
        this.selectedNote = null;
      },
      async addNote() {
        try {
          const response = await this.axios.post("/api/forum/note", {
            title: this.newNote.title,
            content: this.newNote.content
          }, {
            headers: { 
              'Authorization': `Bearer ` + this.token
            }
          });
          // 顯示成功訊息
          ElMessage.success('新增筆記成功！');

          this.note_id = response.data.note_id;
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
        this.isEditingNote = true;
        this.selectedNote = { ...note };
      },
      async saveNote() {
        try {
          await this.axios.post("/api/forum/note", {
            title: this.selectedNote.title,
            content: this.selectedNote.content,
            note_id: this.note_id
          }, {
            headers: { 
              'Authorization': `Bearer ` + this.token
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
        try {
          await this.axios.post("/api/forum/del_note", {
            note_id: this.selectedNote.id
          }, {
            headers: { 
              'Authorization': `Bearer ` + this.token
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
    mounted() {
      this.fetchNotes();
    }
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
  }
  header input {
    width: 60%;
    padding: 5px;
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
  