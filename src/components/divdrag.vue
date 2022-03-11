<template>
    <div>
        <div v-for="(item, index) in img_details" v-dragging="{  item: item, list: img_details,group: 'test' }"
            :key="index">
            <!-- <img :src=" + item + '" alt="">
             -->
            <span>{{item}}</span>
        </div>
    </div>

</template>

<script>
    export default {
        data() {
            return {

                img_details: [{
                    text: "Aquamarine"
                }, {
                    text: "Hotpink"
                }, {
                    text: "Gold"
                }, {
                    text: "Crimson"
                }, {
                    text: "Blueviolet"
                }, {
                    text: "Lightblue"
                }, {
                    text: "Cornflowerblue"
                }, {
                    text: "Skyblue"
                }, {
                    text: "Burlywood"
                }],
                image: []

            }
        },
        mounted() {
            this.$dragging.$on('dragged', (val) => {
                console.log(val)
            })
            this.$dragging.$on('dragend', (res) => {
                console.log(res)
            })
        }
    }
</script>