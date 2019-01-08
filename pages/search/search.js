// pages/search/search.js
import { SearchModel } from 'search-model.js';
import { Constants } from '../../utils/constants.js';
import { AddProductModel } from '../add-product/add-product-model.js';
let searchModel = new SearchModel(),
  addProductModel = new AddProductModel();

let searchApp = {
  data: {
    pageIndex: 0,
    showed: true,
    hasSearch: false
  },

  onLoad: function (options) {
    this.data.pageIndex = options.pageIndex;
    switch (this.data.pageIndex) {
      case "0": case "1": this.data.searchType = true; break;
      case "2": this.data.searchType = false; break;
      default: break;
    }
    this.setData({
      searchType: this.data.searchType
    })
  },
  // 过滤字符
  bindSearchInput: function (e) {
    let value = e.detail.value;
    this.data.userInput = value;
    console.log(value);
    searchModel.doFilter(value);
    this.data.resList = searchModel.doFilter(value);
    this.data.showed = true;
    this._resetData();
  },

  //查询操作,将数据返回前一页面
  doSearch: function (e) {
    this.data.hasSearch = true;
    let customer = e.currentTarget.dataset;
    console.log(customer);
    this.switchPage(customer);
  },
  //切换页面
  switchPage(customer) {
    let self = this;
    switch (this.data.pageIndex) {
      case "0": //审核订单数据存储
        wx.setStorageSync(Constants.EXAMINE_CUSTOMER, customer);
        wx.navigateBack({
          delta: 1
        });
        break;
      case "1": //订单列表数据存储
        wx.setStorageSync(Constants.ORDER_LIST_CUSTOMER, customer);
        wx.navigateBack({
          delta: 1
        });
        break;
      case "2": // 添加订单数据存储
        addProductModel.getCustomerProduct(customer.code, function (res) {
          wx.setStorageSync(Constants.ADD_ORDER_CUSTOMER, customer);
          wx.navigateBack({
            delta: 1
          });
        }, function (msg) {
          wx.showModal({
            title: '温馨提示',
            content: '您当前选择的机构无产品合同,请选择其他机构进行添加~',
            showCancel: false
          })
          // delete self.data.customer;
        });
        break;
      default: break;
    }
  },
  // 匹配结果返回至输入框
  returnRes: function (e) {
    console.log(e.currentTarget.dataset);
    let customer = e.currentTarget.dataset;
    this.data.customer = customer.name;
    this.data.name = customer.name;
    this.data.code = customer.code;
    this.data.showed = false;
    this.data.hasSearch = true;
    customer.userInput = this.data.userInput;
    customer.customer = customer.name;
    this.switchPage(customer);
    this._resetData();
  },

  //更新视图层数据
  _resetData: function () {
    this.setData({
      userInput: this.data.userInput,
      resList: this.data.resList,
      customer: this.data.customer,
      name: this.data.name,
      code: this.data.code,
      showed: this.data.showed
    })
  },
  /**
   * 生命周期函数--监听页面卸载 
   * 未执行查询时,将之前的数据清除,避免数据的异步
   */
  onUnload: function () {
    if (!this.data.hasSearch) {
      wx.removeStorageSync(Constants.EXAMINE_CUSTOMER);
      wx.removeStorageSync(Constants.ORDER_LIST_CUSTOMER);
      wx.removeStorageSync(Constants.ADD_ORDER_CUSTOMER);
    }
  }
}
Page(searchApp);