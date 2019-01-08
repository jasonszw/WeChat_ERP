// order-list.js
import { OrderListModel } from 'order-list-model.js';
import { Constants } from '../../utils/constants.js';
let orderListModel = new OrderListModel();
let statusList = ['待发货', '已发货', '全部'],
  offsetHight = (statusList.length * 2 + 1) * 14;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    pageIndex: 1, //初始页面
    showedList: true,
    status: true, //初始下拉列表图标 
    statusList: statusList,
    holderParams: {
      status: "",
      customer: "",
      page: 1
    }
  },
  // 显示下拉列表
  showDropList: function (e) {
    if (this.data.showedList) {
      this.data.navHeight = offsetHight + 80;
      this.data.status = false;
    } else {
      this.data.navHeight = this.data.navHeight - offsetHight;
      this.data.status = true;
    }
    this.data.showedList = !this.data.showedList;
    this._resetData();
  },

  /**
   * 下拉列表项
   */
  selectItem: function (e) {
    console.log(e.currentTarget.dataset.name);
    console.log(e.currentTarget.dataset.index);
    let self = this;
    this.data.orderList = []; //清空列表
    this.data.pageIndex = 1;  // 初始页面 1
    this.data.showedList = !this.data.showedList; //显示下拉列表
    this.data.navHeight = this.data.navHeight - offsetHight;  //搜素区高度变化
    this.data.status = true;  // 下拉列表小三角图标变换
    this.data.selectStatusItem = e.currentTarget.dataset.name; //所选内容显示
    switch (e.currentTarget.dataset.index) {
      case 0: this.data.holderParams.status = '未出库'; break;
      case 1: this.data.holderParams.status = '已出库'; break;
      case 2: this.data.holderParams.status = ""; break;
      default: break;
    }
    this.data.holderParams.page = this.data.pageIndex;
    orderListModel.getOrderListFromServer(this.data.holderParams, function (res) {
      self.data.orderList = res;
      self.setData({
        orderList: res
      });
    }, this);
    this._resetData();
  },

  //跳转到检索页面
  toSearch: function (e) {
    wx.navigateTo({
      url: '../search/search?pageIndex=1',
    })
  },
  // 添加订单
  toAddOrder: function (e) {
    wx.navigateTo({
      url: '../add-order/add-order',
    })
  },
  onLoad: function () {
    this.clearLocalStorage();
  },
  onShow: function () {
    let self = this;
    let customerObj = wx.getStorageSync(Constants.ORDER_LIST_CUSTOMER);
    if (typeof customerObj == 'object') {
      //用户输入为机构
      if (customerObj.hasOwnProperty('code')) {
        this.data.holderParams.customer = customerObj.customer;
        this.data.userInput = customerObj.customer;
        this.data.hasSearch = true;
      } else if (customerObj.hasOwnProperty('userInput')) {
        this.data.holderParams.customer = customerObj.userInput;
        this.data.userInput = customerObj.userInput;
        this.data.hasSearch = true;
      } else {
        this.data.holderParams.customer = "";
        this.data.hasSearch = false;
      }
    }
    wx.showLoading({
      title: '加载中...',
    })
    orderListModel.getOrderListFromServer(this.data.holderParams, function (res) {
      self.setData({
        orderList: res
      });
    }, this);
    this._resetData();
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    let self = this;
    this.data.holderParams.page++;
    wx.showLoading({
      title: '加载中...',
    })
    orderListModel.getOrderListFromServer(this.data.holderParams, function (res) {
      self.data.orderList.push.apply(self.data.orderList, res);
      self._resetData();
    }, this);

  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    let self = this;
    this.data.orderList = []; //清空列表
    this.data.pageIndex = 1;  // 初始页面 1
    this.data.holderParams.page = this.data.pageIndex;
    wx.showLoading({
      title: '加载中...',
    })
    orderListModel.getOrderListFromServer(this.data.holderParams, function (res) {
      self.data.orderList.push.apply(self.data.orderList, res);
      self._resetData();
    }, this);
  },
 
  //重置数据
  _resetData: function () {
    this.setData({
      orderList: this.data.orderList,
      pageIndex: this.data.pageIndx,

      //下拉列表
      showedList: this.data.showedList,
      navHeight: this.data.navHeight,
      status: this.data.status,

      //搜素部分
      hasSearch: this.data.hasSearch,
      userInput: this.data.userInput,

      selectStatusItem: this.data.selectStatusItem //下拉列表选中项
    })
  },
  clearLocalStorage: function () {
    wx.removeStorageSync(Constants.ADD_ORDER_CUSTOMER);
    wx.removeStorageSync(Constants.FCODE);
    wx.removeStorageSync(Constants.STATUS);
  }

})