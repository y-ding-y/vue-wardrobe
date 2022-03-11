<template>
    <div class="cropper-content">
        <div class="cropper-box">
            <div class="cropper" :style="{height:dialogheight+'px'}">
                <vue-cropper :key="i" ref="cropper" :img="option.img" :outputSize="option.outputSize"
                    :outputType="option.outputType" :info="option.info" :canScale="option.canScale"
                    :autoCrop="option.autoCrop" :autoCropWidth="option.autoCropWidth"
                    :autoCropHeight="option.autoCropHeight" :fixed="option.fixed" :fixedNumber="option.fixedNumber"
                    :full="option.full" :fixedBox="option.fixedBox" :canMove="option.canMove"
                    :canMoveBox="option.canMoveBox" :original="option.original" :centerBox="option.centerBox"
                    :height="option.height" :infoTrue="option.infoTrue" :maxImgSize="option.maxImgSize"
                    :enlarge="option.enlarge" :mode="option.mode" @realTime="realTime" @imgLoad="imgLoad">
                </vue-cropper>
            </div>
            <!--底部操作工具按钮-->

        </div>
        <div class="footer-btn">
            <div class="scope-btn">
                <!-- <label class="btn" for="uploads">选择封面</label>
                <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);"
                    accept="image/png, image/jpeg, image/gif, image/jpg" @change="selectImg($event)"> -->
                <!-- <el-button size="mini" type="danger" plain icon="el-icon-zoom-in" @click="changeScale(1)">放大
                </el-button>
                <el-button size="mini" type="danger" plain icon="el-icon-zoom-out" @click="changeScale(-1)">缩小
                </el-button> -->
                <!-- <el-button size="mini" type="danger" plain @click="rotateLeft">↺ 左旋转</el-button>
                <el-button size="mini" type="danger" plain @click="rotateRight">↻ 右旋转</el-button> -->
            </div>
            <div class="upload-btn">
                <span style="font-size: 16px;height: 30px;line-height: 30px;"> 输出倍数
                    <span style="font-size: 10px;height: 30px;line-height: 30px;">(数值越高，画质越高，输出越慢，下载越卡：)</span>
                </span>
                <el-input style="width: 100px;" v-model="enlarge" @input="change_enlarge"
                    oninput="value=value.replace(/^\.+|[^\d.]/g,'')">
                </el-input>
                <el-button size="mini" type="success" @click="uploadImg('blob')"
                    v-loading.fullscreen.lock="fullscreenLoading">批量裁剪
                </el-button>
                &nbsp;&nbsp;&nbsp;
                <el-button size="mini" type="primary" @click="saveon()">保存配置
                </el-button>
                <el-button size="mini" type="warning" @click="use()">使用上次配置
                </el-button>

            </div>
        </div>
        <!--预览效果图-->
        <!-- <div class="show-preview">
            <div :style="previews.div" class="preview">
                <img :src="previews.url" :style="previews.img">
            </div>
        </div> -->

    </div>
</template>

<script>
    import { VueCropper } from 'vue-cropper'
    export default {
        name: "CropperImage",
        components: {
            VueCropper
        },
        props: ['Name', 'imgsrc'],
        data() {
            return {
                name: this.Name,
                img_src: "",
                previews: {},
                enlarge: 1,
                i: 0,
                temp_preview: {},
                temp_option: {},
                loadcount: 0,
                // fullscreenLoading: false,
            };
        },
        computed: {
            dialogheight() {
                return document.documentElement.clientHeight - 60;
            },

            fullscreenLoading() {
                return this.loadcount > 0
            },
            option: {
                get() {
                    return {
                        img: this.imgsrc,             //裁剪图片的地址
                        outputSize: 1,       //裁剪生成图片的质量(可选0.1 - 1)
                        outputType: 'png',  //裁剪生成图片的格式（jpeg || png || webp）
                        info: true,          //图片大小信息
                        canScale: false,      //图片是否允许滚轮缩放
                        autoCrop: true,      //是否默认生成截图框
                        // autoCropWidth: 230,  //默认生成截图框宽度
                        // autoCropHeight: 150, //默认生成截图框高度
                        fixed: false,         //是否开启截图框宽高固定比例
                        // fixedNumber: [1.53, 1], //截图框的宽高比例
                        full: false,         //false按原比例裁切图片，不失真
                        fixedBox: false,      //固定截图框大小，不允许改变
                        canMove: false,      //上传图片是否可以移动
                        canMoveBox: true,    //截图框能否拖动
                        original: false,     //上传图片按照原始比例渲染
                        centerBox: true,    //截图框是否被限制在图片里面
                        height: true,        //是否按照设备的dpr 输出等比例图片
                        infoTrue: false,     //true为展示真实输出图片宽高，false展示看到的截图框宽高
                        maxImgSize: 3000,    //限制图片最大宽度和高度
                        enlarge: Number(this.enlarge),          //图片根据截图框输出比例倍数
                        //   mode: '230px 150px'  //图片默认渲染方式
                        // mode: 'container', // 图片默认渲染方式 
                    }
                },
                set(val) {

                    return val
                }
            }
        },

        watch: {

        },
        created() {

        },
        methods: {
            change_enlarge() {
                console.log(this.enlarge)
            },
            //初始化函数
            imgLoad(msg) {
                console.log("工具初始化函数=====" + msg)
            },
            //图片缩放
            changeScale(num) {
                num = num || 1
                this.$refs.cropper.changeScale(num)
            },
            //向左旋转
            rotateLeft() {
                this.$refs.cropper.rotateLeft()
            },
            //向右旋转
            rotateRight() {
                this.$refs.cropper.rotateRight()
            },
            //实时预览函数
            realTime(data) {
                this.previews = data
                this.temp_preview = { ...data }
                this.temp_option = { ...this.option }
            },

            uploadImg(type) {
                // this.load=true;

                var temp = [];
                let filedata = Array(this.$localForage.getItem("cut"))
                //this.fullscreenLoading = true;
                Promise.all(filedata).then(value => {
                    if (value[0] != null) {
                        this.loadcount = value[0].length;
                        value[0].map(o => {

                            var blos = o.val;
                            this.$nextTick(() => {
                                this.i++;
                                const imgURL = URL.createObjectURL(blos)
                                this.$refs.cropper.imgs = imgURL
                                //  console.log(this.$refs.cropH)
                                // var temp1 = JSON.parse(localStorage.getItem('option'))
                                // this.$refs.cropper.cropW = temp1.autoCropWidth
                                // this.$refs.cropper.cropH = temp1.autoCropHeight
                                // this.$refs.cropper.changeCropTypeX = temp1.enlarge
                                // this.$refs.cropper.changeCropTypeY = temp1.enlarge
                                // this.$refs.cropper.cropOffsertX = temp1.cropOffsertX
                                // this.$refs.cropper.cropOffsertY = temp1.cropOffsertY 
                                //    this.$refs.cropper.startCrop()
                                this.$refs.cropper.getCropBlob((data) => {
                                    //console.log(this.previews) 
                                    // for IE 
                                    this.loadcount--;

                                    temp.push({ name: o.name, val: data })
                                    this.$localForage.setItem('cut_after', temp);
                                    this.$emit("cut", temp)

                                })
                            })
                        })
                    }
                    //this.fullscreenLoading = false;
                })

                // this.imgsrc.map(e => {
                //     if (['png', 'jpg', 'jpeg'].includes(e.name.substring(e.name.lastIndexOf('.') + 1).toLowerCase())) {
                //         //   this.fileList.push(e) 
                //         this.option.img = e.url
                //         fetch(e.url)
                //             .then(response => response.blob())
                //             .then(res => {
                //                 console.log(e.name)

                //                 console.log(this.option.img)
                //                 // temp.push({ name: e.name, val: res })
                //                 // this.$localForage.setItem('cut', temp)
                //             }).then(() => {
                //                 this.handle_cut('blob');
                //             });
                //     }

                // })
            },

            handle_cut(type) {
                this.$refs.cropper.getCropBlob((data) => {
                    // let formData = new FormData();
                    // formData.append('file', data, "DX.jpg") 
                    this.$localForage.setItem("cut_after", [data])

                    // for IE
                    // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                    //     window.navigator.msSaveOrOpenBlob(data, "test");
                    // }
                    // // for Non-IE (chrome, firefox etc.)
                    // else {
                    //     var a = document.createElement('a');
                    //     //FireFox 需要补充 document.body.appendChild(a) 语法提供支持
                    //     document.body.appendChild(a);
                    //     a.style = 'display: none';
                    //     var url = window.URL.createObjectURL(data);
                    //     a.href = url;
                    //     a.download = "test";
                    //     a.click();
                    //     a.remove();
                    //     window.URL.revokeObjectURL(url);
                    // }
                })
            },
            saveon() {
                this.temp_option.img = "";
                var temp = { ...this.option }
                temp.autoCropWidth = this.$refs.cropper.cropW
                temp.autoCropHeight = this.$refs.cropper.cropH
                temp.cropOffsertX = this.$refs.cropper.cropOffsertX
                temp.cropOffsertY = this.$refs.cropper.cropOffsertY



                // console.log(this.$refs.cropper.getImgAxis())
                // localStorage.setItem('preview', JSON.stringify(this.temp_preview));
                localStorage.setItem('option', JSON.stringify(temp));
                // console.log(this.$refs.cropper.getCropAxis())
            },
            use() {
                //console.log(this.$refs.cropper)
                var temp = JSON.parse(localStorage.getItem('option'))
                this.$refs.cropper.cropW = temp.autoCropWidth
                this.$refs.cropper.cropH = temp.autoCropHeight
                this.$refs.cropper.changeCropTypeX = temp.enlarge
                this.$refs.cropper.changeCropTypeY = temp.enlarge
                this.$refs.cropper.cropOffsertX = temp.cropOffsertX
                this.$refs.cropper.cropOffsertY = temp.cropOffsertY

                this.enlarge = temp.enlarge


                // var temp1 = JSON.parse(localStorage.getItem('option'))
                // this.$refs.cropper.cropW = temp1.autoCropWidth
                // this.$refs.cropper.cropH = temp1.autoCropHeight
                // this.$refs.cropper.changeCropTypeX = temp1.enlarge
                // this.$refs.cropper.changeCropTypeY = temp1.enlarge
                // this.$refs.cropper.cropOffsertX = temp1.cropOffsertX
                // this.$refs.cropper.cropOffsertY = temp1.cropOffsertY

                //this.$set( this.option, JSON.parse(localStorage.getItem('option')));
                //  var temp = JSON.parse(localStorage.getItem('preview'))

            },
        },
    }
</script>

<style scoped lang="scss">
    .cropper-content {
        display: flex;
        flex-direction: column;

        .cropper-box {
            width: 100%;

            .cropper {
                width: 100%;
                height: 300px;
            }
        }

        .show-preview {
            position: absolute;
            top: 0;
            right: 150px;
            width: 150px;
            display: flex;


            .preview {
                overflow: hidden;
                border: 1px solid #67c23a;
                background: #cccccc;
            }
        }
    }

    .footer-btn {
        padding: 10px;
        display: flex;
        position: absolute;
        bottom: 0;

        .scope-btn {
            display: flex;
            justify-content: space-between;
            padding-right: 10px;
        }

        .upload-btn {
            display: flex;
            justify-content: center;
        }

        .btn {
            outline: none;
            display: inline-block;
            line-height: 1;
            white-space: nowrap;
            cursor: pointer;
            text-align: center;
            box-sizing: border-box;
            outline: 0;
            transition: .1s;
            font-weight: 500;
            padding: 8px 15px;
            font-size: 12px;
            border-radius: 3px;
            color: #fff;
            background-color: #409EFF;
            border-color: #409EFF;
            margin-right: 10px;
        }
    }
</style>