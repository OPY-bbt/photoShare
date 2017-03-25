import io from 'socket.io-client'

export const socket = io.connect('http://123.206.187.156:3500')

export const SET_SNACKBAR_STATE = 'SET_SNACKBAR_STATE';

export const setSnackbarState = (state) => {
  return {
      type: SET_SNACKBAR_STATE,
      state
  }
}

export const SHOWUPLOADPICMESSAGE = 'SHOWUPLOADPICMESSAGE';
export const showUploadPicMessage = (user, imgUrl) => {
  return {
    type: SHOWUPLOADPICMESSAGE,
    userName: user,
    img: imgUrl
  }
}

//登录&注册&登出处理
export const login = (userName,password)=>{
  return new Promise((resolve,reject) => {
    socket.emit('login',{userName,password}, (info)=>{
      resolve(info);
    })
  })
}

export const signup = (userName, password, qq, des, sex) => {
  return new Promise((resolve, reject) => {
    socket.emit('signup', {userName, password, qq, des, sex}, (info) =>{
      resolve(info);
    })
  })
}

export const uploadPic = (imgUrl, userName) => {
  return new Promise((resolve, reject) => {
    socket.emit('uploadPic', {imgUrl, userName}, (info) => {
      resolve(info);
    })
  })
}

export const loadMorePic = () => {
  return new Promise((resolve, reject) => {
    socket.emit('loadMorePic', {}, (info) => {
      resolve(info);
    })
  })
}


/**** login *****/
export const SIGNUP_SHOW = 'SIGNUP_SHOW';
export const SIGNUP_CREATE = 'SIGNUP_CREATE';
export const SIGNUP_CANCEL = 'SIGNUP_CANCEL';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

export const signupShow = () => {
  return {
    type: SIGNUP_SHOW
  }
}

export const signupCreate = () => {
  return {
    type: SIGNUP_CANCEL
  }
}

export const signupCancel = () => {
  return {
    type: SIGNUP_CANCEL
  }
}

export const loginSuccess = (userName) => {
  return {
    type: LOGIN_SUCCESS,
    loginSuccess: true,
    userName: userName
  }
}

/**** index *****/
export const INDEX_UIDISPLAY = 'INDEX_UIDISPLAY';
export const INDEX_UPDATEMORE = 'INDEX_UPDATEMORE';
export const INDEX_GENERATESTATUS = 'INDEX_GENERATESTATUS';
export const INDEX_PUSHIMGLIST = 'INDEX_PUSHIMGLIST';

export const indexUIDisplay = () => {
  return {
    type: INDEX_UIDISPLAY
  }
}

export const indexUpdateMore = () => {
  return {
    type: INDEX_UPDATEMORE
  }
}

export const indexGenerateStatus = () => {
  return {
    type: INDEX_GENERATESTATUS
  }
}

export const pushImgList = (lists) => {
  return {
    type: INDEX_PUSHIMGLIST,
    content: lists
  }
}

