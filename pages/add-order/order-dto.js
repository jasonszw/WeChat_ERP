
/**
 * @class 订单Dto 
 * @param data order对象 
 */
function OrderDto(data) {
  this.f_code = data.code;//	是	string	机构代码
  this.f_name = data.name;	//是	string	机构名称
  this.f_address = data.addressDetail === undefined ? data.address : data.address + data.addressDetail;	//否	string	收货地址
  this.f_deliverymethod = data.deliveryMethod;	//是	string	配送方式
  this.f_saleman = data.saleman;	//是	string	业务员 
  this.f_memo = data.memo;	//否	string	备注
  this.f_distributionpoint = data.distributionPoint;	//是	string	作业区
  this.f_orgname = data.orgName;	//否	string	所属部门
  this.f_bill = data.bill;	//是	string	计划类型
  this.products = data.products; //是 数组对象 定制产品
  this.f_linkman = data.linkMan; //否	string	联系人
  this.f_phone = data.phone; //否	string	联系电话
  return this;
}

function ProductDto(data) {
  this.f_num = data.num  //是	string	数量
  this.f_price = data.price //是	string	价格
  this.f_product_code = data.productCode
}

module.exports = {
  OrderDto: OrderDto,
  ProductDto: ProductDto
}
