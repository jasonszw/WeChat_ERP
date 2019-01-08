//order-detail.js
import { OrderDetailModel } from "order-detail-model.js";
let orderDeatailModel = new OrderDetailModel();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    FStatus: "",
    detailInfo: {},
    linkMan: true,
    address:true,
    phone: true,
    orgName: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      FStatus: options.FOutFlag
    })
    let key_id = options.KeyId;
    orderDeatailModel.getOrderDetailRequest(key_id, this);
    console.log(this.data.detailInfo);
  },
  // 修改按钮
  bindModifyTap: function (e) {;
    let orderInfo = JSON.stringify(this.data.detailInfo);
    console.log(orderInfo)
    wx.redirectTo({
      url: `../modify-order/modify-order?orderInfo=${orderInfo}`
    })
  },
  //作废按钮
  bindCancelTap: function (e) {
    let key_id = this.data.detailInfo.order.KeyId;
    console.log(key_id)
    orderDeatailModel.toVoidOrder(key_id)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {

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