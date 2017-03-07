import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Sign from '../components/Sign'
import { setSnackbarState,  signupShow, signupCreate, signupCancel} from '../actions'
function mapStateToProps(state) {
		//console.log('state', state.getIn(['pageState', 'visible']));
    return {
    	visible: state.getIn(['pageState', 'visible'])
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({setSnackbarState, signupShow, signupCreate, signupCancel}, dispatch);
}
export default connect(mapStateToProps,mapDispatchToProps)(Sign);