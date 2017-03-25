import React, {PropTypes, Component} from 'react'
import {browserHistory, hashHistory } from 'react-router'
import { Layout, Icon, Row, Col, Upload, message, Button, Spin, Modal, notification} from 'antd';
import {socket, loadMorePic} from '../actions'
const { Header, Footer, Sider, Content } = Layout;
const Dragger = Upload.Dragger;

import style from '../css/index.css'
import { Filter, Delaunay, getEdgePoint, api, blur, edge } from './Delaunay'

function info() {
  Modal.info({
    title: 'Login please',
    content: (
      <div>
        <p>sorry, who are you?</p>
      </div>
    ),
    onOk() {
			hashHistory.push('/')
    }
  });
}

const openNotification = (userName, imgUrl) => {
  notification.open({
    message: userName,
    description: 'this is work description',
  	icon: <img src={imgUrl} width="32px" height="32px" />
  });
};

socket.on('someoneuploadPic', function(data) {
	console.log('someoneuploadPic', data);
	//store.dispatch(showUploadPicMessage(data.userName, data.imgUrl));
	openNotification(data.userName, data.imgUrl);
})

export default class Index extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {

    this.generating = false;
    //this.frist = true;

    if(!this.props.loginSuccess) {
      hashHistory.push('/login')
    }

    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    //console.log(this.wrap.scrollHeight);
    this.source = new Image();
    this.source.addEventListener('load', this.sourceLoadComplete, false);
    //this.setSource(IMG_PRESETS);

    this.timer = null;
  }
  uploadEvent = (e) => {
    e.stopPropagation();
    this.fileInput.click();
  }
  fileSelected = (e) => {
  	this.frist = false;

    console.log('file selected');

    if(!(window.File || window.FileReader || window.FileList || window.Blob)) {
      alert('换个chrome浏览器试试')
      return;
    }

    var file = e.target.files[0];
    this.readFileContent(file);
  }
  readFileContent = (file) => {
    if(file == null || file.type.indexOf('image') == -1) {
      alert('请选择图片哦');
      return;
    }

    if(this.props.controlUI) {
    	this.props.indexUIDisplay();
    }

    this.generating = true;
    //this.setState({"generating": true});
    this.props.indexGenerateStatus();

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', (e) => {
      //console.log('setSource', e.target.result);
      var res = e.target.result;
      this.setSource(res);
    })
  }
  dropFile = (e) => {
    e.preventDefault();
    if(this.generating) {
      console.log('already generateing...')
      return;
    }
    this.readFileContent(e.dataTransfer.files[0]);
  }
  imgLoad = () => {
    //this.adjustImg();
  }
  adjustImg() {
    this.outImage.removeAttribute('width');
    this.outImage.removeAttribute('height');
    let width = this.outImage.width;
    let height = this.outImage.height;

    let wrapWidth = this.wrap.scrollWidth;
    let wrapHeight = 500;
//console.log(wrapWidth, wrapHeight)
    if(width > wrapWidth || height > wrapHeight) {
      let scale = Math.min(wrapWidth/width, wrapHeight/height);
      this.outImage.width = width * scale | 0;
      this.outImage.height = height * scale | 0;
    }
  }
  setSource(src) {
    if(this.source.src !== src) {
      this.source.removeAttribute('width');
      this.source.removeAttribute('height');
      this.source.src = src;
    }else {
      console.log('image no change');
    }
  }
  sourceLoadComplete = () => {
    let width = this.source.width;
    let height = this.source.height;
    let pixelNum = width * height;
    if(pixelNum > api.PIXEL_LIMIT) {
      let scale = Math.sqrt(api.PIXEL_LIMIT / pixelNum);
      this.source.width = width * scale | 0;
      this.source.height = height * scale | 0;
    }

    this.timer && clearTimeout(this.timer);
    console.log('Generate start...');
    this.timer = setTimeout(this.generate, 0);
  }
  generate = ()=>{
    let context = this.ctx;
    let width = this.canvas.width = this.source.width;
    let height = this.canvas.height = this.source.height;

    context.drawImage(this.source, 0, 0, width, height);

    let imageData = context.getImageData(0, 0, width, height);
    let colorData = context.getImageData(0, 0, width, height).data;

    Filter.grayscaleFilterR(imageData);
    Filter.convolutionFilterR(blur, imageData, blur.length);
    Filter.convolutionFilterR(edge, imageData);

    let temp = getEdgePoint(imageData);
    let detectionNum = temp.length;

    let points = [];
    let i = 0, ilen = temp.length;
    let tlen = ilen;
    let j, limit = Math.round(ilen * api.POINT_RATE);
    if(limit > api.POINT_MAX_NUM) limit = api.POINT_MAX_NUM;

    while(i < limit && i < ilen) {
      j = tlen * Math.random() | 0;
      points.push(temp[j]);
      temp.splice(j, 1);
      tlen--;
      i++
    }

    let delaunay = new Delaunay(width, height);
    let triangles = delaunay.insert(points).getTriangles();

    let t, p0, p1, p2, cx, cy;

    for(ilen = triangles.length, i = 0; i < ilen; i++) {
      t = triangles[i];
      p0 = t.nodes[0]; p1 = t.nodes[1]; p2 = t.nodes[2];

      context.beginPath();
      context.moveTo(p0.x, p0.y);
      context.lineTo(p1.x, p1.y);
      context.lineTo(p2.x, p2.y);
      context.lineTo(p0.x, p0.y);

      cx = (p0.x + p1.x + p2.x) * 0.33333;
      cy = (p0.y + p1.y + p2.y) * 0.33333;

      j = ((cx | 0) + (cy | 0) * width) << 2;

      context.fillStyle = 'rgb(' + colorData[j] + ', ' + colorData[j + 1] + ', ' + colorData[j + 2] + ')';
      context.fill();
    }
    //context.putImageData(imageData,0,0);

    this.generating = false;
  	//this.setState({'generating': false});
  	this.props.indexGenerateStatus();
  	let res = this.canvas.toDataURL('image/png')
  	this.outImage.src = res;

  	this.props.uploadPic(res, this.props.userName).then((result) => {
  		console.log(result);
  		if(result.isError && !result.isUserExist) {
  			info();
  		}
  	});

  	this.adjustImg();
   
    console.log('Generate end...');
  }
  preventDefault = (e) => {
    e.preventDefault();
  }
  getMorePic = () => {
    this.props.indexUpdateMore();

    loadMorePic().then((info) => {
      console.log(info, 'getMorePic')
      this.props.pushImgList(info)  
      this.props.indexUpdateMore();
    })
  }
  render() {
    let uiBool = this.props.controlUI;
    let updateButton = this.props.updateButton;
    //console.log(this.state.generating)
    //console.log(this.props.showImages.toArray());
    let imageArray = this.props.showImages.toArray();
    //console.log(imageArray)
    return (
      <div>
        <input style={{display: 'none'}} type="file" name="uploadPic" ref={(input) => { this.fileInput = input; }} onChange={this.fileSelected}/>
        <Layout>
          <Header>
            <div style={{fontSize: "30px"}}>
              <Icon type="smile-o" /><span style={{fontSize: "20px"}}> 欢迎 {this.props.userName}</span>
            </div>
          </Header>
          <Content>
            <div style={{marginTop: "50px"}}>
              <Row>
                <Col span={20} offset={2}>
                  {
                    uiBool ? 
                      <div 
                        className="ant-upload ant-upload-drag" 
                        onClick={this.uploadEvent} 
                        ref={(div)=>{this.wrap = div; }} 
                        onDrop={this.dropFile} 
                        onDragOver={this.preventDefault} 
                        onDragEnter={this.preventDefault} 
                        onDragLeave={this.preventDefault}
                      >
                        <p className="ant-upload-drag-icon">
                          <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
                      </div>
                    :
                    <Spin spinning={!this.props.generateStatus}>
                      <div 
                        className="ant-upload ant-upload-drag" 
                        onClick={this.uploadEvent} 
                        ref={(div)=>{this.wrap = div; }} 
                        onDrop={this.dropFile} 
                        onDragOver={this.preventDefault} 
                        onDragEnter={this.preventDefault} 
                        onDragLeave={this.preventDefault}
                      >
                        <img id="output" src="" alt="" ref={(img)=>{this.outImage = img}} onLoad={this.imgLoad} />
                      </div>
                    </Spin>
                  }
                </Col>
              </Row>
            </div>
            <div style={{textAlign: "center", height: "50px", lineHeight: "50px", marginTop: "50px", backgroundColor: 'white', border: '1px sliver solid'}}>
              全部的图片
            </div>
            <div className={style.main}>
              {
                imageArray.map((imgSrc, index) => 
                  <div className={style.box} key={index}>
                    <div className={style.img}>
                      <img src={imgSrc} />
                    </div>
                  </div>
                )
              }
            </div>
          </Content>
          <Footer>
          	{
							updateButton ? 
								<Button type="primary" onClick={this.getMorePic}>点击加载更多</Button>
								:
								<Spin />
          	}
          </Footer>
        </Layout>
      </div>
    )
  }
}