<template>
    <div class="uploadImg">
      <form action name="fileinfo">
        <div class="img_box">
          <div
            class="img_size"
            v-for="(item,index) of imgList"
            :key="index"
            v-show="imgList.length!=0"
          >
            <img v-if="item.file.type.indexOf('image') !== -1" :src="item.file.src">
            <div class="remove_logo" @click="fileDel" v-show="!imgListData.status">×</div>
          </div>
          <div class="add_img" @click="fileClick" v-show="addState && !imgListData.status">
            <span>十</span>
          </div>
<!--          <div @click="uploadImage">-->
<!--            图片上传-->
<!--          </div>-->
          <input
            id="inpu"
            name="files"
            style="display: none;"
            @change="fileChange($event)"
            type="file"
            ref="file"
            accept="image/*"
          >
        </div>
      </form>
    </div>
</template>

<script>
export default {
  name: 'uploadImg',
  data () {
    return {
      imgList: [],
      addState: true
    }
  },
  props: ['imgListData'],
  watch: {
    imgList () {
      if (this.imgList.length === 4) {
        this.addState = false
      } else {
        this.addState = true
      }
    }
  },
  mounted () {
    this.getImgData()
  },
  methods: {
    getImgData () {
      if (this.imgListData.img.length) {
        for (let i = 0; i < this.imgListData.img.length; i++) {
          let file = new File([this.imgListData.img[i]], '', {
            type: 'image/jpeg'
          })
          // options属性： 包含type 和 lastModified
          file.src = 'data:image/jpeg;base64,' + this.imgListData.img[i]
          // file.type = 'image/jpeg'
          this.imgList.push(
            {
              file: file
            }
          )
        }
      }
    },
    fileClick () {
      document.getElementById('inpu').click()
    },
    fileChange (el) {
      // const list = this.$refs.file.files
      if (!el.target.files[0].size) return
      this.fileList(el.target)
      el.target.value = ''
    },
    fileList (fileList) {
      let files = fileList.files
      for (let i = 0; i < files.length; i++) {
        // 判断是否为文件夹
        if (files[i].type !== '') {
          this.fileAdd(files[i])
        } else {
          // 文件夹处理
          this.folders(fileList.items[i])
        }
      }
    },
    // 文件夹处理
    folders (files) {
      let _this = this
      // 判断是否为原生file
      if (files.kind) {
        files = files.webkitGetAsEntry()
      }
      files.createReader().readEntries(function (file) {
        for (let i = 0; i < file.length; i++) {
          if (file[i].isFile) {
            _this.foldersAdd(file[i])
          } else {
            _this.folders(file[i])
          }
        }
      })
    },
    foldersAdd (entry) {
      let _this = this
      entry.file(function (file) {
        _this.fileAdd(file)
      })
    },
    fileAdd (file) {
      // 总大小
      this.size = this.size + file.size
      let reader = new FileReader()
      reader.vue = this
      reader.readAsDataURL(file)
      reader.onload = function () {
        file.src = this.result
        this.vue.imgList.push({
          file
        })
      }
      console.log(this.imgList)
      this.$emit('getTreeData', this.imgList)
    },
    fileDel (index) {
      this.imgList.splice(index, 1)
    }
  }
}
</script>

<style scoped>
  .img_box {
    width: 100%;
    padding: 0 2%;
    display: flex;
    flex-wrap: wrap;
  }
  .img_size {
    position: relative;
    width: 80px;
    height: 80px;
    padding: 5px;
  }
  img {
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }
  .remove_logo {
    position: absolute;
    width: 20px;
    height: 20px;
    background: #ffffff;
    border-radius: 25px;
    top: 5px;
    right: 5px;
    text-align: center;
    line-height: 20px;
    font-size: 16px;
    color: #777777;
  }
  .add_img {
    width: 80px;
    height: 80px;
    margin-top: 5px;
    text-align: center;
    line-height: 80px;
    font-size: 30px;
    color: #777777;
    border: 1px solid #cccccc;
    border-radius: 5px;
    cursor: pointer;
  }
</style>
