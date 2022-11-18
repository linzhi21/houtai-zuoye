import {defineStore} from 'pinia'
import { getUserInfo,userLogin, userLogout } from '@/api/userinfo'
import type {getUserInfoData,loginParamsData }from '@/api/userinfo'
import { ElMessage } from 'element-plus'
import { staticRoutes } from '@/router/routes'
import type { RouteRecordRaw } from 'vue-router'


//对仓库里面的初始化数据进行  类型限定 其实是和返回的数据类型一样
interface stateData{
  token:string
  userInfo:getUserInfoData,
  menuRoutes:RouteRecordRaw[]
}


export const useUserInfoStore=defineStore('userInfo',{
 state():stateData{
  return {
    //初始化的token就是,我们存在本地的token
    token:localStorage.getItem('token_key')  ||  '' , //设置token与自动登录

    //发送请求 获取到用户信息  初始化数据(空)  我们需要有个容器接收
    userInfo:{
      routes:[],
      buttons:[],
      roles:[],
      name:'',   
      avatar:''
    },
    menuRoutes:staticRoutes
    
  }
 },

 actions:{
  async login(loginParams:loginParamsData){
    try {
      //发送请求,携带参数  
      const result = await userLogin(loginParams)  
      //必须得搞this.token,第一次登录,本地没有存储token,需要发送请求获取到的那个token
      console.log(result);
      
      this.token = result.token   //把获取到的token,存放到仓库
      //把token存放在本地,刷新页面,直接用本地的token
      localStorage.setItem('token_key',result.token)
      ElMessage.success('登陆成功')
      return 'ok' //如果后面要用 (后面要知道这里是失败还是成功) 记得要返回
    } catch (error) { 

      ElMessage.error('登陆失败')      
      return Promise.reject('失败')
    }
  },

  //发送请求,获取用户信息数据
  //名字我们自己定义  路由守卫里面调用
  async getUserInfo (){
    try {
      const result = await getUserInfo()
      //获取到用户信息,整个给到pinia
      this.userInfo = result  
      return 'ok'
    } catch (error) {
      ElMessage.error('获取用户信息失败')
      return Promise.reject('failed')
    }
  },

  // 获取用户信息失败,重新获取token,清除本地保存的token以及,仓库中的token,清空用户信息
  //退出登录的时候  也可以调用这个函数,清空
  reset(){
    localStorage.removeItem('token_key')  //清空本token
    this.token = ''
    this.userInfo={
      routes:[],
      buttons:[],
      roles:[],
      name:'',   
      avatar:''
    }
  },

  //退出登录
  async logout(){
    try {
      await userLogout()
      this.reset()
      return 'ok'
    } catch (error) {
      return Promise.reject('failed')
    }
  }
  


 }
})