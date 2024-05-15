<template>
	<view>
		<div class="container">
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
		</div>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onReachBottom,onPullDownRefresh } from '@dcloudio/uni-app'
const imgList = ref([])
const onPreview = (index) => {
	const urlList = imgList.value.map(item => item.url)
	// 图片预览 API , current: 索引值 , urls: 图片列表
	uni.previewImage({
		current:index,
		urls:urlList,
		indicator:'default'
	})
}
function network(){
	uni.showLoading()
	const p = new Promise(function(resolve,reject){
		uni.request({
			url:"https://tea.qingnian8.com/tools/petShow",
			data:{
				size:5,
				type:'all'
			},
			// header:{
			// 	'access-key' : '3510386163'
			// }
		}).then(res => {
			if(res.data.errCode == 0){
				imgList.value = [...imgList.value,...res.data.data] 
				console.log(imgList.value)
			}else if(res.data.errCode == 400){
				uni.showToast({
					title:res.data.errMsg,
					icon:'none',
					duration:2000
				})
			}
			console.log(imgList.value)
		}).catch((err) => {
			uni.showToast({
				title:'请求错误',
				icon:'none',
				duration:2000
			})
		}).finally(() => {
			uni.hideLoading()
			uni.stopPullDownRefresh()
		})
	})
}
// 触底加载更多
onReachBottom(() =>{
	network()
})

// 下拉刷新
onPullDownRefresh(() => {
	imgList.value=[]
	network()
})
network()
</script>

<style lang="scss" scoped>
	.container{
		.layout{
			padding: 50rpx;
			.box{
				margin-bottom: 60rpx;
				box-shadow: 0 20rpx 30rpx rgba(0,0,0,.08);
				border-radius: 30rpx;
				overflow: hidden;
				.prc{
					img{
						width: 100%;
					}
					
				}
				.text{
					padding: 30rpx;
					color: #333;
					font-size: 36rpx;
				}
				.author{
					padding: 0 30rpx 30rpx;
					text-align: right;
					color: #666;
					font-size: 28rpx;
				}
			}
		}
	}
</style>
