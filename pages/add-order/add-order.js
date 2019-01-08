// add-order.js
import { AddOrderModel } from 'add-order-model.js';
import { OrderDto, ProductDto } from 'order-dto.js';
import { Constants } from '../../utils/constants.js';
let addOrderModel = new AddOrderModel();
let index = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeShowed: false,
    orgShowed: false, //所属部门
    addressShowed: false, //收货地址 
    detailAddressShowed: false,
    addBtnShowed: false, //添加按钮
    showedRadioGroup: false,
    optionsList: [],
    orgDisabled: false,
    addressDisabled: false,
    secondShowed: false,
    productList:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("执行了:" + index++);
    wx.removeStorageSync("STATUS");
    wx.removeStorageSync(Constants.ADD_ORDER_CUSTOMER);
  },
  onShow: function () {
    let customerObj = wx.getStorageSync(Constants.ADD_ORDER_CUSTOMER);
    console.log(customerObj);
    if (typeof customerObj == 'object') {
      addOrderModel.getCustomerInfoFromServer(customerObj.code, this);
    }
    let status = wx.getStorageSync("STATUS");
    if (status == "ok") {
      addOrderModel.addToProductList(this);
     
    }
  },

  // 获取单个产品数目
  getNum: function (e) {
    let index = addOrderModel.getDataSet(e, 'index'),
      num = e.detail.value;
    console.log(num);
  },
  //获取单个产品金额
  getPrice: function (e) {
    let index = addOrderModel.getDataSet(e, 'index'),
      price = e.detail.value;
  },
  addOrder: function (e) {
    let index = 0;
    let productList = [];
    let product = {};
    console.log(e.detail.value);
    //获取修改后的 产品的价格与数量
    for (let item in e.detail.value) {
      if (item.includes('num')) {
        index = item.split('_')[1];
        console.log(index);
        this.data.productList[index].FItemCode.FNum = e.detail.value[item];
      }
      if (item.includes('price')) {
        index = item.split('_')[1];
        this.data.productList[index].FPrice = e.detail.value[item];
      }
    }
    //获取添加的产品
    for (let item of this.data.productList) {
      product.price = item.FPrice;
      product.productCode = item.FItemCode.FCode;
      product.num = item.FItemCode.FNum;
      let prductObj = new ProductDto(product);
      productList.push(prductObj);
    }
    //产品值添加到提交数据中
    this.data.order.products = productList;
    addOrderModel.insertDataToServer(this.data.order);
  },
  /**
   * 获取用户所点击的项
   */
  getSelectdItem: function (e) {
    console.log(e.currentTarget.dataset);
    addOrderModel.showSelectdItemToView(e, this);
  },
  //显示下拉列表
  showRadioGroup: function (e) {
    addOrderModel.getOptionsList(e, this);
  },
  /**页面跳转部分 */
  toSearch: function (e) {
    wx.navigateTo({
      url: '../search/search?pageIndex=2',
    });
  },

  //隐藏弹框
  hideDialog: function (e) {
    this.setData({
      dialogOptions: {
        showDialogStatus: false
      }
    });
  },
  bindRegionChange: function (e) {
    let address = e.detail.value.join('');
    this.data.order.address = address;
    addOrderModel.resetData(this);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    addOrderModel.firstLoad(this);
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