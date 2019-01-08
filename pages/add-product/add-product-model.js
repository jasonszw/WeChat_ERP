import { Base } from '../../utils/base.js';
import { Config } from '../../utils/config.js';
class AddProductModel extends Base {
  constructor() {
    super();
  }
  //服务器请求数据,并本地缓存
  getCustomerProduct(code, success,fail) {
    let params = {
      method: "GET",
      url: Config.customerProductUrl(code),
      success: (res) => {
        console.log(res);
        for (let item of res) {
          item.FItemCode.FNum = 1;
          item.FPrice = Number(item.FPrice).toFixed(2);
          item.status = false;
        }
        success(res);
      },
      fail: (msg) => {
        fail(msg);
      },
    }
    this.request(params);
  }
  /**
   * 获取缓存数据
   */
  execGetProductList(pageIndex) {
    let productList = [];
    if (pageIndex === "1") {
      productList = wx.getStorageSync('ADD_PRODUCT_LIST');
    } else {
      productList = wx.getStorageSync('MODIFY_PRODUCT_LIST');
    }
    return productList;
  }
  updateProductList(pageIndex, list) {
    console.log("updateProductList" + list);
    if (pageIndex === "1") {
      wx.setStorageSync('ADD_PRODUCT_LIST', list);
    } else {
      wx.setStorageSync('MODIFY_PRODUCT_LIST', list);
    }
  }
  isSameCode(code) {
    let isSame = false;
    let fcode = wx.getStorageSync('FCODE');
    if (fcode != '') {
      if (fcode === code) {
        isSame = true;
      } else {
        //更新机构代码
        wx.setStorageSync("FCODE", code);
      }
    } else {
      wx.setStorageSync("FCODE", code);
    }
    return isSame;
  }
}
export { AddProductModel }