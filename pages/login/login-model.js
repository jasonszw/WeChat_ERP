import { Base } from '../../utils/base.js';
import { Config } from '../../utils/config.js';
class LoginModel extends Base {
  constructor() {
    super();
  }
  // 登录请求处理 user 为传递对象 {username:'',password:''}
  loginRequest(user) {
    let params = {
      method: "POST",
      url: Config.loginUrl,
      data: user,
      success: (res) => {
        wx.showLoading({
          title: '登录中',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
        this.execStoreUser(res, user);
      },
      fail: (msg) => {
        console.log(msg);
        wx.showModal({
          content: msg,
          showCancel: false
        })
      },
    }
    this.request(params);

  }
  //登录成功情况下,用户信息本地保存
  execStoreUser(res, user) {
    let self = this;
    try {
      wx.setStorageSync("TOKEN", res['access-token']);
      this.localStorage(Config.customerUrl, 'CUSTOMER_LIST'); //缓存客户列表
      this.localStorage(Config.getSendMethodUrl, 'SEND_METHOD'); //缓存配送方式
      this.localStorage(Config.getWorkAreaUrl, 'WORK_AREA');  //缓存作业区
      this.localStorage(Config.getSaleUrl, 'SALE'); //缓存业务员
      this.localStorage(Config.getPlanTypeUrl, 'PLAN_TYPE') //计划类型
    } catch (e) {
      console.log(e);
    }
    switch (res.role) {
      case '1086': wx.navigateTo({
        url: '../order-list/order-list',
      }); break;
      case '1000': wx.navigateTo({
        url: '../examine/examine',
      }); break;
      default: break;
    }
  }
  //服务器请求数据,并本地缓存
  localStorage(url, key) {
    console.log(url);
    let params = {
      method: "GET",
      url: url,
      success: (res) => {
        wx.setStorageSync(key, res);
      },
      fail: (msg) => {
        console.log(msg);
      },
    }
    this.request(params);
  }

}
export { LoginModel }