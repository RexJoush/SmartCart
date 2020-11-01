//index.js
const app = getApp()

Page({
  data: {
    notice:"欢迎光临我的智慧超市，请先登录后再继续使用，谢谢配合",
    n: '\n',
    show: false,
  },

  onLoad: function() {
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },

  // 展示我的二维码
  showQRcode: function () {
    let that = this;
    wx.getSetting({
      withSubscriptions: true,
      success: res => {
        // console.log(res.authSetting['scope.userInfo']);
        if(res.authSetting['scope.userInfo']) {
          that.showPopup();
        } else {
          setTimeout(this.loginFirst,100);
        }
      }
    })
  },


  // 请先登录
  loginFirst: function(){
    wx.showToast({
      duration: 1500,
      icon: 'none',
      title: '请先登录'
    });
  },

})
