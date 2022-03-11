<template>
    <div>
        <div v-show="codeId" ref="QrcodePage"
            style="z-index:-1111;position:absolute;left:-99999;width: 450px;height: 475px;background-size: cover;">
            <div id="qrCode" v-if="codeId">
                <QrcodeVue :logoSrc="imageUrl" :key="random" :callback="texte" :text="codeValue" :logoScale="50"
                    :size="750"></QrcodeVue>
                <p style="text-align: center; font-size: 1.5625rem;">{{ codeNumber }}</p>
            </div>
        </div>
    </div>
</template>
<script>
    let loadingInstance = '';
    import QrcodeVue from 'vue-qr';
    import html2canvas from 'html2canvas';
    import JSZip from 'jszip';
    import FileSaver from 'file-saver';
    export default {
        name: 'qrcode',
        components: {
            QrcodeVue
        },
        data() {
            return {
                random: '1',
                codeId: '',
                qrcodeUrl: '',
                imageUrl: '',
                // imageUrl: 'https://shop.mmdddd.com/workShopWeb/static/img/72.png',//logo
                qrContentImage: '',
                codeValue: '',
                initCodeVal: 'http://xcx.nmte.net/tips/index.html',
                codeNumber: '',
                arr: [],
                qrcodeArr: [],
                index: 0
            };
        },
        watch: {
            index(newName, oldName) {
                if (newName != oldName && newName <= this.arr.length - 1) {
                    setTimeout(_ => {
                        this.setarr(this.arr);
                    }, 0);
                } else {
                    this.$nextTick(_ => {
                        loadingInstance.close();
                    });
                }
            }
        },
        created() {
        },
        mounted() { },
        methods: {
            texte(url, qid) {
                setTimeout(_ => {
                    this.createImgs();
                }, 100);
            },
            setarr(arr) {
                this.arr = arr;
                if (this.index > this.arr.length - 1) {
                    this.index = 0;
                }
                let index = this.index || 0;
                loadingInstance = this.$Loading.service({
                    lock: true,
                    text: '二维码码批量下载中，请稍后...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                this.codeNumber = this.arr[index].codeNumber;
                this.arr[index].codeId ? (this.codeId = this.arr[index].codeId) : this.$Message.warn('获取信息失败，请刷新重试');
                this.codeValue = this.initCodeVal + '?codeId=' + this.arr[index].codeId + '&codeNumber=' + this.arr[index].codeNumber;
                this.random = Math.random();
            },
            createImgs() {
                var that = this;
                if (that.index <= that.arr.length - 1 && that.codeId) {
                    let shareContent = that.$refs.QrcodePage,
                        width = shareContent.offsetWidth,
                        height = shareContent.offsetHeight,
                        canvas = document.createElement('canvas'),
                        scale = 1;
                    canvas.width = width * scale;
                    canvas.height = height * scale;
                    canvas.style.width = (shareContent.clientWidth * scale) / 100 + 'rem';
                    canvas.style.height = (shareContent.clientHeight * scale) / 100 + 'rem';
                    canvas.getContext('2d').scale(scale, scale);
                    let opts = {
                        scale: scale,
                        canvas: canvas,
                        logging: false,
                        width: width,
                        height: height,
                        useCORS: true
                    };
                    html2canvas(shareContent, opts)
                        .then(function (canvas) {
                            const qrContentImage = canvas.toDataURL('image/jpeg', 1.0);
                            if (that.index <= that.arr.length - 1 && that.codeId) {
                                that.qrcodeArr.push({
                                    url: qrContentImage,
                                    name: that.arr[that.index].codeNumber
                                });
                            }
                            if (that.codeId) {
                                that.index++;
                            }
                            if (that.qrcodeArr.length == that.arr.length) {
                                that.packageImages();
                                that.codeId = null;
                            }
                        })
                        .catch(function (reason) {
                            console.log(reason);
                        });
                }
            },
            packageImages() {
                let that = this;
                const zip = new JSZip();
                const cache = {};
                setTimeout(_ => {
                    let arr = that.qrcodeArr;
                    arr.forEach((item, index) => {
                        let fileName = item.name;
                        zip.file(fileName + '.png', item.url.substring(22), { base64: true })
                        cache[fileName] = item.url
                    })
                    zip.generateAsync({ type: "blob" }).then(content => {
                        FileSaver.saveAs(content, "二维码.zip")
                    })
                }, 0)
            }
        }
    };
</script>
<style  scoped="scoped">
    #qrCode {
        width: 375px;
        height: 375px;
        position: absolute;
        top: 52%;
        left: 50%;
        transform: translate(-50%, -50%);

        img {
            display: block;
            width: 100%;
            height: 100%;
        }
    }
</style>