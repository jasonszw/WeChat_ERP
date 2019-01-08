import { Base } from '../../utils/base.js';
import { Config } from '../../utils/config.js';
let saleList = wx.getStorageSync('SALE'),  //业务员列表
  workAreaList = wx.getStorageSync('WORK_AREA'), //工作区列表
  sendMethodList = wx.getStorageSync('SEND_METHOD'), //配送方式列表
  planList = wx.getStorageSync('PLAN_TYPE'), //计划类型
  orgAddressList = [], //所属部门地址 FAddress
  orgNameList = [];   //所属部门名字 FName

function OrderDto(data) {
  this.f_code = data.f_code;//	是	string	机构代码
  this.f_name = data.f_name;	//是	string	机构名称
  this.f_address = data.addressDetail === undefined ? data.address : data.address + data.addressDetail;	//否	string	收货地址
  this.f_deliverymethod = data.f_deliverymethod;	//是	string	配送方式
  this.f_saleman = data.f_saleman;	//是	string	业务员 
  this.f_memo = data.f_memo;	//否	string	备注
  this.f_distributionpoint = data.f_distributionpoint;	//是	string	作业区
  this.f_orgname = data.f_orgname;	//否	string	所属部门
  this.f_bill = data.f_bill;	//是	string	计划类型
  this.products = []; //是 数组对象 定制产品
  this.f_linkman = data.f_linkman; //否	string	联系人
  this.f_phone = data.f_phone; //否	string	联系电话
}

function ProductDto(data) {
  this.f_num = data.num  //是	string	数量
  this.f_price = data.price //是	string	价格
  this.f_product_code = data.productCode
}

class ModifyOrderModel extends Base {
  constructor() {
    super();
  }
  //获取数据
  getModifyInfo(options, _this) {
    orgAddressList = [];
    orgNameList = [];
    let orderInfo = JSON.parse(options.orderInfo);
    console.log(orderInfo.products);

    let params = {
      method: "GET",
      url: Config.customerDetailUrl(orderInfo.order.FCode),
      success: (res) => {
        console.log(res);
        let customer = res.customer; //顾客基本信息
        if (res.customer.FCreditFlag.includes('不通过')) {
          _this.data.dialogOptions = {
            showDialogStatus: true,
            content: '您添加的机构信用不足哦,是否继续',
            cancelText: '取消',
            confirmText: '继续',
            cancel: 'hideDialog',
            confirm: 'hideDialog'
          }
        }
        //存在所属部门
        if (res.customerorg && (res.customerorg.FAddress != null || res.customerorg.FAddress != '')) {
          _this.setData({
            orgDisabled: true
          })
          for (let orgItem of res.customerorg) {
            orgNameList.push(orgItem.FName);
            orgAddressList.push(orgItem.FAddress);
          }
        } else {
          _this.setData({
            orgDisabled: false
          })
        }
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
    // 填充数据
    _this.setData({
      modifyInputValue: orderInfo,
      key_id: orderInfo.order.KeyId,
      productList: orderInfo.products
    })

    if (orderInfo.FDeliveryMethod === "自提") {
      _this.setData({
        isAddress: false
      })
    }
    if (orderInfo.FPhone == "") {
      _this.setData({
        contactNumber: true
      })
    }
    if (orderInfo.FLinkman == "") {
      _this.setData({
        linkMan: true
      })
    }

   

  }
  // 设置下拉列表项
  getOptionsList(e, page) {
    let type = this.getDataSet(e, 'type'),
      optionsList = [];
    switch (type) {
      case 'SALE': optionsList = saleList; break;
      case 'WORK_AREA': optionsList = workAreaList; break;
      case 'SEND_METHOD': optionsList = sendMethodList; break;
      case 'PLAN_TYPE': optionsList = planList; break;
      case 'ORG': optionsList = orgNameList; break;
      default: break;
    }
    if (optionsList.length > 0) {
      page.setData({
        showedRadioGroup: true,
        selectType: type,
        optionsList: optionsList
      })
    }
  }

  //获取用户点击项 
  showSelectdItemToView(e, _this) {
    let type = this.getDataSet(e, 'type'),
      item = this.getDataSet(e, 'item'),
      index = this.getDataSet(e, 'index');
      console.log(item,index)
    switch (type) {
      case 'SALE': _this.data.modifyInputValue.order.FSalesman = item; break;
      case 'WORK_AREA': _this.data.modifyInputValue.order.FDistributionPoint = item; break;
      case 'SEND_METHOD': _this.data.modifyInputValue.order.FDeliveryMethod = item; break;
      case 'PLAN_TYPE': _this.data.modifyInputValue.order.FBill = item; break;
      case 'ORG': 
        _this.data.modifyInputValue.order.FOrgName = item; 
        if (orgAddressList[index] == null) {
          _this.data.modifyInputValue.order.FAddress = '';
          _this.setData({
            addressDisabled: false  
          })
        } else {
          _this.data.modifyInputValue.order.FAddress = orgAddressList[index]
          _this.setData({
            addressDisabled: true
          })
        }
        break;
      default: break;
    }
    switch (item) {
      case "自提": _this.setData({ isAddress: false }); break;
      case "送货上门": _this.setData({ isAddress: true }); break;
      case "物流配送": _this.setData({ isAddress: true }); break;
      case "多方联运": _this.setData({ isAddress: true }); break;
      case "其他": _this.setData({ isAddress: true }); break;
      default: break;
    }
    _this.setData({
      showedRadioGroup: false,
      modifyInputValue: _this.data.modifyInputValue
    });
  }

  //将数据添加到产品列表,过滤筛选未选择的信息
  addToProductList(_this) {
    let productList = wx.getStorageSync('MODIFY_PRODUCT_LIST');
    console.log(productList);
    let newProductList = [];
    for (let item of productList) {
      if (item.status) {
        newProductList.push(item);
        console.log(item);
      }
    }
    wx.setStorageSync("NewProductList", newProductList)
    _this.setData({
      productList : newProductList
    })
  }

  //修改完成插入新数据。
  modifyCompleted (key_id,data,_this) {
    let newProduct = {};
    let product = [];

    for (let item of _this.data.productList) {
      newProduct.price = item.FPrice;
      newProduct.productCode = item.FItemCode.FCode;
      newProduct.num = String(item.FItemCode.FNum);
      product.push(new ProductDto(newProduct))
    }
    //获取修改后的产品数量及价格
    let index = 0;
    for (let item in data) {
      if (item.includes('num_')) {
        index = item.split('_')[1];
        product[index].f_num = data[item];
      }
      if (item.includes('price_')) {
        index = item.split('_')[1];
        product[index].f_price = data[item];
      }
    }
    let orderDto = new OrderDto(data);
    orderDto.products = product;

    wx.setStorageSync('orderDto', orderDto)
    console.log(orderDto);
    //获取添加的产品
    let params = {
      method: "POST",
      url: Config.modifyOrderUrl(key_id),
      data: orderDto,
      success: (res) => {
        console.log(res)
        console.log("修改成功");
        wx.navigateBack({
          delta: 1
        })
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
}
export { ModifyOrderModel }