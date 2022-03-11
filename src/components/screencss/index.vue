<template>
    <div>
        <el-form label-width="100px" label-position="top" style="text-align: left;">
            <el-form-item label="背景：">
                <div>
                    <el-radio-group v-model="bg" @change="handle_change">
                        <el-radio :label="1">纯色</el-radio>
                        <el-radio :label="2">图片</el-radio>
                    </el-radio-group>
                    <div>
                        <el-color-picker v-if="bg=='1'" v-model="bgcolor" show-alpha @input="handle_change"
                            @active-change="activechange">
                        </el-color-picker>
                        <div v-if="bg=='2'" style="text-align: center;">
                            <el-upload class="upload-demo" action="" :show-file-list="false" :auto-upload="false"
                                :file-list="fileList" :on-change="fileChangeHandle">
                                <img v-if="imageUrl!=''" :src="imageUrl" style="width: 100px;height: 100px;">
                                <i v-else class="el-icon-upload"></i>
                            </el-upload>

                            <div style="display: flex;">
                                <el-radio-group v-model="isrepeat" @change="handle_change">
                                    <el-radio :label="'repeat'">重复</el-radio>
                                    <el-radio :label="'no-repeat'">不重复</el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="底色：">
                <div>
                    <el-color-picker v-model="topcolor" show-alpha @input="handle_change"
                        @active-change="topactivechange">
                    </el-color-picker>
                </div>
            </el-form-item>

            <el-form-item label="栏位:">
                <div v-for="(item,index) in menus" style="display: inline;">
                    &nbsp;&nbsp;&nbsp;
                    <el-tag closable @close="handleClose(item)" :key="index">{{item.name}}</el-tag>
                </div>
                <br>
                <el-input placeholder="例: cloth:衣服(冒号用英文)" v-model="menu_str" class="input-with-select">
                    <template slot="prepend">新增栏位</template>
                    <template slot="append">
                        <el-button slot="append" @click="handle_add" icon="el-icon-plus"></el-button>
                    </template>

                </el-input>
            </el-form-item>
            <el-form-item label="宽度(px)：">
                <div style="width: 60%;float: right;">
                    <!-- <el-input v-model="size[0]" style="width: 80px" @input="handle_change"></el-input> -->
                    <el-slider v-model="size[0]" :min="500" :max="2000" @input="handle_change"></el-slider>
                </div>
            </el-form-item>
            <el-form-item label="上右下左内间距(px)：">
                <div style="width: 60%;float: right;">
                    <el-input v-model="size[1]" style="width: 40px" @input="handle_change"></el-input>
                    <el-input v-model="size[2]" style="width: 40px" @input="handle_change"></el-input>
                    <el-input v-model="size[3]" style="width: 40px" @input="handle_change"></el-input>
                    <el-input v-model="size[4]" style="width: 40px" @input="handle_change"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="圆角(px)：">
                <div style="width: 60%;float: right;">
                    <!-- <el-input v-model="size[0]" style="width: 80px" @input="handle_change"></el-input> -->
                    <el-slider v-model="size[5]" :min="0" :max="50" @input="handle_change"></el-slider>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        props: {
            csstype: { type: String, default: "" },
        },
        data() {
            return {
                bg: 1,
                bgcolor: "rgba(255, 69, 0, 0.18)",
                topcolor: "rgba(255, 255, 255, 0.836)",
                size: [900, 20, 10, 20, 10,5], //宽 上 右 下 左 圆角
                imageUrl: '',
                fileList: [],
                menus: [{ key: "cloth", name: "衣服", arr: [], style: {}, style_img: {}, paras: [] },
                { key: "face", name: "脸型", arr: [], style: {}, style_img: {}, paras: [] },
                { key: "hair", name: "发型", arr: [], style: {}, style_img: {}, paras: [] }],
                menu_str: "",
                isrepeat: "repeat"
            }
        },
        created() {

            this.menus.map(e => {
                e.arr = [];
                e.paras = [];
                let filedata = Array(this.$localForage.getItem(e.key))
                Promise.all(filedata).then(value => {
                    if (value[0] != null) {
                        value[0].map(o => {
                            e.paras = value[0]
                            var blos = o.val;
                            const imgURL = URL.createObjectURL(blos)
                            e.arr.push({
                                url: URL.createObjectURL(o.val),
                                name: o.name,
                                val:o.val
                            })
                        })
                    }

                })
            })
            this.$emit("screencss", this.$data)
        },
        computed: {

        },
        methods: {
            handle_add() {
                var temp = {};
                temp.key = this.menu_str.split(':')[0]
                temp.name = this.menu_str.split(':')[1]
                temp.arr = [];
                temp.paras = [];
                temp.style = {};
                temp.style_img = {};
                this.menus.push(temp)
                this.$emit("screencss", this.$data)
                // return temp;
            },

            handle_change() {
                this.$emit("screencss", this.$data)
            },
            activechange(e) {
                this.bgcolor = e;
                this.$emit("screencss", this.$data)
            },

            topactivechange(e) {
                this.topcolor = e;
                this.$emit("screencss", this.$data)
            },
            fileChangeHandle(file, fileList, name) {
                fileList = fileList.slice(-1);
                this.fileList = fileList
                this.imageUrl = URL.createObjectURL(this.fileList[0].raw)
                this.$localForage.setItem(this.csstype, [{ name: this.fileList.name, val: this.fileList[0].raw }])
                this.$emit("screencss", this.$data)
            },
            handleClose(e) {
                var index = this.menus.findIndex(function (item) {
                    return item.key === e.key;
                });
                this.menus.splice(index, 1)
                this.$emit("screencss", this.$data)
            },
        }
    }
</script>

<style>


</style>