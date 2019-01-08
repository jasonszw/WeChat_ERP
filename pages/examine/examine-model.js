import { Base } from '../../utils/base.js';
import { Config } from '../../utils/config.js';
let statusList = [
  '未审核',
  '已审核'
],
  amountList = [
    '从小到大',
    '从大到小'
  ],
  timeList = [
    '三天内',
    '一周内',
    '一月内',
    '全部'
  ],
  checkDto = {
    status: '',
    customer: '',
    interval: '',
    amount: '',
  };
class ExamineModel extends Base {
  constructor() {
    super();
    this.EXAMINE_LIST = 'EXAMINE_LIST'; // 审核列表key 
  }
  // 从服务器获取审核订单
  getExamineListFromServer(page, data) {
    console.log(data);
    let params = {
      url: Config.reviewUrl,
      method: 'POST',
      data: data,
      success: (res) => {
        console.log(res);
        page.setData({
          examineList: res
        });
        wx.hideLoading();
      }
    }
    this.request(params);
  }
  /**
   * 更新审核列表项到服务器
   * @param 所需更新参数对象
   */
  updataExamineStatusTOServer(data, fn) {
    console.log(data.KeyId);
    let params = {
      url: Config.confirmOrderUrl,
      method: 'POST',
      data: { keyid: data.KeyId },
      success: (res) => {
        fn(res);
        console.log('更新审核订单项成功');
      }
    }
    this.request(params);
  }
  /**
   * 显示下拉列表
   * 变更 下拉列表图标
   * 变更 背景部分高度 
   * 变更绑定的下拉列表数据 optionsList 
   * @param page examine 页面的page对象
   * @param queryListType 判断所点击的项 
   */
  showDropdownList(page, queryListType) {
    let optionsList = [],
      left = '',
      navHeight = 0,
      selectType = '',
      status, amountStatus, timeStatus;
    switch (queryListType) {
      case 'status':
        optionsList = statusList;
        navHeight = (statusList.length * 2 + 1) * 14;
        selectType = 'status';
        page.data.status = false;
        break;
      case 'amount':
        optionsList = amountList;
        left = '33.3%';
        navHeight = (amountList.length * 2 + 1) * 14;
        selectType = 'amount';
        page.data.amountStatus = false;
        break;
      case 'time':
        optionsList = timeList;
        left = '66.7%';
        navHeight = (timeList.length * 2 + 1) * 14;
        selectType = 'time';
        page.data.timeStatus = false;
        break;
      default: break;
    }
    if (page.data.showedList) {
      page.setData({
        status: page.data.status,
        amountStatus: page.data.amountStatus,
        timeStatus: page.data.timeStatus,
        optionsList: optionsList,
        left: left,
        showedList: !page.data.showedList,
        navHeight: navHeight + 120,
        selectType: selectType
      });
    } else {
      page.setData({
        status: page.data.status,
        amountStatus: page.data.amountStatus,
        timeStatus: page.data.timeStatus,
        optionsList: optionsList,
        left: left,
        showedList: !page.data.showedList,
        navHeight: page.data.navHeight - navHeight,
        selectType: selectType
      });
    }
  }
  //  显示用户所选项
  showSelectdItem(page, data) {
    let index = data.index,
      selectType = data.selectType,
      name = data.name,
      navHeight = 0, status, amountStatus, timeStatus;
    switch (selectType) {
      case 'status':
        status = !page.data.status;
        navHeight = (statusList.length * 2 + 1) * 14;
        checkDto.status = index + '';
        page.setData({
          status: status,
          amountStatus: amountStatus,
          timeStatus: timeStatus,
          showedList: !page.data.showedList,
          navHeight: page.data.navHeight - navHeight,
          selectStatusItem: name
        });
        break;
      case 'amount':
        amountStatus = !page.data.amountStatus;
        navHeight = (amountList.length * 2 + 1) * 14;
        checkDto.amount = index + '';
        page.setData({
          status: status,
          amountStatus: amountStatus,
          timeStatus: timeStatus,
          showedList: !page.data.showedList,
          navHeight: page.data.navHeight - navHeight,
          selectAmountItem: name
        })
        break;
      case 'time':
        timeStatus = !page.data.timeStatus;
        checkDto.interval = index + '';
        navHeight = (timeList.length * 2 + 1) * 14;
        page.setData({
          status: status,
          amountStatus: amountStatus,
          timeStatus: timeStatus,
          showedList: !page.data.showedList,
          navHeight: page.data.navHeight - navHeight,
          selectTimeItem: name
        })
        break;
      default: break;
    }
    this.getExamineListFromServer(page, checkDto);
  }

}
export { checkDto, ExamineModel }