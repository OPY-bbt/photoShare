import React, {PropTypes, Component} from 'react'
import { Link } from 'react-router'
import Index from '../../containers/Index'
import { uploadPic } from '../../actions'

export default class Index_page extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Index 
          uploadPic = {uploadPic}
        />
      </div>
    )
  }
}