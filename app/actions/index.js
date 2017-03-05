export const SET_SNACKBAR_STATE = 'SET_SNACKBAR_STATE';

export const setSnackbarState = (state) => {
    return {
        type: SET_SNACKBAR_STATE,
        state
    }
}

//登录&注册&登出处理
export const login = (nickname,password)=>{
    return new Promise((resolve,reject) => {
        /*socket.emit('login',{nickname,password},(info)=>{
            resolve(info);
        })*/
        console.log('login action')
    })
}