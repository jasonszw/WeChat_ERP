// pages/new-add-order/new-add-order.js
import { AddProductModel } from 'add-product-model.js';
let addProductModel = new AddProductModel();

Page({

  toggleStatus: function (e) {
    let index = addProductModel.getDataSet(e, 'index'),
      status = addProductModel.getDataSet(e, 'status');
    this.data.productList[index].status = !status;
    this._resetData();
    //更新本地缓存
    addProductModel.updateProductList(this.data.pageIndex, this.data.productList);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this; 
    this.data.pageIndex = options.pageIndex;
    console.log(this.data.pageIndex);
    if (options.pageIndex === "1") {
      let isSame = addProductModel.isSameCode(options.code);
      console.log(isSame);
      if (isSame) {
        let productList = addProductModel.execGetProductList(self.data.pageIndex);
        console.log(productList);
        self.data.productList = productList;
        self._resetData();
      } else {
        addProductModel.getCustomerProduct(options.code, function (res) {
          //从添加订单页面中跳转过来
          self.data.productList = res;
          addProductModel.updateProductList(self.data.pageIndex, res);
          self._resetData();
        });
      }
      
    }

    if (options.pageIndex === "2") {
      let isSame = addProductModel.isSameCode(options.code);
      console.log(isSame);
      if (isSame) {
        let productList = addProductModel.execGetProductList(self.data.pageIndex);
        console.log(productList);
        self.data.productList = productList;
        self._resetData();
      } else {
        addProductModel.getCustomerProduct(options.code, function (res) {
          var products = JSON.parse(options.productList);
          for (let item of res) {
            item.FItemCode.FNum = 1;
            item.FPrice = Number(item.FPrice).toFixed(2);
            item.status = false;

            for (let index of products) {
              if (item.FItemCode.FCode === index.FItemCode.FCode) {
                index.FQty = 1;
                item.FPrice = Number(item.FPrice).toFixed(2);
                item.status = true
              }
            }
          }
          
          //从添加订单页面中跳转过来
          self.data.productList = res;
          addProductModel.updateProductList(self.data.pageIndex, res);
          self._resetData();
        });
      }

    }
  },
  addProductToOrder: function () {
    if (this.data.pageIndex === "1") {
      wx.setStorageSync("STATUS", "ok");
      wx.navigateBack({
        delta: 1
      });
    }
    if (this.data.pageIndex === "2") {
      wx.setStorageSync("STATUS", "ok");
      wx.navigateBack({
        delta: 1
      });
    }
  },
  _resetData: function () {
    this.setData({
      productList: this.data.productList
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
   
  },


})