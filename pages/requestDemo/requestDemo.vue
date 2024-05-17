<template>
	<view>
		<div class="container">
			<view class="menu">
				<uni-segmented-control :current="current" :values="value"
				 @clickItem="onClickItem" styleType="button" activeColor="#4cd964"></uni-segmented-control>
			</view>
			<div class="layout">
				<div class="box" v-for="(item,index) in imgList" :key="item._id">
					<div class="prc" @click="onPreview(index)">
						<!-- lazy-load: 图片懒加载 -->
						<image lazy-load :src="item.url" alt="" />
					</div>
					<div class="text">{{item.content}}</div>
					<div class="author">—— {{item.author}}</div>
				</div>
			</div>
			<view class="float">
				<view class="item" @click="onRefresh">
					<uni-icons type="refresh" size="26" color="#888"></uni-icons>
				</view>
				<view class="item" @click="onTop">
					<uni-icons type="arrow-up" size="26" color="#888"></uni-icons>
				</view>
			</view>
			<div class="loadMore">
				<uni-load-more status="loading"></uni-load-more>
			</div>

		</div>
	</view>
</template>

<script setup>
	import { ref,computed } from 'vue'
	import { onReachBottom,onPullDownRefresh } from '@dcloudio/uni-app'
	const imgList = ref([])
	const onPreview = (index) => {
		const urlList = imgList.value.map(item => item.url)
		// 图片预览 API , current: 索引值 , urls: 图片列表
		uni.previewImage({
			current: index,
			urls: urlList,
			indicator: 'default'
		})
	}
	const current = ref(0)
	const classify = ref([
		{key:"all",value:"全部"},
		{key:"dog",value:"狗狗"},
		{key:"cat",value:"猫猫"}
	])
	const value = computed(() => classify.value.map(item => item.value))
	const onClickItem = (e) => {
		current.value = e.currentIndex
		imgList.value = []
		console.log(e.currentIndex)
		network(classify.value[e.currentIndex].key)
		
	}
	function network(style="all") {
		uni.showLoading()
		const p = new Promise(function(resolve, reject) {
			uni.request({
				url: "https://tea.qingnian8.com/tools/petShow",
				data: {
					size: 5,
					type: style
				},
				// header:{
				// 	'access-key' : '3510386163'
				// }
			}).then(res => {
				if (res.data.errCode == 0) {
					imgList.value = [...imgList.value, ...res.data.data]
					console.log(imgList.value)
				} else if (res.data.errCode == 400) {
					uni.showToast({
						title: res.data.errMsg,
						icon: 'none',
						duration: 2000
					})
				}
				console.log(imgList.value)
			}).catch((err) => {
				uni.showToast({
					title: '请求错误',
					icon: 'none',
					duration: 2000
				})
			}).finally(() => {
				// 无论成功还是失败都执行
				uni.hideLoading()
				uni.stopPullDownRefresh()
			})
		})
	}
	// 触底加载更多
	onReachBottom(() => {
		network()
	})

	// 下拉刷新
	onPullDownRefresh(() => {
		imgList.value = []
		network()
	})

	// 点击刷新
	const onRefresh = () => {
		uni.startPullDownRefresh()
	}
	const onTop = () => {
		uni.pageScrollTo({
			scrollTop: 0,
			duration: 100
		})
	}

	network()
</script>

<style lang="scss" scoped>
	.container {
		.menu{
			padding: 50rpx 50rpx 0;
		}
		.layout {
			padding: 50rpx;

			.box {
				margin-bottom: 60rpx;
				box-shadow: 0 20rpx 30rpx rgba(0, 0, 0, .08);
				border-radius: 30rpx;
				overflow: hidden;

				.prc {
					img {
						width: 100%;
					}

				}

				.text {
					padding: 30rpx;
					color: #333;
					font-size: 36rpx;
				}

				.author {
					padding: 0 30rpx 30rpx;
					text-align: right;
					color: #666;
					font-size: 28rpx;
				}
			}
		}

		.loadMore {
			padding-bottom: calc(env(safe-area-inset-bottom) + 50rpx);
		}

		.float {
			position: fixed;
			right: 30rpx;
			// 底部安全区域css环境变量
			bottom: env(safe-area-inset-bottom);

			.item {
				width: 90rpx;
				height: 90rpx;
				background: rgba(255, 255, 255, .9);
				border-radius: 50%;
				margin-bottom: 20rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				border: 1px solid #eee;
			}

		}
	}
</style>