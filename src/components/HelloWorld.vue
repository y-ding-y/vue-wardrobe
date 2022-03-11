<template>
	<div>
		<el-drawer size="400px" :modal="false" :title="titlename" :visible.sync="drawer" :direction="direction"
			:show-close="false">
			<div style="margin-top: 10px;">
				<div style="width: 90%;margin: 0 auto;">
					<v-screen v-show="activemenu=='screen'" @screencss="setScreencss" :csstype="'mainbg'"></v-screen>
					<v-divide v-show="activemenu=='divide'" @dividecss="setDividecss" :csstype="'mainbg'"></v-divide>
					<!-- <v-css v-show="activemenu=='cloth'" @maincss="setCss" :csstype="'cloth'" :key="'cloth'"></v-css>
					<v-css v-show="activemenu=='hair'" @maincss="setCss" :csstype="'hair'" :key="'hair'"></v-css>
					 -->
					<v-text v-show="activemenu=='text'" @text="setText"></v-text>

					<div v-for="item in menus">
						<v-css v-show="activemenu==item.key" @maincss="setCss" :csstype="item.key" :key="item.key"
							:paras="item.paras">
						</v-css>
					</div>
				</div>
			</div>
		</el-drawer>

		<el-container>
			<el-aside width="200px">
				<div class="btn_group" style="margin-top: 10px;">
					<div>
						<el-button @click="handleOk" type="success"> 下载</el-button>
					</div>
					<div>
						<el-button @click="handle_cut( )" type="success">
							批量裁剪
						</el-button>
					</div>
					<br>
					<div>
						<el-button @click="handle_draw('screen')" type="warning">
							画布设置
						</el-button>
					</div>
					<div>
						<el-button @click="handle_draw('divide')" type="warning">
							栏位内容样式
						</el-button>
					</div>
					<div>
						<el-button @click="handle_draw('text')" type="warning">
							文字内容
						</el-button>
					</div>

					<br>
					<div v-for="menu in menus" :key="menu.key">
						<el-button @click="handle_draw(menu.key)" type="primary"> {{menu.name}}样式设置</el-button>
					</div>
				</div>

			</el-aside>


			<div class="char" id="char" ref="screen" :style="screen">
				<div class="top" :style="top">
					<!-- <div class="header_css">
							<div style="height: 100px;width: 100px;margin-top: 10px;">
								<el-avatar shape="square" :size="80" fit="'fill'" :src="require('d:\\wardrobe/sa.jpeg')">
								</el-avatar>
							</div>
							<div style="border: 5px solid rgba(248, 248, 248, 0.712); height: 50px;width:50%;margin-top: 20px;background-color: rgba(43, 174, 226, 0.301);   border-radius: 5px;
								box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);">
								<div class="header_name">
									{{header_name}}
								</div>
								<div class="header_info">
									{{header_info}}
								</div>
							</div>
						</div> -->

					<div v-for="(menu,i) in menus" :key="i">
						<div class="divide" :style="dividestyle">
							<div class="divide_span" :style="dividespanstyle">{{menu.name}}</div>
						</div>
						<div class="cloth">
							<div class="cloth_1" v-for="(item,index) in menu.arr" :key="index" :style="menu.style"
								v-dragging="{  item: item, list: [],group:  i}"
								@mousedown="down(index,menu.arr,i,$event)" :id="i+'-'+index">
								<!-- <span>{{item.name}}</span> -->
								<img :src="item.url" :style="menu.style_img">
							</div>
						</div>
					</div>
					<!-- 
						<div class="divide">
							<div class="divide_span">衣服</div>
						</div>
						<div class="cloth">
							<div class="cloth_1" v-for="(item,index) in cloth_arr" :key="index" :style="cloth_style">
							 <img :src="require('d:\\wardrobe/cloth/'+item)" :style="cloth_style_img">
								<img :src="item" :style="cloth_style_img">
							</div>
						</div>  -->
					<div style="height: 20px;width: 100%;">
					</div>
					<div :style="bottomcss" class="bottom_css" v-if="bottom_info_str!=''">
						<div style="padding: 2px; width: 80%;  display: flex;justify-content: left;flex-wrap: wrap;">
							<div class="bottom_info" :style="bottominfocss" v-for="(item,index) in bottom_info"
								:key="index">
								{{item.info}}
							</div>
						</div>
					</div>
				</div>
			</div>
		</el-container>
	</div>
</template>

<script>
	import html2canvas from 'html2canvas'
	import './index.css'

	import VScreen from './screencss/index.vue';
	import VText from './textcss/index.vue';
	import VCss from './clothcss/index.vue';
	import VDivide from './divide/index.vue';

	export default {
		data() {
			return {
				titlename: "",
				menus: [{ key: "cloth", name: "衣服", arr: [], style: {}, style_img: {}, paras: [] },
				{ key: "face", name: "脸型", arr: [], style: {}, style_img: {}, paras: [] },
				{ key: "hair", name: "发型", arr: [], style: {}, style_img: {}, paras: [] }],
				activemenu: "",

				typecss: "",

				drawer: false,
				direction: 'rtl',

				header_name: "",
				header_info: "",
				bottom_info_str: "",

				screen: {
					//	overflowY: 'scroll',
					width: '900px',
					height: '100%',
					margin: '0 auto',
					// paddingTop: '20px',
					// paddingBottom: '20px',
					padding: '20px 10px 20px  10px',
					//	 background: 'url(/static/sa.jpeg) no-repeat',
					background: 'rgba(255, 69, 0, 0.18)',
					backgroundSize: 'cover',
				},
				top: {

				},
				cloth_style: {},
				cloth_style_img: {},

				hair_style: {},
				hair_style_img: {},

				img_src: "",

				dividestyle: {},
				dividespanstyle: {},
				bottominfocss: {},
				bottomcss: {},
				coutns: 0,

				dragg: [],
				dradd_first: [],
				templist: [],
				gragstart: "",
				chosedindex: -1,

				sorttype: 2,

				group: "",

				chosedstyle: { border: '0px solid red' }
			};
		},
		components: {
			VScreen, VText, VCss, VHaircss: VCss, VDivide
		},
		watch: {
			bottom_info_str() {
				//this.$refs.screen.style.background = "url('/static/sa.jpeg') 100% 100% no-repeat"
			},
		},
		computed: {
			bottom_info() {
				var temp = [];
				this.bottom_info_str.split(',').map((e, i) => {
					temp.push({ key: i, info: e, })
				})
				return temp;
			},
		},
		created() {
			this.menus.map(e => {
				e.arr = [];
				e.paras = [];
				let filedata = Array(this.$localForage.getItem(e.key))
				Promise.all(filedata).then(value => {
					if (value[0] != null) {
						e.paras = value[0]
						value[0].map(o => {
							var blos = o.val;
							const imgURL = URL.createObjectURL(blos)
							e.arr.push({
								url: imgURL,
								name: o.name,
								val: o.val
							})
						})
					}

				})
			})
		},
		mounted() {
			// document.getElementById("char").oncontextmenu = function (e) {
			// 	if (e.button == 2) {
			// 		alert("你点了右键");
			// 	} else if (e.button == 0) {
			// 		alert("你点了左键");
			// 	} else if (e.button == 13) {
			// 		alert("你点了滚轮");
			// 	}

			// 	return false;
			// }



			var index = -1
			var s1 = {};
			var s2 = {};
			var temp_drag = [];
			var temp = [];
			this.$dragging.$on('dragged', (val) => {
				this.group = val.group
				s1 = val.draged;
				s2 = val.to;
				this.chosedindex = -1;
				if (this.sorttype == 1) {
					this.chosedindex = this.menus[val.group].arr.findIndex(function (item) {
						return item.name === val.to.name;
					});

				}

				if (this.sorttype == 2) {
					temp = this.menus[val.group].arr;

					var dragedid = temp.findIndex(function (item) {
						return item.name === val.draged.name;
					});
					this.chosedindex = temp.findIndex(function (item) {
						return item.name === val.to.name;
					});

					this.menus[val.group].arr.splice(dragedid, 1);
					temp_drag = this.menus[val.group].arr

					temp_drag.splice(this.chosedindex, 0, s1)
					this.menus[val.group].arr = temp_drag;

					//	this.menus[val.group].arr = this.dragg.splice(this.chosedindex, 0, s1)
				}
			})
			this.$dragging.$on('dragend', (val) => {
				if (this.sorttype == 1) {
					var temp = this.menus[val.group].arr
					if (this.chosedindex != -1) {
						this.menus[val.group].arr.splice(this.chosedindex, 1, s1);
						this.menus[val.group].arr.splice(this.gragstart, 1, s2);

						var tempparas = this.menus[val.group].paras[this.chosedindex]
						this.menus[val.group].paras.splice(this.chosedindex, 1, this.menus[val.group].paras[this.gragstart]);
						this.menus[val.group].paras.splice(this.gragstart, 1, tempparas);
						this.$localForage.setItem(this.menus[val.group].key, this.menus[val.group].arr)
					}
				}

				if (this.sorttype == 2) {
					this.$localForage.setItem(this.menus[val.group].key, this.menus[val.group].arr)
				}
				//	this.menus[val.group].arr = temp
				// this.dragg = temp
				// console.log(temp)
			})
		},
		methods: {
			down(i, e, key, event) {
				this.gragstart = i;
				this.chosedindex = -1;
				this.dragg = [];
				if (this.sorttype == 2) {
					//F	this.menus[key].arr.splice(i, 1)
					this.dradd_first = [...e]
					var ee = [...e]
					ee.splice(i, 1)
					this.dragg = ee
				}


			},

			handle_draw(e) {
				this.coutns++;
				this.menus.some(m => {
					if (m.key == e) {
						this.titlename = m.name + "样式设置";
						return true;
					}
					else {
						switch (e) {
							case "screen":
								this.titlename = "画布设置"
								break;
							case "text":
								this.titlename = "文字内容样式设置"
								break;
							case "divide":
								this.titlename = "栏位样式设置"
								break;
							default:
								this.titlename = "画布设置"
								break;
						}
					}
				})
				this.activemenu = e
				this.drawer = true;
			},
			setScreencss(e) {
				this.menus = e.menus
				this.screen = {
					width: e.size[0] + "px",
					height: '100%',
					margin: '0 auto',
					// paddingTop: e.size[1] + "px",
					// paddingRight: e.size[2] + "px",
					// paddingBottom: e.size[3] + "px",
					// paddingLeft: e.size[4] + "px",
					background: e.bg == '1' ? e.bgcolor : 'url(' + e.imageUrl + ')' + e.isrepeat,
					backgroundSize: e.size[0] + "px",
				}
				this.top = {
					backgroundColor: e.topcolor,
					width: (e.size[0] - e.size[2] - e.size[4]) + "px",
					margin: e.size[1] + "px" + " " + e.size[2] + "px",
					borderRadius: e.size[5] + "px"
					//	boxShadow:'10px 10px 5px #d84141'
				}
			},
			setDividecss(e) {
				this.dividestyle = {
					display: e.shows,
					backgroundColor: e.bgcolor,
					width: e.size[0] + "%",
					height: '100%',
					margin: '0 auto',
					paddingTop: e.size[1] + "px",
					paddingRight: e.size[2] + "px",
					paddingBottom: e.size[3] + "px",
					paddingLeft: e.size[4] + "px",
				}
				this.dividespanstyle = {
					backgroundColor: e.spancolor,
					width: e.size[5] + "px",
					height: e.size[6] + "px",
					lineHeight: e.size[6] + "px",
					fontSize: e.size[7] + "px",
					color: e.fontcolor,
					border: e.size[8] + 'px' + ' ' + e.value + ' ' + e.bordercolor,
				}

			},
			setText(e) {
				this.header_name = e.header_name
				this.header_info = e.header_info
				this.bottom_info_str = e.bottom_info_str
				this.bottomcss = {
					borderRadius: '5px',
					backgroundColor: e.bottomcolor,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: ' space - around',
					width: e.size[0] + "%",
					height: '100%',
					margin: '0 auto',
				}
				this.bottominfocss = {
					backgroundColor: e.spancolor,
					width: e.size[9] + "px",
					height: e.size[6] + "px",
					lineHeight: e.size[6] + "px",
					fontSize: (e.size[7] - 4) + "px",
					color: e.fontcolor,
					border: e.size[8] + 'px' + ' ' + e.value + ' ' + e.bordercolor,
					//border:'1px solider white'
				};
			},

			setCss(e) {
				var temp = [...this.menus]
				this.menus.some(m => {
					if (m.key == this.activemenu) {
						if (this.coutns > 1) {
							if (this.sorttype == e.choseindex) {
								m.arr = [];
								m.paras = e.imgs
								m.arr = e.imgs.map(o => {
									return {
										url: URL.createObjectURL(o.val),
										name: o.name,
										val: o.val
									}
								})
							}
							else {
								//
							}
						}
						this.sorttype = e.choseindex
						m.style = {
							backgroundColor: e.bgcolor,
							width: e.size[0] + "px",
							height: e.size[1] + "px",
							margin: e.size[2] + "px",
							borderRadius: e.size[3] + "%",

						};
						m.style_img = {
							backgroundColor: e.bgcolor,
							width: e.size[0] + "px",
							height: e.size[1] + "px",
							borderRadius: e.size[3] + "%",
						};
						return true;
					}
				})

			},
			handle_cut() {
				this.$router.push("../files")
			},
			handleOk() {
				html2canvas(this.$refs.screen, {
					useCORS: true,
				}).then((canvas) => {
					if (navigator.msSaveBlob) {
						// IE10+
						let blob = canvas.msToBlob()
						return navigator.msSaveBlob(blob, name)
					} else {
						let imageurl = canvas.toDataURL('image/png')
						//这里需要自己选择命名规则
						let imagename = ''
						this.fileDownload(imageurl, imagename)
					}
				})
			},
			//下载截屏图片
			fileDownload(downloadUrl, downloadName) {
				let aLink = document.createElement('a')
				aLink.style.display = 'none'
				aLink.href = downloadUrl
				aLink.download = `${downloadName}.jpg`
				// 触发点击-然后移除
				document.body.appendChild(aLink)
				aLink.click()
				document.body.removeChild(aLink)
			},

		}
	}
</script>

<style>
	.el-header,
	.el-footer {
		background-color: #B3C0D1;
		color: #333;
		text-align: center;
		line-height: 60px;
	}

	.el-aside {
		background-color: #D3DCE6;
		color: #333;
		overflow-y: scroll;
		margin-right: 20px;
	}

	.el-main {
		background-color: #E9EEF3;
		color: #333;
		overflow-y: scroll;
		margin-right: 20px;
	}

	body>.el-container {
		margin-bottom: 40px;
	}

	.el-container:nth-child(5) .el-aside,
	.el-container:nth-child(6) .el-aside {
		line-height: 260px;
	}

	.el-container:nth-child(7) .el-aside {
		line-height: 320px;
	}


	*::-webkit-scrollbar {
		width: 7px;
		height: 10px;
		background-color: transparent;
	}

	/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
	*::-webkit-scrollbar-track {
		background-color: #57c4b288;
	}

	/*定义滚动条轨道 内阴影+圆角*/
	*::-webkit-scrollbar-thumb {
		background-color: #33bbc06c;
		border-radius: 6px;
	}

	/*定义滑块 内阴影+圆角*/
	.scrollbarHide::-webkit-scrollbar {
		display: none
	}

	.scrollbarShow::-webkit-scrollbar {
		display: block
	}


	.btn_group {
		display: flex;
		flex-direction: column;
	}

	.btn_group button {
		width: 90%;
		margin: 0 auto;
		margin-top: 10px;
	}

	.label {
		position: relative;
		top: 0px
	}
</style>