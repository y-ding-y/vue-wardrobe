<template>
    <div>
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column label="日期" width="120">
                <template slot-scope="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column prop="name" label="文件名" width="120">
            </el-table-column>
            <el-table-column prop="description" label="描述" show-overflow-tooltip>
            </el-table-column>
        </el-table>
        <div>
            <el-button @click="downloadSelection()">批量下载</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'App',
        data() {
            return {
                tableData: [{
                    date: '2016-05-03',
                    name: '1.19dce30e.webp',
                    description: '图片',
                    href: '/img/1.19dce30e.webp'
                }, {
                    date: '2016-05-03',
                    name: 'logo.82b9c7a5.png',
                    description: '图片',
                    href: '/img/logo.82b9c7a5.png'
                }],
                multipleSelection: []
            }
        },
        methods: {
            downloadSelection() {
                this.multipleSelection.forEach(item => {
                    const a = document.createElement('a')
                    a.setAttribute('href', item.href)
                    a.setAttribute('download', item.name)
                    const e = document.createEvent('MouseEvents')
                    e.initEvent('click', false, false)
                    a.dispatchEvent(e)
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val
            }
        }
    }
</script>