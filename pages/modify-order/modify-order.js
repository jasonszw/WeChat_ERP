// pages/modify-order/modify-order.js
import { ModifyOrderModel } from 'modify-order-model.js';

let modifyOrderModel = new ModifyOrderModel();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    modifyInputValue: {},
    key_id: "",
    detailAddressShow: false,
    isAddress: true,
    productList: [],
    orgDisabled: false,
    addressDisabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.removeStorageSync("STATUS");
    modifyOrderModel.getModifyInfo(options,this);
    console.log(this.data.key_id)
  },
  // 获取数目
  getNum: function (e) {
    let index = modifyOrderModel.getDataSet(e, 'index'),
    num = e.detail.value;
    console.log(num);
  },
  //获取金额
  getPrice: function (e) {
    let index = modifyOrderModel.getDataSet(e, 'index'),
    price = e.detail.value;
  },
  // 修改订单
  modifyOrder: function (e) {
    let key_id = this.data.key_id;
    console.log(key_id);
    let data = e.detail.value;
    console.log(this.data.modifyInputValue)
    data.address = this.data.modifyInputValue.order.FAddress;
    modifyOrderModel.modifyCompleted(key_id, data, this);
  },
  showRadioGroup: function (e) {
    console.log(11)
    modifyOrderModel.getOptionsList(e, this);
  },
  getSelectdItem: function (e) {
    console.log(e.currentTarget.dataset);
    modifyOrderModel.showSelectdItemToView(e, this);
  },
  bindRegionChange: function (e) {
    let FAddress = e.detail.value.join('');
    this.data.modifyInputValue.order.FAddress = FAddress;
    this.setData({
      modifyInputValue: this.data.modifyInputValue,
      detailAddressShow: true
    })
  },
  bindAddProductTap: function (e) {
    let productList = JSON.stringify(this.data.productList);
    let code = this.data.modifyInputValue.order.FCode;
    wx.navigateTo({
      url: `../add-product/add-product?code=${code}&pageIndex=2&productList=${productList}`,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let status = wx.getStorageSync("STATUS");
    if (status == "ok") {
      modifyOrderModel.addToProductList(this);
    }
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