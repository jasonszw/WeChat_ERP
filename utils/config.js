let host = "https://fftapi.ffqs.com/v1";

// 获取本地 token
let Config = {

  host,
  // 登录url 
  loginUrl: `${host}/login`,

  //获取所有客户列表
  customerUrl: `${host}/customer`,

  //获取某个客户信息
  customerDetailUrl: (code) => { return `${host}/customer_detail?code=${code}` },

  // 获取某个产品信息
  customerProductUrl: (code) => { return `${host}/customer_product?code=${code}` },

  // 获取审核列表
  reviewUrl: `${host}/order/review`,

  //确认审核通过
  confirmOrderUrl: `${host}/order/confirmorder`,

  // 获取计划类型
  getPlanTypeUrl: `${host}/items/type`,

  //获取配送方式
  getSendMethodUrl: `${host}/items/method`,

  //获取业务员
  getSaleUrl: `${host}/items/sale`,

  //获取作业区
  getWorkAreaUrl: `${host}/items/address`,

  // 添加订单
  addOrderUrl: `${host}/order/create`,
  
  updateOrderUrl: (keyId) => { return `${host}/order/create?key_id={keyId}` },

  //修改订单
  modifyOrderUrl: (key_id) => {
    return `${host}/order/create?key_id=${key_id}`
  },

  //订单作废
  toVoidOrderUrl: `${host}/order/invalid`,

  // 获取订单列表
  getOrderListUrl: (params) => {
    return `${host}/order/order_list?status=${params.status}&customer=${params.customer}&page=${params.page}`
  },

  //获取订单详情
  getOrderDetailUrl: (key_id) => {
    return `${host}/order/order_detail?key_id=${key_id}`
  }
};
export { Config };