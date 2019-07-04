// 数据库model文件
const mongoose = require("mongoose");

// schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    default: "超级帅"
  },
  avatar: {
    type: String,
    default: "http://localhost:9090/avatar.jpg"
  },
  roles: {
    type: Number,
    default: 2 // 0 - 超级管理员  1 - 管理员 2 - 普通用户
  }
});

// model
module.exports = mongoose.model("user", userSchema);
