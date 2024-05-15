"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "requestDemo",
  setup(__props) {
    const imgList = common_vendor.ref([]);
    const onPreview = (index) => {
      const urlList = imgList.value.map((item) => item.url);
      common_vendor.index.previewImage({
        current: index,
        urls: urlList,
        indicator: "default"
      });
    };
    function network() {
      common_vendor.index.showLoading();
      new Promise(function(resolve, reject) {
        common_vendor.index.request({
          url: "https://tea.qingnian8.com/tools/petShow",
          data: {
            size: 5,
            type: "all"
          }
          // header:{
          // 	'access-key' : '3510386163'
          // }
        }).then((res) => {
          if (res.data.errCode == 0) {
            imgList.value = [...imgList.value, ...res.data.data];
            console.log(imgList.value);
          } else if (res.data.errCode == 400) {
            common_vendor.index.showToast({
              title: res.data.errMsg,
              icon: "none",
              duration: 2e3
            });
          }
          console.log(imgList.value);
        }).catch((err) => {
          common_vendor.index.showToast({
            title: "请求错误",
            icon: "none",
            duration: 2e3
          });
        }).finally(() => {
          common_vendor.index.hideLoading();
          common_vendor.index.stopPullDownRefresh();
        });
      });
    }
    common_vendor.onReachBottom(() => {
      network();
    });
    common_vendor.onPullDownRefresh(() => {
      imgList.value = [];
      network();
    });
    network();
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(imgList.value, (item, index, i0) => {
          return {
            a: item.url,
            b: common_vendor.o(($event) => onPreview(index), item._id),
            c: common_vendor.t(item.content),
            d: common_vendor.t(item.author),
            e: item._id
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e25b1ed9"], ["__file", "C:/Users/35103/Desktop/学习项目/项目/咸虾米壁纸相关/萌宠demo/pages/requestDemo/requestDemo.vue"]]);
wx.createPage(MiniProgramPage);
