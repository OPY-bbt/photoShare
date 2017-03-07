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


/**** login *****/
export const SIGNUP_SHOW = 'SIGNUP_SHOW';
export const SIGNUP_CREATE = 'SIGNUP_CREATE';
export const SIGNUP_CANCEL = 'SIGNUP_CANCEL';

export const signupShow = () => {
  return {
    type: SIGNUP_SHOW,
    visible: true
  }
}

export const signupCreate = () => {
  return {
    type: SIGNUP_CANCEL,
    visible: false
  }
}

export const signupCancel = () => {
  return {
    type: SIGNUP_CANCEL,
    visible: false
  }
}
