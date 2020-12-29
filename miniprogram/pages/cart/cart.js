// pages/cart/cart.js

import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    commodityList: {}, // 页面商品列表
    totalPrice: 0, // 总价格
    map: new Map() // 实际商品列表
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户的 openid，用于获取购物车数据
    let openid = wx.getStorageSync('openid');

    console.log(openid);
    wx.cloud.callFunction({
      name: 'http',
      data: {
        url: '/cart/getCart',
        openid: openid,
      },
      success: res => {
        let obj = JSON.parse(res.result);
        // console.log(obj.data);

        // 初始化购物车函数
        this.initMap(obj.data);
      },
      fail: res => {
        wx.showToast({
          title: '获取失败，请检查网络',
          icon: 'none',
        })
      }
    })
  },

  // 增加商品
  add: function(e){
    console.log("add");
    console.log(e.currentTarget.id);
    this.change(e.currentTarget.id, 1);

  },

  // 减少商品
  minus: function(e){
    console.log("minus");
    console.log(e.currentTarget.id);
    this.change(e.currentTarget.id, -1);
    
    /*
    // 获取 id
    let commodity_id = e.currentTarget.id;

    // 将 map 初始化
    let map  = this.data.map;
    // 定义页面渲染列表
    let commodityList = [];
    // 定义总价格
    let totalPrice = 0;

    console.log(this.data.map);

    // 更新 map 中的商品数量
    map.set(commodity_id, 
      {
        commodity_id: commodity_id,
        number: map.get(commodity_id).number - 1,
        price: map.get(commodity_id).price,
        describe: map.get(commodity_id).describe,
        name: map.get(commodity_id).name,
        thumb: map.get(commodity_id).thumb
    });

    // 获取 map 的值结合
    let values = this.data.map.values();
    // console.log(values);
    
    // 封装值集合，此处因为获取的值是 entry 集合，所以使用 for 遍历
    for(let value of values){
      commodityList.push(value);
      totalPrice += value.number * value.price;
    }

    console.log(totalPrice);

    console.log(this.data.map);
    // 更新 map 和页面
    this.setData({
      map: map,
      commodityList: commodityList,
      totalPrice: totalPrice * 100,
    })
    */
  },

  // 删除商品
  del: function(e){
    console.log("del");
    console.log(e.currentTarget.id);
    // this.change(e.currentTarget.id, 0);
    Dialog.confirm({
      // title: '删除',
      message: '删除此商品？',
    })
      .then(() => {
        this.change(e.currentTarget.id, 0);
      })
      .catch(() => {
        // on cancel，取消
        console.log("no");
      });

  },

  // 结账
  onSubmit: function () {
    console.log(this.data.map);
    let map = this.data.commodityList;
    let totalPrice = this.data.totalPrice;
    wx.cloud.callFunction({
      name: 'http',
      data: {
        url: '/cart/commit',
        list: map,
        totalPrice: totalPrice,
      },
      success: res => {
        let obj = JSON.parse(res.result);
        // 结账成功
        if (obj.result == 1){
          this.onLoad();
        }
        // 结账失败
        else {
          
        }
      },
      fail: res => {
        wx.showToast({
          title: '结账失败，请检查网络',
          icon: 'none',
        })
      }
    })
  },


  /*
    更新商品，加 1 或者减 1
      mode 参数
        1 表示 加 1
        0 表示 删除
        -1 表示 减 1
  */
   change: function(id, mode){
    // 获取 id
    let commodity_id = id;

    // 将 map 初始化
    let map  = this.data.map;
    // 定义页面渲染列表
    let commodityList = [];
    // 定义总价格
    let totalPrice = 0;

    console.log(this.data.map);

    // 更新 map 中的商品数量
    switch (mode){
      case 1 : 
        map.set(commodity_id, 
          {
            commodity_id: commodity_id,
            number: map.get(commodity_id).number + 1,
            price: map.get(commodity_id).price,
            describe: map.get(commodity_id).describe,
            name: map.get(commodity_id).name,
            thumb: map.get(commodity_id).thumb
        });
        break;
      case -1 :
        map.set(commodity_id, 
          {
            commodity_id: commodity_id,
            number: map.get(commodity_id).number - 1,
            price: map.get(commodity_id).price,
            describe: map.get(commodity_id).describe,
            name: map.get(commodity_id).name,
            thumb: map.get(commodity_id).thumb
        });
        break;
      case 0 :
        map.delete(commodity_id);
        break;
    }

    // 获取 map 的值结合
    let values = this.data.map.values();
    // console.log(values);
    
    // 封装值集合，此处因为获取的值是 entry 集合，所以使用 for 遍历
    for(let value of values){
      commodityList.push(value);
      totalPrice += value.number * value.price;
    }

    console.log(totalPrice);

    console.log(this.data.map);
    // 更新 map 和页面
    this.setData({
      map: map,
      commodityList: commodityList,
      totalPrice: totalPrice * 100,
    })
  },

  // 更新价格
  updatePrice: function(){
    let totalPrice = 0;
    this.map.forEach(
      (key, value, map) => {
        totalPrice += value.price * value.number;
      }
    )
  },
 
  
  // 将获取的商品列表数据进行格式化为一个 map 集合
  initMap: function (list){
    console.log(list);
    let totalPrice = 0;
    
    // 定义集合
    let map = new Map();
    
    // 封装集合数据
    for(let i = 0; i < list.length;i++){
      totalPrice += list[i].price * list[i].number;
      map.set(
        list[i].commodity_id, 
        {
          commodity_id: list[i].commodity_id,
          number: list[i].number, 
          price: list[i].price,
          describe: list[i].describe,
          name: list[i].name,
          thumb: list[i].thumb
        });
    }
    console.log(map);
    this.setData({
      commodityList: list,
      totalPrice: totalPrice * 100,
      map: map,
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