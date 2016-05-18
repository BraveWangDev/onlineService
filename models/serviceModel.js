// 引入mongoose依赖模块
var mongoose = require('mongoose');

// 定义文档原型 userSchema
var serviceSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,                              // 必输
    //set: function(value) {                       // 赋值器
    //        return value.trim().toLowerCase()
    //      },
    //validate: [                                  // 校验 save时触发
    //  function(email) {
    //    return (email.match(/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i) != null)},
    //  'Invalid email'
    //]
  },
  password: String,                              // 密码
  channel : Number,                              // 渠道
  created_at : {type : Date, default : Date.now},// 创建日期
  updated_at : {type : Date, default : Date.now},// 修改日期
  active : {type : Boolean, default : true},     // 账号激活状态
  admin: {                                       // 是否管理员
    type: Boolean,
    default: false
  }
});

// 暴露模型给外部引用
module.exports = mongoose.model('serviceUser', serviceSchema);

