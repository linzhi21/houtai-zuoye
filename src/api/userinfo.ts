import request from '@/utils/request'

export interface loginParamsData{
    username:string,
    password:string
}

//登录发请求  返回的数据是token
export interface TokenData{
    token:string
}

//获取用户信息,返回的数据
export interface getUserInfoData{
    routes:string[],
    buttons:string[],
    roles:string[],
    name:string,   //用户名字
    avatar:string

}


//获取用户信息
// GET /admin/acl/index/info
// info
const getUserInfo = ()=>{
    return request.get<any,getUserInfoData>('/admin/acl/index/info')
}


// POST /admin/acl/index/login
// login
const userLogin = (loginParams:loginParamsData) =>{
    return request.post<any,TokenData>('/admin/acl/index/login',loginParams)
}

//退出登录
// POST /admin/acl/index/logout
// logout
const userLogout = ()=>{
    return request.post<any,null>('/admin/acl/index/logout')
}

// GET /admin/acl/index/menu
// getMenu

export{
    getUserInfo,
    userLogin,
    userLogout
}