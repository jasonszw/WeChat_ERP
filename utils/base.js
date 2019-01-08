import { Config } from 'config.js';
/**
 * @class 基类
 * 1,网络请求共通方法
 * 2,事件绑定数值获取方式
 */
class Base {

  constructor() {
  }

  /**
   * 请求操作(解决无限未授权重试的问题)
   * @param  params 请求参数
   * @param  noRefetch 布尔类型,当为true时,不做未授权重试机制
   */
  request(params, noRefetch) {

    let self = this;
    if (!params.method) {
      params.method = 'GET';
    }
    //非登录api token添加处理
    if (params.url != Config.loginUrl) {
      let token = wx.getStorageSync("TOKEN");
      if (params.url.includes('?')) {
        params.url = params.url + "&access-token=" + token;
      } else {
        params.url = params.url + "?access-token=" + token;
      }
    }
    console.log(params.url);
    wx.request({
      url: params.url,

      data: params.data,

      method: params.method,

      header: {
        'content-type': 'application/json'
      },

      success: function (res) {

        let statusCode = res.statusCode.toString();
        console.log(statusCode);

        switch (statusCode) {
          case '200': //请求成功
            console.log(res.data);
            if (res.data.status == 1) {

              typeof params.success == 'function' && params.success(res.data.data);
            } else {
              // 无数据或者异常情况,将error信息传递到前台 
              typeof params.fail == 'function' && params.fail(res.data.msg);
            }
            break;

          case '401': //权限认证失败
            wx.showModal({
              title: '请求失败',
              content: '您的登录状态已失效,请重新登录',
            });
            wx.reLaunch({
              url: '../login/login',
            });
            break;
          case '500': //内部服务器错误
            console.log('内部服务器错');
            break;
          default: break;

        }
      },
      /**
       * 内部问题中断调用
       *  如网络问题,电话中断
       */
      fail: function (err) {
        wx.showModal({
          title: '请求异常',
          content: '请检查您的网络设置是否打开',
          showCancel:false
        })
        console.log("请求异常");
      }
    })
  }
  /**
   * 获取view层中 data 属性所绑定的值
   * @param event view层所绑定的事件对象
   * @param key data-key,绑定的key值
   */
  getDataSet(event, key) {
    return event.currentTarget.dataset[key];
  }

}

export { Base };