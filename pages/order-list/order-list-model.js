import { Base } from '../../utils/base.js';
import { Config } from '../../utils/config.js';

let pageNum = 10;
/**
 * @class 订单列表业务操作层类
 * 区分订单信息分组(作废为一组,其余情况为一组)
 */
export class OrderListModel extends Base {
  constructor() {
    super();
  }
  // 获取服务器端数据 
  getOrderListFromServer(param, fn, _that) {
    console.log(Config.getOrderListUrl(param));
    let params = {
      url: Config.getOrderListUrl(param),
      method: 'GET',
      success: (res) => {
        fn(res);
        wx.hideLoading();
      },
      fail: (msg) => {
        wx.hideLoading();
        _that.setData({
          orderList: []
        })
      }
    }
    this.request(params);
  }
  // 获取作废列表单独显示 
  getObsoleteList() {
    let obsoleteList = [];
    let orderList = wx.getStorageSync(this.orderList);
    for (let item of orderList) {
      //为作废的情况 ,添加到列表
      if (item.status === 0) {
        obsoleteList.push(item);
      }
    }
    return obsoleteList;
  }

}

