import Immutable from 'immutable'

import {
	SET_SNACKBAR_STATE,
  SIGNUP_SHOW,
  SIGNUP_CREATE,
  SIGNUP_CANCEL
} from '../actions'

let defaultState = {
    visible: true,
    isShowMenu:true,
    isShowImageExp: false,
    isNeedScroll: false,
    isShowSysSetting: false,
    isShowRoomInfo: window.innerWidth > 980 ? true:false,
    isShowCreateRoom: false,
    isShowSearchUser: false,
    isShowExpression: false,
    isShowRichText: false,
    isLoading: false,
    listState:'roomList',
    badgeCount: {},
    modalState: {
        modalInfo: {
            title: '',
            owner: '',
            timestamp: 0,
        },
        isShow: false
    },
    infoCardState: {
        nickname: 'loading...',
        avatar: 'loading...',
        info: '...',
        isShow:false
    },
    expression: {
        timestamp: null,
        emoji:''
    },
    snackbar:{
        open: false,
        autoHideDuration: 3000
    }
}
defaultState = Immutable.fromJS(defaultState);
export default function pageState(state = defaultState, action) {
	switch (action.type) {
		case SET_SNACKBAR_STATE: {
      let snackbar = Immutable.fromJS({snackbar:action.state});
      return state.mergeDeep(snackbar);
    }
    case SIGNUP_SHOW:{
      let visible = Immutable.fromJS({visible:action.visible});
      return state.mergeDeep(visible);
    }
    case SIGNUP_CREATE:{
      return {visible: state.visible}
    }
    case SIGNUP_CANCEL: {
      return {visible: state.visible}
    }
    default: {
      return state;
    }
	}
}