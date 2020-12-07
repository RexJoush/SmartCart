//index.js
const app = getApp()

Page({
  data: {
    notice:"欢迎光临我的智慧超市，请先登录后再继续使用，谢谢配合",
    n: '\n',
    show: false,
    qrcode: '',
  },

  onLoad: function() {
    this.onGetOpenid();
    // wx.setStorage({
    //   key:"openid",
    //   data: openid,
    // });
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        // app.globalData.openid = res.result.openid
        wx.setStorage({
          key:"openid",
          data: res.result.openid,
        });
        
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
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
    console.log(wx.getStorageSync('openid'));
    wx.getSetting({
      withSubscriptions: true,
      success: res => {
        // console.log(res.authSetting['scope.userInfo']);
        if(res.authSetting['scope.userInfo']) {
          wx.cloud.callFunction({
            name: 'http',
            data: {
              url: '/getQrcode',
            },
            success: res => {
              let obj = JSON.parse(res.result);
              // console.log(obj.data[0].qrcode);
              this.setData({
                qrcode: obj.data[0].qrcode
              })
              that.showPopup();
            },
            fail: res => {
              wx.showToast({
                title: '获取失败，请检查网络',
                icon: 'none'
              })
            }
          })
          
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
