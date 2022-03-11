<template>
    <div>
        <el-form label-width="100px" label-position="top" style="text-align: left;">
            <el-form-item label="拖拽排序">
                <div style="width: 60%;float: right;">
                    <el-radio-group v-model="choseindex" @change="handle_change">
                        <el-radio :label="1">互换</el-radio>
                        <el-radio :label="2">后移</el-radio>
                    </el-radio-group>
                </div>
            </el-form-item>
            <el-form-item label="背景颜色：">
                <el-color-picker v-model="bgcolor" show-alpha @input="handle_change" @active-change="activechange">
                </el-color-picker>
            </el-form-item>
            <el-form-item label="宽*高(px)：">
                <div style="display: flex;">
                    <el-input v-model="size[0]" style="width: 40px" @input="handle_change"></el-input>
                    *
                    <el-input v-model="size[1]" style="width: 40px " @input="handle_change"></el-input>
                </div>
                <div style="width: 75%;float: right;">
                    <el-slider v-model="size[0]" :min="0" :max="500" @input="handle_change"></el-slider>
                </div>
                <div style="width: 75%;float: right;">
                    <el-slider v-model="size[1]" :min="0" :max="500" @input="handle_change"></el-slider>
                </div>
            </el-form-item>
            <el-form-item label="间距(px)：">
                <div style="width: 75%;float: right;">
                    <el-slider v-model="size[2]" :min="0" :max="15" @input="handle_change"></el-slider>
                </div>
            </el-form-item>
            <el-form-item label="圆角(%)：">
                <div style="width: 75%;float: right;">
                    <el-slider v-model="size[3]" :min="0" :max="50" @input="handle_change"></el-slider>
                </div>
            </el-form-item>

            <el-form-item label="图片：">
                <div style="text-align: start;">
                    <el-upload multiple action="" :before-upload="sss" :file-list="fileList"
                        accept=".jpg,.jpeg,.png,.JPG,.JPEG" ref="uploadFile" list-type="picture"
                        :before-remove="handle_remove">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <el-button @click="hanlde_clear">清空</el-button>
                        <div class="el-upload__text"> </div>
                        <div class="el-upload__tip" slot="tip">大小自己看着办:)仅支持.jpg/.jpeg/.png格式</div>
                    </el-upload>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        props: {
            csstype: { type: String, default: "" },
            paras: Array,
            show: Boolean
        },
        data() {
            return {
                choseindex: 2,
                bgcolor: "rgba(248, 243, 211, 0.27)",
                //248, 243, 211, 0.275
                size: [60, 80, 5, 1], //宽 高 间距 圆角
                fileList: [],
                imgs: [],
            }
        },
        created() {
            this.imgs = this.paras
            this.fileList = this.paras.map(e => {
                const imgURL = URL.createObjectURL(e.val)
                //             this.fileList.push({ url: imgURL })
                return { url: imgURL }
            })
            this.$emit("maincss", this.$data)
        },
        mounted() {
            this.$refs.uploadFile.$children[0].$refs.input.webkitdirectory = false;
        },
        methods: {
            handle_change() {
                this.$emit("maincss", this.$data)
            },
            activechange(e) {
                this.bgcolor = e;
                this.$emit("maincss", this.$data)
            },
            sss(file) {
                var flag = 1;
                let blob = new Blob([file], { type: file.type });

                this.imgs.some(e => {
                    if (e.name == file.name) {
                        flag = 0
                        setTimeout(() => {
                            this.$message({
                                type: "error",
                                message: e.name + "文件重复",
                                showClose: true
                            })
                        }, 1); 
                        return true;
                    }
                })

                if (flag == 1) {

                    const imgURL = URL.createObjectURL(blob)
                    this.imgs.push({ name: file.name, val: blob, url: imgURL })
                    this.$localForage.setItem(this.csstype, this.imgs)
                    this.fileList.push({ url: imgURL });
                    this.$emit("maincss", this.$data)
                }

                return false
            },

            hanlde_clear() {
                this.fileList = [];
                this.imgs = []
                this.$localForage.setItem(this.csstype, [])
                this.$emit("maincss", this.$data)
            },
            handle_remove(file, fileList) {
                if (file.status == 'success') {
                    var index = fileList.findIndex(function (item) {
                        return item.uid === file.uid;
                    });
                    this.imgs.splice(index, 1)
                    this.$localForage.setItem(this.csstype, this.imgs)
                    this.$emit("maincss", this.$data)
                }

                return false
            },
        }
    }
</script>