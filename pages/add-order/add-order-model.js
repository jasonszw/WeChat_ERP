import { Base } from '../../utils/base.js';
import { Config } from '../../utils/config.js';
import { OrderDto, ProductDto } from 'order-dto.js';
import { Constants } from '../../utils/constants.js';


let orderDto = null;
let order = {};


let saleList = wx.getStorageSync('SALE'),  //业务员列表
  workAreaList = wx.getStorageSync('WORK_AREA'), //工作区列表
  sendMethodList = wx.getStorageSync('SEND_METHOD'), //配送方式列表
  planList = wx.getStorageSync('PLAN_TYPE'), //计划类型
  orgAddressList = [], //所属部门地址 FAddress
  orgNameList = [],//所属部门名字 FName
  dialogOptions = {
    showDialogStatus: true,
    content: '您添加的机构信用不足哦,是否继续',
    cancelText: '取消',
    confirmText: '继续',
    cancel: 'hideDialog',
    confirm: 'hideDialog'
  };

class AddOrderModel extends Base {
  constructor() {
    super();
  }
  // 获取客户信息
  getCustomerInfoFromServer(code, _this) {
    console.log("order:");
    console.log(order);
    orgAddressList = [];
    orgNameList = [];

    var self = this;
    let params = {
      method: "GET",
      url: Config.customerDetailUrl(code),
      success: (res) => {
        console.log(res);
        let customer = res.customer; //顾客基本信息
        // 信誉不足的情况
        if (customer.FCreditFlag.includes('不通过')) {
          _this.data.dialogOptions = dialogOptions;
        }
        // 收货地址存在的情况
        if (res.customerorg && (res.customerorg.FAddress != null || res.customerorg.FAddress != '')) {
          //存在所属部门,禁用输入框
          _this.data.orgDisabled = true;
          for (let orgItem of res.customerorg) {
            orgNameList.push(orgItem.FName);
            orgAddressList.push(orgItem.FAddress);
          }
        } else {
          _this.data.orgDisabled = false;
        }

        if (!order.hasOwnProperty('code')) {
          this.firstLoad(_this);
        } else {
          //机构不同 
          if (code != order.code) {
            this.firstLoad(_this);
          } else {
            //机构相同 
            let tempProductList = wx.getStorageSync(Constants.ADD_PRODUCT_LIST);
            if (tempProductList.length != 0) {
              _this.data.addBtnShowed = !(tempProductList.length == _this.data.productList.length) ;
            }else{
              _this.data.addBtnShowed = true;
            }
          }
        }
        //对象填充 
        order.code = customer.FCode;
        order.name = customer.FName;
        order.linkMan = customer.FLinkman != null ? customer.FLinkman : '';
        order.phone = customer.FMoile
        _this.data.order = order;
        _this.data.codeShowed = true;


        //所属组织 
        _this.data.orgShowed = false;

        _this.data.addressShowed = false;
        _this.data.detailAddressShowed = false;



        this.resetData(_this);
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
  //插入订单数据到服务器
  insertDataToServer(data) {
    let orderDto = new OrderDto(data);
    console.log(orderDto);
    let params = {
      method: "POST",
      url: Config.addOrderUrl,
      data: orderDto,
      success: (res) => {
        wx.showToast({
          title: "添加成功",
        })
        console.log(getCurrentPages().length - 1);
        wx.navigateBack({
          delta: 1
        });
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
  firstLoad(_this) {
    order = {}
    _this.setData({
      order: order,
      productList: [],
      showed: true,
      codeShowed: true,
      addBtnShowed: true,
      orgShowed: false,
      addressShowed: false,
      detailAddressShowed: false
    })
  }

  resetData(_this) {
    _this.setData({
      order: _this.data.order, //表单数据信息
      orgDisabled: _this.data.orgDisabled, //存在设置为禁用,不存在解封禁用 
      dialogOptions: _this.data.dialogOptions, //弹框选项设置 
      showed: _this.data.showed,    //控制未输入机构名称时不显示 与显示
      //显示部分
      codeShowed: _this.data.codeShowed,
      addBtnShowed: _this.data.addBtnShowed,
      orgShowed: _this.data.orgShowed,
      addressShowed: _this.data.addressShowed,
      detailAddressShowed: _this.data.detailAddressShowed,

      // 下拉列表设置项
      showedRadioGroup: _this.data.showedRadioGroup,
      selectType: _this.data.selectType,
      optionsList: _this.data.optionsList,
      // 产品列表数据
      productList: _this.data.productList
    });
    console.log(_this.data);
  }
  // 设置下拉列表项
  getOptionsList(e, _this) {
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
      _this.data = {
        showedRadioGroup: true,
        selectType: type,
        optionsList: optionsList
      }
    }
    this.resetData(_this);
  }
  //获取用户点击项 
  showSelectdItemToView(e, _this) {
    let type = this.getDataSet(e, 'type'),
      item = this.getDataSet(e, 'item'),
      index = this.getDataSet(e, 'index');
    switch (type) {
      case 'SALE': order.saleman = item; break;
      case 'WORK_AREA': order.distributionPoint = item; break;
      case 'SEND_METHOD': order.deliveryMethod = item;
        _this.data.orgShowed = !item.includes('自提');
        if (!_this.data.orgDisabled && _this.data.orgShowed) {
          _this.data.addressShowed = true;
          _this.data.detailAddressShowed = true;
        } else {
          _this.data.addressShowed = false;
          _this.data.detailAddressShowed = false;
        }
        break;
      case 'PLAN_TYPE': order.bill = item; break;
      case 'ORG':
        order.orgName = item;
        console.log(orgAddressList[index]);
        _this.data.addressShowed = true;
        if (orgAddressList[index] == null) {
          order.address = '';
          _this.data.detailAddressShowed = true;
        } else {
          order.address = orgAddressList[index];

          _this.data.detailAddressShowed = false;
        }
        break;
      default: break;
    }
    _this.data.showedRadioGroup = false;
    _this.data.order = order;
    this.resetData(_this);
  }


  //将数据添加到产品列表,过滤筛选未选择的信息
  addToProductList(_this) {
    let productList = wx.getStorageSync('ADD_PRODUCT_LIST');
    console.log(productList);
    let newProductList = [];
    for (let item of productList) {
      if (item.status) {
        newProductList.push(item);
        console.log(item);
      }
    }
    _this.data.productList = newProductList;
    this.resetData(_this);
  }

}
export { AddOrderModel }