import Immutable from 'immutable'

import {
	SET_SNACKBAR_STATE
} from '../actions'

let defaultState = {
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

export default function pageState(state = defaultState, action) {
	switch (action.type) {
		case SET_SNACKBAR_STATE: {
      let snackbar = Immutable.fromJS({snackbar:action.state});
      return state.mergeDeep(snackbar);
    }
    default: {
      return state;
    }
	}
}