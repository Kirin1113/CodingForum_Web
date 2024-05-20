<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card z-index-0">
          <div class="card-body">
            <form role="form" class="mx-auto col-xl-9">
              <div class="mb-3">
                <p>目前頭貼</p>
                <p>若手機無法顯示上傳圖片 請使用電腦版</p>
                <img :src="$global_url + picture" alt="" class="user_pic">
                <p v-if="max_pic" class="mt-4">待更新頭貼</p>
                <div class="upload-example__cropper-wrapper">
                  <cropper ref="cropper" class="upload-example__cropper" check-orientation :src="image.src"
                    :stencil-props="{
                      aspectRatio: 1 / 1,
                    }" :auto-zoom="true" />
                  <div class="vertical-buttons">
                    <square-button title="Maximize" @click="maximize()" v-if="max_pic">
                      <img :src="require('@/assets/img/resize-maximize.svg')" />
                    </square-button>
                  </div>
                </div>
                <div class="upload-example__buttons-wrapper">
                  <button class="upload-example__button" type="button" @click="$refs.file.click()">
                    <input ref="file" type="file" accept="image/*" @change="loadImage($event)" />
                    {{ upload_userpic }}
                  </button>
                </div>
                <p v-if="max_pic">調整裁切圖片的區域後 直接按下方更新就好</p>
              </div>
              <div class="text-center">
                <soft-button color="dark" full-width variant="gradient" class="mt-2 mb-2" @click.stop.prevent="edit()"
                  v-if="max_pic">更新</soft-button>
                <soft-button color="warning" full-width variant="gradient" class="mb-5"
                  @click.stop.prevent="$router.go(-1)">取消</soft-button>
                <soft-button color="danger mt-4" full-width variant="gradient" class="mt-2 mb-2" data-bs-toggle="modal"
                  data-bs-target="#deletepic" @click.stop.prevent="">回復預設頭貼</soft-button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="deletepic" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">是否確認要回復預設頭貼</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal"
            @click.stop.prevent="deletepic()">確定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SoftButton from "@/components/SoftButton.vue";
import SquareButton from "../components/SquareButton.vue";
import { ElMessage } from "element-plus";
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css';

function getMimeType(file, fallback = null) {
  const byteArray = new Uint8Array(file).subarray(0, 4);
  let header = '';
  for (let i = 0; i < byteArray.length; i++) {
    header += byteArray[i].toString(16);
  }
  switch (header) {
    case '89504e47':
      return 'image/png';
    case '47494638':
      return 'image/gif';
    case 'ffd8ffe0':
    case 'ffd8ffe1':
    case 'ffd8ffe2':
    case 'ffd8ffe3':
    case 'ffd8ffe8':
      return 'image/jpeg';
    default:
      return fallback;
  }
}
export default {
  name: "EditPic",
  components: {
    SoftButton,
    Cropper,
    SquareButton
  },
  data() {
    return {
      max_pic: false,
      upload_userpic: '上傳頭貼',
      temp: '',
      picture: '',
      token: this.$cookies.get("token"),
      token_user_id: this.$cookies.get("user_id"),
      token_user_account: this.$cookies.get("user_account"),
      user: [],
      image: {
        src: null,
        type: null,
      },
    };
  },
  created() {
    this.axios
      .post("/api/auth/token_user", {
      }, {
        headers: {
          'Authorization': `Bearer ` + this.token
        }
      })
      .then((res) => {
        console.log(res);
        this.picture = res.data.user.picture
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response);
          if (error.response.status == 402) {
            ElMessage.error(error.response.data.error);
          }
        }
      });
  },
  methods: {
    edit() {
      if (!this.token) {
        ElMessage.error("請先登入以進行操作");
        this.$router.push({ name: 'Sign In' });
      }
      const { canvas } = this.$refs.cropper.getResult();
      if (canvas) {
        canvas.toBlob(blob => {
          this.axios
            .post("/api/auth/edit_user", {
              picture: blob,
            }, {
              headers: {
                'Authorization': `Bearer ` + this.token,
                'Content-Type': 'multipart/form-data',
              }
            })
            .then((res) => {
              console.log(res);
              this.$router.push({
                name: 'Profile', params: { user_account: this.token_user_account }
              })
              ElMessage({
                message: "更新成功，請重新登入",
                type: "success",
                duration: 3000,
              });
            })
            .catch(function (error) {
              if (error.response) {
                console.log(error.response);
                if (error.response.status == 402) {
                  ElMessage.error(error.response.data.error);
                }
              }
            });
        }, 'image/jpeg');
      }
    },
    reset() {
      this.image = {
        src: null,
        type: null,
      };
    },
    loadImage(event) {
      // Reference to the DOM input element
      const { files } = event.target;
      console.log(files)
      this.upload_userpic = '重新上傳頭貼'
      // Ensure that you have a file before attempting to read it
      if (files && files[0]) {
        // 1. Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
        if (this.image.src) {
          URL.revokeObjectURL(this.image.src);
        }
        // 2. Create the blob link to the file to optimize performance:
        const blob = URL.createObjectURL(files[0]);
        // Create a new FileReader to read this image binary data
        const reader = new FileReader();
        // Define a callback function to run, when FileReader finishes its job
        reader.onload = (e) => {
          // Note: arrow function used here, so that "this.image" refers to the image of Vue component
          this.image = {
            // Read image as base64 and set it as src:
            src: blob,
            // Determine the image type to preserve it during the extracting the image from canvas:
            type: getMimeType(e.target.result, files[0].type),
          };
          this.max_pic = true
          this.maximize()
        };
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsArrayBuffer(files[0]);
      }
    },
    destroyed() {
      // Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
      if (this.image.src) {
        URL.revokeObjectURL(this.image.src);
      }
    },
    maximize() {
      const { cropper } = this.$refs;
      const center = {
        left: cropper.coordinates.left + cropper.coordinates.width / 2,
        top: cropper.coordinates.top + cropper.coordinates.height / 2,
      };
      cropper.setCoordinates([
        ({ coordinates, imageSize }) => ({
          width: imageSize.width,
          height: imageSize.height,
        }),
        ({ coordinates, imageSize }) => ({
          left: center.left - coordinates.width / 2,
          top: center.top - coordinates.height / 2,
        }),
      ]);
    },
    deletepic() {
      if (!this.token) {
        ElMessage.error("請先登入以進行操作");
        this.$router.push({ name: 'Sign In' });
      }
      this.axios
        .post("/api/auth/edit_user", {
          picture: 'default_user.png',
          reset: 1,
        }, {
          headers: {
            'Authorization': `Bearer ` + this.token,
          }
        })
        .then((res) => {
          console.log(res);
          this.$router.push({
            name: 'Profile', params: { user_account: this.token_user_account }
          })
          ElMessage({
            message: "回復成功",
            type: "success",
            duration: 3000,
          });
        })
        .catch(function (error) {
          if (error.response) {
            console.log(error.response);
            if (error.response.status == 402) {
              ElMessage.error(error.response.data.error);
            }
          }
        });
    },
  },
}
</script>

<style >
.el-select-dropdown__item {
  width: 300px;
  width: 100%;
}

.el-select {
  display: block !important;
}

.codemirror-container {
  display: block;
}

.upload-example {
  margin-top: 20px;
  margin-bottom: 20px;
  user-select: none;
}

.upload-example__cropper {

  max-height: 500px;
}

.upload-example__cropper-wrapper {
  position: relative;
}

.upload-example__reset-button {
  position: absolute;
  right: 20px;
  bottom: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  width: 42px;
  background: rgba(63, 94, 179, 0.7);
  transition: background 0.5s;
}

.upload-example__reset-button:hover {
  background: rgba(63, 94, 179, 0.808);
}

.upload-example__buttons-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 17px;
}

.upload-example__button {
  border: none;
  outline: solid transparent;
  color: white;
  font-size: 16px;
  padding: 10px 20px;
  background: rgba(0, 119, 255, 0.7);
  cursor: pointer;
  transition: background 0.5s;
  margin: 0 16px;
}

.upload-example__button:hover,
.upload-example__button:focus {
  background: rgba(43, 138, 247, 0.7);
}

.upload-example__button input {
  display: none;
}

.upload-example__file-type {
  position: absolute;
  top: 20px;
  left: 20px;
  background: #0d0d0d;
  border-radius: 5px;
  padding: 0px 10px;
  padding-bottom: 2px;
  font-size: 12px;
  color: white;
}

.vertical-buttons {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
}
</style>

<style scoped>
@media (min-width: 1200px) {
  .user_pic {
    width: 20%;
  }

  .upload-example__cropper {
    width: 30%;
  }
}

@media (max-width: 1200px) {
  .user_pic {
    width: 100%;
  }

  .upload-example__cropper {
    width: 100%;
  }
}
</style>