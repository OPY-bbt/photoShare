import Immutable from 'immutable'

import {
  SIGNUP_SHOW,
  SIGNUP_CREATE,
  SIGNUP_CANCEL,
  LOGIN_SUCCESS,
  INDEX_UIDISPLAY,
  INDEX_UPDATEMORE,
  INDEX_GENERATESTATUS,
  SHOWUPLOADPICMESSAGE
} from '../actions'

let defaultState = {
  visible: false,
  controlUI: true,
  updateButton: true,
  generateStatus: true,
  loginSuccess: false,
  userName: null,
  showMessage: false
}
defaultState = Immutable.fromJS(defaultState);
export default function pageState(state = defaultState, action) {
	switch (action.type) {
    case SIGNUP_SHOW:
    case SIGNUP_CANCEL:
    case SIGNUP_CREATE:{
      let visible = state.get('visible');
      return state.set('visible', !visible);
    }
    case INDEX_UIDISPLAY:{
      let controlUI = state.get('controlUI');
      return state.set('controlUI', !controlUI);
    }
    case INDEX_UPDATEMORE:{
      let updateButton = state.get('updateButton');
      return state.set('updateButton', !updateButton);
    }
    case INDEX_GENERATESTATUS: {
      let generateStatus = state.get('generateStatus');
      return state.set('generateStatus', !generateStatus);
    }
    case LOGIN_SUCCESS: {
      let res = Immutable.fromJS({'loginSuccess': action.loginSuccess, 'userName': action.userName})
      return state.mergeDeep(res);
    }
    case SHOWUPLOADPICMESSAGE: {
      let showMessage = state.get('showMessage');
      return state.set('showMessage', !showMessage);
    }
    default: {
      return state;
    }
	}
}