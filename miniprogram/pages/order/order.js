// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    n:'\n',
    orderList: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let openid = wx.getStorageSync('openid');
    wx.cloud.callFunction({
      name: 'http',
      data: {
        url: '/users/getOrder',
        openid: openid,
      },
      success: res => {
        let obj = JSON.parse(res.result);
        console.log(obj.data);
        this.setData({
          orderList: obj.data
        })
        // 初始化购物车函数
      },
      fail: res => {
        wx.showToast({
          title: '获取失败，请检查网络',
          icon: 'none',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})