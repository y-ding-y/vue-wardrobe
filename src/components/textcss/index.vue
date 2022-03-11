<template>
    <div>
        <el-form label-width="100px" label-position="top" style="text-align: left;">
            <!-- <el-form-item label="顶部姓名：">
                <el-input placeholder="输入ID" v-model="header_name" @input="handle_change">
                </el-input>
            </el-form-item>
            <el-form-item label="顶部信息：">
                <el-input placeholder="随便输点什么" v-model="header_info" @input="handle_change">
                </el-input>
            </el-form-item> -->
            <el-form-item label="底部信息：">
                <el-input type="textarea" placeholder="ID之类随便输的。用','英文逗号分隔" v-model="bottom_info_str"
                    @input="handle_change">
                </el-input>
            </el-form-item>
            <el-form-item label="背景颜色：">
                <div>
                    <el-color-picker v-model="bottomcolor" show-alpha @input="handle_change"
                        @active-change="topactivechange">
                    </el-color-picker>
                </div>
            </el-form-item>

            <el-form-item label="上右下左间距(px)：">
                <div style="width: 60%;float: right;">
                    <el-input v-model="size[1]" style="width: 40px" @input="handle_change"></el-input>
                    <el-input v-model="size[2]" style="width: 40px" @input="handle_change"></el-input>
                    <el-input v-model="size[3]" style="width: 40px" @input="handle_change"></el-input>
                    <el-input v-model="size[4]" style="width: 40px" @input="handle_change"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="文字标签背景色：">
                <div style="display: flex;">
                    <el-color-picker v-model="spancolor" show-alpha @input="handle_change"
                        @active-change="spanactivechange">
                    </el-color-picker>
                </div>
            </el-form-item>
            <el-form-item label="文字色：">
                <div style="display: flex;">
                    <el-color-picker v-model="fontcolor" show-alpha @input="handle_change"
                        @active-change="fontactivechange">
                    </el-color-picker>
                </div>
            </el-form-item>
            <el-form-item label="文字标签高度(px)：">
                <div style="width: 60%;float: right;">
                    <el-slider v-model="size[6]" :min="20" :max="100" @input="handle_change"></el-slider>
                    <!-- <el-input v-model="size[5]" style="width: 80px" @input="handle_change"></el-input> -->
                </div>
            </el-form-item>
            <el-form-item label="文字标签宽度(px)：">
                <div style="width: 60%;float: right;">
                    <el-slider v-model="size[9]" :min="20" :max="100" @input="handle_change"></el-slider>
                    <!-- <el-input v-model="size[5]" style="width: 80px" @input="handle_change"></el-input> -->
                </div>
            </el-form-item>
            <el-form-item label="文字大小(px)：">
                <div style="width: 60%;float: right;">
                    <el-slider v-model="size[7]" :min="10" :max="50" @input="handle_change"></el-slider>
                    <!-- <el-input v-model="size[5]" style="width: 80px" @input="handle_change"></el-input> -->
                </div>
            </el-form-item>

            <el-form-item label="边框颜色(px)：">
                <div style="width: 60%;float: right;">
                    <el-color-picker v-model="bordercolor" show-alpha @input="handle_change"
                        @active-change="bordercolorchange">
                    </el-color-picker>
                </div>
            </el-form-item>
            <el-form-item label="边框粗细(px)：">
                <div style="width: 60%;float: right;">
                    <el-slider v-model="size[8]" :min="0" :max="20" @input="handle_change"></el-slider>
                    <!-- <el-input v-model="size[5]" style="width: 80px" @input="handle_change"></el-input> -->
                </div>
            </el-form-item>
            <el-form-item label="边框样式：">
                <div style="width: 60%;float: right;">
                    <el-select v-model="value" placeholder="请选择" @change="handle_change">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>

                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                header_name: "",
                header_info: "",
                bottom_info_str: "test,estt",
                bottomcolor: "rgba(255, 69, 0,0.11)",

                spancolor: "rgba(255, 69, 0,0.27)",
                fontcolor: "rgba(255, 69, 0,0.81)",
                size: [90, 20, 10, 20, 10, 100, 20, 20, 1,100], //宽 上 右 下 左  文字标签宽 文字标签高度 边框粗细

                bordercolor: "rgba(255, 69, 0,0.81)",

                options: [{
                    value: 'none',
                    label: '无'
                }, {
                    value: 'dotted	',
                    label: '点状边框'
                }, {
                    value: 'dashed',
                    label: '虚线'
                }, {
                    value: 'solid',
                    label: '实线'
                }, {
                    value: 'double',
                    label: '双线'
                },
                {
                    value: 'groove',
                    label: '凹槽边框'
                },
                {
                    value: 'ridge',
                    label: '垄状边框'
                },
                {
                    value: 'inset',
                    label: 'inset 边框'
                },
                {
                    value: 'outset',
                    label: 'outset 边框'
                }],
                value: 'solid'

            }
        },
        computed: {
            bottom_info() {
                var temp = [];
                this.bottom_info_str.split(',').map((e, i) => {
                    temp.push({ key: i, info: e, })
                })
                return temp;
            },
            res() {
                return {

                }
            }
        },
        methods: {
            handle_change() {
                this.$emit("text", this.$data)
            },

            topactivechange(e) {
                this.bottomcolor = e;
                this.$emit("text", this.$data)
            },
            spanactivechange(e) {
                this.spancolor = e;
                this.$emit("text", this.$data)
            },

            fontactivechange(e) {
                this.fontcolor = e;
                this.$emit("text", this.$data)
            },
            bordercolorchange(e) {
                this.bordercolor = e;
                this.$emit("text", this.$data)
            },
        }
    }
</script>
 