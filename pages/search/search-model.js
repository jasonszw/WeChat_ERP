import { Base } from '../../utils/base.js';
import { Config } from '../../utils/config.js';
import { Constants } from '../../utils/constants.js';

class SearchModel extends Base {
  constructor() {
    super();
  }
  //获取所有客户信息
  execGetCustomerList() {
    return wx.getStorageSync(Constants.CUSTOMER_LIST);
  }
  // 过滤
  doFilter(str) {
    let customerList = this.execGetCustomerList(),
      resList = [];
    if (str != '') {
      for (let item of customerList) {
        if (item.FName.includes(str) && !item.FName.includes('?')) {
          resList.push(item);
        }
      }
    }
    return resList;
  }
}
export { SearchModel }