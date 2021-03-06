import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Index from '../components/Index'
import {indexUIDisplay, indexUpdateMore, indexGenerateStatus, loadMorePic, pushImgList} from '../actions'

function mapStateToProps(state) {
	return {
		controlUI: state.getIn(['pageState', 'controlUI']),
		updateButton: state.getIn(['pageState', 'updateButton']),
		generateStatus: state.getIn(['pageState', 'generateStatus']),
		userName: state.getIn(['pageState', 'userName']),
		showImages: state.getIn(['pageState', 'showImages']),
		loginSuccess: state.getIn(['pageState', 'loginSuccess'])
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({indexUIDisplay, indexUpdateMore, indexGenerateStatus, loadMorePic, pushImgList}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);