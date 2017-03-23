import React, {PropTypes, Component} from 'react'
import {browserHistory, hashHistory } from 'react-router'
import { Layout, Icon, Row, Col, Upload, message, Button, Spin, Modal, notification} from 'antd';
import {socket} from '../actions'
const { Header, Footer, Sider, Content } = Layout;
const Dragger = Upload.Dragger;

import style from '../css/index.css'

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
								<Button type="primary" onClick={this.props.indexUpdateMore}>点击加载更多</Button>
								:
								<Spin />
          	}
          </Footer>
        </Layout>
      </div>
    )
  }
}

const api = {};
api.EDGE_DETECT_VALUE = 80;
api.POINT_RATE = 0.075;
api.POINT_MAX_NUM = 4500;
api.BLUR_SIZE = 2;
api.EDGE_SIZE = 6;
api.PIXEL_LIMIT = 8000000;
let IMG_PRESETS = "./meizi.jpg"//"./lilac-breasted_roller.jpg";

let blur = (function(size) {
  let matrix = [];
  let side = size * 2 + 1;
  let i, len = side * side;
  for (i = 0; i < len; i++) matrix[i] = 1;
  return matrix;
})(api.BLUR_SIZE);

let edge = (function(size) {
    let matrix = [];
    let side = size * 2 + 1;
    let i, len = side * side;
    let center = len * 0.5 | 0;
    for (i = 0; i < len; i++) matrix[i] = i === center ? -len + 1 : 1;
    return matrix;
})(api.EDGE_SIZE);

var Filter = {

    /**
     * グレイスケールフィルタ, ソース用なので 1 チャンネル (Red) のみに
     */
     //增加灰度灰度；
    grayscaleFilterR: function (imageData) {
        var width  = imageData.width | 0;
        var height = imageData.height | 0;
        var data = imageData.data;

        var x, y;
        var i, step;
        var r, g, b;

        for (y = 0; y < height; y++) {
            step = y * width;

            for (x = 0; x < width; x++) {
                i = (x + step) << 2;
                r = data[i];
                g = data[i + 1];
                b = data[i + 2];

                data[i] = (Math.max(r, g, b) + Math.min(r, g, b)) >> 2;
            }
        }

        return imageData;
    },

    /**
     * 畳み込みフィルタ, ソース用なので 1 チャンネル (Red) のみに
     *
     * @see http://jsdo.it/akm2/iMsL
     */
    convolutionFilterR: function(matrix, imageData, divisor) {
        matrix  = matrix.slice();
        divisor = divisor || 1;

        // 割る数を行列に適用する
        var divscalar = divisor ? 1 / divisor : 0;
        var k, len;
        if (divscalar !== 1) {
            for (k = 0, len = matrix.length; k < matrix.length; k++) {
                matrix[k] *= divscalar;
            }
        }

        var data = imageData.data;

        // 参照用にオリジナルをコピー, グレースケールなので Red チャンネルのみ
        len = data.length >> 2;
        var copy = new Uint8Array(len);
        for (i = 0; i < len; i++) copy[i] = data[i << 2];

        var width  = imageData.width | 0;
        var height = imageData.height | 0;
        var size  = Math.sqrt(matrix.length);
        var range = size * 0.5 | 0;

        var x, y;
        var r, g, b, v;
        var col, row, sx, sy;
        var i, istep, jstep, kstep;

        for (y = 0; y < height; y++) {
            istep = y * width;

            for (x = 0; x < width; x++) {
                r = g = b = 0;

                for (row = -range; row <= range; row++) {
                    sy = y + row;
                    jstep = sy * width;
                    kstep = (row + range) * size;

                    if (sy >= 0 && sy < height) {
                        for (col = -range; col <= range; col++) {
                            sx = x + col;

                            if (
                                sx >= 0 && sx < width &&
                                (v = matrix[(col + range) + kstep]) // 値が 0 ならスキップ
                            ) {
                                r += copy[sx + jstep] * v;
                            }
                        }
                    }
                }

                // 値を挟み込む
                if (r < 0) r = 0; else if (r > 255) r = 255;

                data[(x + istep) << 2] = r & 0xFF;
            }
        }

        return imageData;
    }
};


/**
 * Delaunay
 *
 * @see http://jsdo.it/akm2/wTcC
 */
var Delaunay = (function() {

    /**
     * Node
     *
     * @param {Number} x
     * @param {Number} y
     * @param {Number} id
     */
    function Node(x, y, id) {
        this.x = x;
        this.y = y;
        this.id = !isNaN(id) && isFinite(id) ? id : null;
    }

    Node.prototype = {
        eq: function(p) {
            var dx = this.x - p.x;
            var dy = this.y - p.y;
            return (dx < 0 ? -dx : dx) < 0.0001 && (dy < 0 ? -dy : dy) < 0.0001;
        },

        toString: function() {
            return '(x: ' + this.x + ', y: ' + this.y + ')';
        }
    };

    /**
     * Edge
     *
     * @param {Node} p0
     * @param {Node} p1
     */
    function Edge(p0, p1) {
        this.nodes = [p0, p1];
    }

    Edge.prototype = {
        eq: function(edge) {
            var na = this.nodes,
                nb = edge.nodes;
            var na0 = na[0], na1 = na[1],
                nb0 = nb[0], nb1 = nb[1];
            return (na0.eq(nb0) && na1.eq(nb1)) || (na0.eq(nb1) && na1.eq(nb0));
        }
    };

    /**
     * Triangle
     *
     * @param {Node} p0
     * @param {Node} p1
     * @param {Node} p2
     */
    function Triangle(p0, p1, p2) {
        this.nodes = [p0, p1, p2];
        this.edges = [new Edge(p0, p1), new Edge(p1, p2), new Edge(p2, p0)];

        // 今回は id は使用しない
        this.id = null;

        // この三角形の外接円を作成する

        var circle = this.circle = new Object();

        var ax = p1.x - p0.x, ay = p1.y - p0.y,
            bx = p2.x - p0.x, by = p2.y - p0.y,
            t = (p1.x * p1.x - p0.x * p0.x + p1.y * p1.y - p0.y * p0.y),
            u = (p2.x * p2.x - p0.x * p0.x + p2.y * p2.y - p0.y * p0.y);

        var s = 1 / (2 * (ax * by - ay * bx));

        circle.x = ((p2.y - p0.y) * t + (p0.y - p1.y) * u) * s;
        circle.y = ((p0.x - p2.x) * t + (p1.x - p0.x) * u) * s;

        var dx = p0.x - circle.x;
        var dy = p0.y - circle.y;
        circle.radiusSq = dx * dx + dy * dy;
    }


    /**
     * Delaunay
     *
     * @param {Number} width
     * @param {Number} height
     */
    function Delaunay(width, height) {
        this.width = width;
        this.height = height;

        this._triangles = null;

        this.clear();
    }

    Delaunay.prototype = {

        clear: function() {
            var p0 = new Node(0, 0);
            var p1 = new Node(this.width, 0);
            var p2 = new Node(this.width, this.height);
            var p3 = new Node(0, this.height);

            this._triangles = [
                new Triangle(p0, p1, p2),
                new Triangle(p0, p2, p3)
            ];

            return this;
        },

        insert: function(points) {
            var k, klen, i, ilen, j, jlen;
            var triangles, t, temps, edges, edge, polygon;
            var x, y, circle, dx, dy, distSq;

            for (k = 0, klen = points.length; k < klen; k++) {
                x = points[k][0];
                y = points[k][1];

                triangles = this._triangles;
                temps = [];
                edges = [];

                for (ilen = triangles.length, i = 0; i < ilen; i++) {
                    t = triangles[i];

                    // 座標が三角形の外接円に含まれるか調べる
                    circle  = t.circle;
                    dx = circle.x - x;
                    dy = circle.y - y;
                    distSq = dx * dx + dy * dy;

                    if (distSq < circle.radiusSq) {
                        // 含まれる場合三角形の辺を保存
                        edges.push(t.edges[0], t.edges[1], t.edges[2]);
                    } else {
                        // 含まれない場合は持ち越し
                        temps.push(t);
                    }
                }

                polygon = [];

                // 辺の重複をチェック, 重複する場合は削除する
                edgesLoop: for (ilen = edges.length, i = 0; i < ilen; i++) {
                    edge = edges[i];

                    // 辺を比較して重複していれば削除
                    for (jlen = polygon.length, j = 0; j < jlen; j++) {
                        if (edge.eq(polygon[j])) {
                            polygon.splice(j, 1);
                            continue edgesLoop;
                        }
                    }

                    polygon.push(edge);
                }

                for (ilen = polygon.length, i = 0; i < ilen; i++) {
                    edge = polygon[i];
                    temps.push(new Triangle(edge.nodes[0], edge.nodes[1], new Node(x, y)));
                }

                this._triangles = temps;
            }

            return this;
        },

        getTriangles: function() {
            return this._triangles.slice();
        }
    };

    Delaunay.Node = Node;

    return Delaunay;

})();

function Point(x, y) {
    this.x = x;
    this.y = y;
    this.id = null;
}

Point.prototype = new Delaunay.Node();

function getEdgePoint(imageData) {
    var width  = imageData.width;
    var height = imageData.height;
    var data = imageData.data;

    var E = api.EDGE_DETECT_VALUE; // local copy

    var points = [];
    var x, y, row, col, sx, sy, step, sum, total;

    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            sum = total = 0;

            for (row = -1; row <= 1; row++) {
                sy = y + row;
                step = sy * width;
                if (sy >= 0 && sy < height) {
                    for (col = -1; col <= 1; col++) {
                        sx = x + col;

                        if (sx >= 0 && sx < width) {
                            sum += data[(sx + step) << 2];
                            total++;
                        }
                    }
                }
            }

            if (total) sum /= total;
            if (sum > E) points.push(new Array(x, y));
        }
    }

    return points;
}