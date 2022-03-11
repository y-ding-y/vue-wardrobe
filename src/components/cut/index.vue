<template>
    <div class="cropper-app" style="width: 100%; display: flex; overflow-y: scroll;"
        :style="{height:dialogheight +'px'}">
        <div style="width: 20%;height: 100%; background-color: rgba(171, 240, 240, 0.904); overflow-y: scroll;">
            <!-- <el-form :model="formValidate" :rules="ruleValidate" ref="formValidate" label-width="100px"
                class="demo-ruleForm">
                <el-form-item label="封面上传" prop="mainImage">
                    <div class="list-img-box">
                        <div v-if="formValidate.mainImage !== ''">
                            <img :src="formValidate.mainImage" style='width:300px;height:150px' alt="自定义封面">
                        </div>
                        <div v-else class="upload-btn" style="height: 120px;" @click="uploadPicture('flagImg')">
                            <i class="el-icon-plus" style="font-size: 30px;"></i>
                            <span>封面设置</span>
                        </div>
                    </div>
                    <input type="hidden" v-model="formValidate.mainImage" placeholder="请添加封面">
                </el-form-item>
            </el-form> -->
            <div style="margin: 10px;">
                <!-- <el-button size="mini" type="success" @click="uploadImg('blob')">批量裁剪 </i>
                </el-button> -->
                <el-upload action=" " list-type="picture" multiple :file-list="fileList" :before-upload="sss">
                    <div>
                        <el-button style="width: 100%;" @click="hanlde_clear">清空</el-button>
                    </div>
                    <div>
                        <el-button style="width: 100%;" size="small" type="primary">点击上传</el-button>
                    </div>

                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>

            </div>

        </div>
        <div style="width: 80%;height: 100%;display: flex;flex-direction: column;">
            <div style="border: 1px solid;">
                <cropper-image @cut="hanlde_cut" :imgsrc="imgsrc" :Name="cropperName" ref="child">
                </cropper-image>
            </div>

        </div>
        <!-- <img :src="img_src" style="height: 100px;width: 100px;"> -->
        <!-- 剪裁组件弹窗 -->

        <el-dialog :width="listWidth+'px'" title="裁剪后" :visible="dialogVisible" @close="handleClose">
            <div style="width: 100%; height:300px;display: flex; flex-wrap: wrap;  overflow-y: scroll;">
                <div v-for="(item,index) in imglist" style="margin: 1px;width: 100px;height: 100px;">
                    <img :src="item.url" :key="index" style="width: 100px;height: 100px;">
                </div>
            </div>
            <el-button @click="handle_down" type="success" v-loading.fullscreen.lock="fullscreenLoading">下载zip
            </el-button>

        </el-dialog>

        <!-- <el-form ref="form" :model="form" label-width="120px" style="width: 50%">
            <el-form-item label="视频抓图保存路径" prop="snapPath">
                <el-input v-model="form.snapPath">
                    <i slot="suffix"
                       class="el-input__icon el-icon-folder"
                       style="cursor: pointer;"
                       @click="handleGetPath('snapPath')"></i>
                </el-input>
            </el-form-item>
        </el-form> -->

    </div>
</template>

<script>
    import CropperImage from "@/components/CropperImage";
    import axios from 'axios'
    import JSZip from 'jszip';
    import FileSaver from 'file-saver';

    export default {
        components: { CropperImage },
        data() {
            return {
                form: {
                    imgSavePath: ''
                },

                formValidate: {
                    mainImage: '',
                },
                ruleValidate: {
                    mainImage: [
                        { required: true, message: '请上传封面', trigger: 'blur' }
                    ],
                },
                //裁切图片参数
                cropperModel: false,
                cropperName: '',
                imgName: '',
                imgVisible: false,

                fileList: [],
                imgsrc: "",
                img_src: "",
                imglist: [],
                dialogVisible: false,
                cutarr: [],

                fullscreenLoading: false,

                listWidth:
                    document.documentElement.clientWidth * 0.8 > 2000
                        ? 2000
                        : document.documentElement.clientWidth * 0.8,

            }
        },
        created() {
            this.$localForage.setItem('cut', [])
        },
        computed: {
            dialogheight() {
                return document.documentElement.clientHeight;
            },

            dialogwidth() {
                console.log()
                return document.documentElement.clientWidth;
            },
            // target() {
            // 	return new THREE.Vector3(this.x, this.y, this.z)
            // }, 
        },
        methods: {
            fileChange(e) {
                console.log(e)
                // try {
                //     const fu = document.getElementById('file')
                //     if (fu == null) return
                //     this.form.imgSavePath = fu.files[0].path
                //     console.log(fu.files[0].path)
                // } catch (error) {
                //     console.debug('choice file err:', error)
                // }
            },
            btnChange() {
                var file = document.getElementById('file')
                file.click()
            },
            handleGetPath(path) {
                /*
                * 该方法只支持IE.
                * 语法：strDir=Shell.BrowseForFolder(Hwnd,Title,Options,[RootFolder])
                * 参数：Hwnd：包含对话框的窗体句柄（handle），一般设置为0
                * Title：将在对话框中显示的说明，为字符串
                * Options：使用对话框的特殊方式，为长整数，一般设置为0
                * RootFolder：（可选的），用来设置浏览的最顶层文件夹，缺省时为“桌面”，可以将其设置为一个路径或“特殊文件夹常数”
                * */
                try {
                    let filePath;
                    let objSrc = new ActiveXObject("Shell.Application").BrowseForFolder(0, '请选择保存路径', 0, '');
                    if (objSrc != null) {
                        filePath = objSrc.Items().Item().Path;
                        if (filePath.charAt(0) == ':') {
                            alert('请选择文件夹.');
                            return false;
                        }
                        this.form[path] = filePath;
                    }
                } catch (e) {
                    alert(e + '请设置IE，Internet选项－安全－自定义级别－将ActiveX控件和插件前3个选项设置为启用，然后再尝试。');
                    return false;
                }
            },


            //封面设置
            uploadPicture(name) {
                this.cropperName = name;
                this.cropperModel = true;
            },

            uploadfiles(file, fileList) {
                var temp = [];
                this.fileList = [];
                //  this.fileList = [...fileList]
                fileList.map(e => {
                    if (['png', 'jpg', 'jpeg'].includes(e.name.substring(e.name.lastIndexOf('.') + 1).toLowerCase())) {
                        this.fileList.push(e)
                        //     // fetch(e.url)
                        //     //     .then(response => response.blob())
                        //     //     .then(res => {
                        //     //         temp.push({ name: e.name, val: res })
                        //     //         this.$localForage.setItem('cut', temp)
                        //     //     });
                    }
                })

            },
            hanlde_cut(e) {
                this.dialogVisible = true;
                this.imglist = e.map(o => {
                    var blos = o.val;
                    const imgURL = URL.createObjectURL(blos)
                    o.url = imgURL
                    return o;
                });


            },

            // handle_down() {
            //     this.imglist.map((o, i) => {
            //         this.download(i, o.val, o.name).then(function (data) {
            //             console.log(data)
            //             data.click();
            //         })
            //     });
            // },

            // 批量下载
            download(name, href) {
                var a = document.createElement('a')
                var e = document.createEvent('MouseEvents')  // 创建鼠标事件对象
                e.initEvent('click', false, false) // 初始化事件对象
                a.href = href  // 设置下载地址
                a.download = name // 设置下载文件名
                a.dispatchEvent(e) // 给指定的元素，执行事件click事件 

            },

            filesToRar(arrImages, filename) {
                let _this = this;
                let zip = new JSZip();
                let cache = {};
                let promises = [];
                _this.title = '正在加载压缩文件';
                //               arrImages:文件list:[{fileUrl:文件url,renameFileName:文件名}]
                this.fullscreenLoading = true;

                for (let item of this.imglist) {
                    var promise = { item };
                    zip.file(item.name, item.val, { binary: true }); // 逐个添加文件
                    cache[item.name] = item.val;
                    promises.push(promise);
                }
                console.log(promises)
                Promise.all(promises).then(() => {
                    zip.generateAsync({ type: "blob" }).then(content => {
                        _this.title = '正在压缩';
                        // 生成二进制流
                        FileSaver.saveAs(content, filename); // 利用file-saver保存文件 自定义文件名
                        _this.title = '压缩完成';
                        this.fullscreenLoading = false;
                    });
                }).catch(res => {
                    _this.$message.error('文件压缩失败');
                });
            },

            handle_down() {
                this.filesToRar([], "");
                // this.imglist.forEach(item => {
                //     console.log(item.val)
                //     this.download(item.name, window.URL.createObjectURL(item.val))
                // })

                // var temp = this.imglist;

                // for (var i = 0; i < temp.length; i++) {
                //     console.log(i)
                //     var aDom = document.createElement('a')//创建标签
                //     var evt = document.createEvent('HTMLEvents')//创建事件
                //     evt.initEvent('click', false, false)//初始化事件，绑定点击事件，不冒泡，不阻止浏览器默认行为
                //     aDom.download = temp[i].name
                //     aDom.href = window.URL.createObjectURL(temp[i].val);//对地址进行编码
                //     aDom.dispatchEvent(evt)//触发事件
                //     aDom.click()
                // }
            },

            uploadImg(type) {
                this.dialogVisible = true;
                let filedata = Array(this.$localForage.getItem("cut_after"))
                Promise.all(filedata).then(value => {
                    if (value[0] != null) {
                        value[0].map(o => {
                            var blos = o.val;
                            const imgURL = URL.createObjectURL(blos)
                            //this.$refs.cropper.imgs = imgURL 
                        })

                    }

                })

            },

            hanlde_clear() {
                this.fileList = [];
                this.imgsrc = ""
                this.cutarr = [];
                this.$localForage.setItem('cut', [])
            },

            sss(file) {
                let blob = new Blob([file], { type: file.type });
                this.cutarr.push({ name: file.name, val: blob })
                const imgURL = URL.createObjectURL(blob)
                this.imgsrc = imgURL
                this.fileList.push({ ...file, ...{ url: imgURL } })
                this.$localForage.setItem('cut', this.cutarr)
                return false
            },
            handleClose() {
                this.dialogVisible = false;
            },
        }
    }
</script>
<style scoped>
    .upload-list-cover {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 0 40px;
        align-items: center;
        background: rgba(0, 0, 0, .6);
        opacity: 0;
        transition: opacity 1s;
    }

    .cover_icon {
        font-size: 30px;
    }

    .upload-btn {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        border: 1px solid #cccccc;
        border-radius: 5px;
        overflow: hidden;
        box-shadow: 0 0 1px #cccccc;
    }

    .upload-btn:hover {
        border: 1px solid #69b7ed;
    }

    .upload-btn i {
        margin: 5px;
    }


    *::-webkit-scrollbar {
        width: 7px;
        height: 10px;
        background-color: transparent;
    }

    /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
    *::-webkit-scrollbar-track {
        background-color: #57aec488;
    }

    /*定义滚动条轨道 内阴影+圆角*/
    *::-webkit-scrollbar-thumb {
        background-color: #29ac85da;
        border-radius: 6px;
    }

    /*定义滑块 内阴影+圆角*/
    .scrollbarHide::-webkit-scrollbar {
        display: none
    }

    .scrollbarShow::-webkit-scrollbar {
        display: block
    }
</style>