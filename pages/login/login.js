// login.js
import { LoginModel } from 'login-model.js';
import { Constants } from '../../utils/constants.js';

let loginModel = new LoginModel();

let app = {
  data: {
    isInput: false
  },
  bindLoginSubmit: function (e) {
    this.setData({
      isInput: false
    })
    loginModel.loginRequest(e.detail.value);
  },
  bindInputTap: function (e) {
    this.setData({
      isInput: true
    })
    console.log(this.data.isInput);
  },
  onShow:function(e){
    
  }
  
}
Page(app);