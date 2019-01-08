// examine.js
import { checkDto, ExamineModel } from "examine-model.js";
import { Constants } from '../../utils/constants.js';
let examineModel = new ExamineModel();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showedList: true, //默认隐藏下拉列表
    status: true,    //图标默认向下
    amountStatus: true,  //图标默认向下
    timeStatus: true  //图标默认向下
  },
  showDialog: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      dialogOptions: {
        showDialogStatus: true,
        content: '您正在操作此订单为未审核的订单,是否继续操作',
        cancelText: '取消',
        confirmText: '确定',
        cancel: 'hideDialog',
        confirm: 'changeStatus',
        index: index
      }
    })
  },
  hideDialog: function (e) {
    this.setData({
      dialogOptions: {
        showDialogStatus: false
      }
    })
  },
  /**
   * 更改审核订单状态 
   */
  changeStatus: function (e) {
    let self = this;
    let index = e.currentTarget.dataset.index;
    this.data.examineList[index].FStatus = 50; //修改状态为已审核
    console.log(this.data.examineList[index]);
    examineModel.updataExamineStatusTOServer(this.data.examineList[index], function () {
      self._resetExamineList();
    });
  },

  _resetExamineList: function () {
    var self = this;
    this.setData({
      dialogOptions: {
        showDialogStatus: !self.data.dialogOptions.showDialogStatus,
      },
      examineList: self.data.examineList
    });
  },
  // 显示下拉列表
  showDropList: function (e) {
    let self = this;
    console.log(e.currentTarget.dataset);
    var queryListType = e.currentTarget.dataset.queryList;

    examineModel.showDropdownList(this, queryListType);
  },
  /**
   * 选择值 
   */
  selectItem: function (e) {
    examineModel.showSelectdItem(this, e.currentTarget.dataset);
  },

  toSearch: function (e) {
    wx.navigateTo({
      url: '../search/search?pageIndex=0',
    })
  },

  onShow: function (e) {
    let customerObj = wx.getStorageSync(Constants.EXAMINE_CUSTOMER);
    //当获取的是对象时,代表值已经获取
    console.log(customerObj);
    if (typeof customerObj == 'object') {
      //用户输入为机构
      if (customerObj.hasOwnProperty('code')) {
        checkDto.customer = customerObj.customer;
        this.data.userInput = customerObj.customer;
        this.data.hasSearch = true;
      } else if (customerObj.hasOwnProperty('userInput')) {
        checkDto.customer = customerObj.userInput;
        this.data.userInput = customerObj.userInput;
        this.data.hasSearch = true;
      }else{
        checkDto.customer = "";
        this.data.hasSearch = false;
      }
    }
    this._resetData();
    wx.showLoading({
      title: '加载中...',
    })
    examineModel.getExamineListFromServer(this, checkDto);
  },

  /**
* 页面相关事件处理函数--监听用户下拉动作
*/
  onPullDownRefresh: function () {
    let self = this;
    wx.showLoading({
      title: '加载中...',
    })
    orderListModel.getOrderListFromServer(this.data.holderParams, function (res) {
      self.data.orderList.push.apply(self.data.orderList, res);
      self._resetData();
    }, this);
  },
  _resetData: function () {
    this.setData({
      hasSearch: this.data.hasSearch,
      userInput: this.data.userInput
    })
  },
  /**
  * 生命周期函数--监听页面卸载 
  * 
  */
  onUnload: function () {

  }

})