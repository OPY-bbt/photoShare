import React, {PropTypes, Component} from 'react'
import { Link, browserHistory, hashHistory } from 'react-router'
import { Form, Icon, Input, Button, Checkbox, Row, Colm, Modal, Radio, message} from 'antd';

import styles from '../css/sign.css'

const FormItem = Form.Item;

const CollectionCreateForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Create a new collection"
        okText="Create"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form>
          <FormItem label="Username">
            {getFieldDecorator('Username', {
              rules: [{ required: true, message: 'Please input the Username!' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="Password">
            {getFieldDecorator('Password', {
              rules: [{ required: true, message: 'Please input the Password!' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="QQ">
            {getFieldDecorator('QQ', {
              rules: [{ required: true, message: 'Please input the QQ, heihei!' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="Description">
            {getFieldDecorator('description')(<Input type="textarea" />)}
          </FormItem>
          <FormItem className="collection-create-form_last-form-item">
            {getFieldDecorator('sex', {
              initialValue: 'boy',
            })(
              <Radio.Group>
                <Radio value="boy">boy</Radio>
                <Radio value="girl">girl</Radio>
              </Radio.Group>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);

class Sign extends React.Component {
  handleSubmit = (e) => {
    let clickFunc = this.props.clickFunc;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let userName = values.userName;
        let password = values.password;

        clickFunc(userName, password).then((result) => {
          if(result.isError) {
            if(result.isUNErr) {
              //console.log('username is not exist')
              message.error('username is not exist')
            }else if(result.isPWErr) {
              //console.log('password is error');
              message.error('password is error')
            }
          }else {
            //console.log(result.works);
            this.props.pushImgList(result.works);
            message.success('user login success');
            this.props.loginSuccess(userName);
            hashHistory.push('/');
          }
        })
      }
    });
  }
  saveFormRef = (form) => {
    this.form = form;
  }
  handleCreate = () => {
    const form = this.form;
    let signupCancel = this.props.signupCancel;
    let clickFuncSignUp = this.props.clickFuncSignUp;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log('Received values of form: ', values);
      //this.props.signupCancel();

      let userName = values.Username,
          password = values.Password,
          qq = values.QQ,
          des = values.description,
          sex = values.sex;
      clickFuncSignUp(userName, password, qq, des, sex).then((res) => {
        if(res.isError) {
          if(res.userNameUsed) {
            message.error('userName is used')
          }
        }else {
          message.success('signup success')
          form.resetFields();
          signupCancel();
        }
      })
    });
  }
  componentDidMount() {
    const pos1X = 110, pos1Y = 100, 
        pos2X = pos1X + 80, pos2Y = pos1Y, 
        pos3X = pos2X, pos3Y = pos2Y + 80, 
        pos4X = pos1X, pos4Y = pos3Y,
        pos5X = pos1X + 40, pos5Y = pos3Y,
        pos6X = pos1X + 52, pos6Y = pos1Y + 50;

    this.ctx = this.canvas.getContext('2d');
    this.canvasWidth = 300;
    this.canvasHeight = 300;
    
    this.count = 0;
    this.alpha = 0;
    this.path = [];
    this.nearDistance = 20;

    this.pos1X = pos1X
    this.pos2X = pos2X
    this.pos3X = pos3X
    this.pos4X = pos4X
    this.pos5X = pos5X
    this.pos6X = pos6X
    this.pos1Y = pos1Y
    this.pos2Y = pos2Y
    this.pos3Y = pos3Y
    this.pos4Y = pos4Y
    this.pos5Y = pos5Y
    this.pos6Y = pos6Y

    this.generatePath(pos1X, pos1Y, pos2X, pos2Y);
    this.generatePath(pos2X, pos2Y, pos3X, pos3Y);
    this.generatePath(pos3X, pos3Y, pos4X, pos4Y);
    this.generatePath(pos4X, pos4Y, pos1X, pos1Y);
    this.generatePath(pos1X, pos1Y, pos3X+2, pos3Y+2);
    this.generatePath(pos2X+2, pos2Y-4, pos5X, pos5Y+2);

    this.ctx.lineWidth = 6;

    //cache rect
    this.cacheRect(pos1X, pos1Y, pos2X, pos2Y, pos3X, pos3Y, pos4X, pos4Y, pos5X, pos5Y);

    this.cacheTri1(pos1X, pos1Y, pos6X, pos6Y, pos5X, pos5Y, pos4X, pos4Y);

    this.cacheTri2(pos2X, pos2Y, pos6X, pos6Y, pos3X, pos3Y);

    this.cacheTri3(pos5X, pos5Y, pos3X, pos3Y, pos6X, pos6Y);

    this.cacheLogo();
    ///console.log(this.updater);
    requestAnimationFrame(this._updater);
  }
  _updater = () => {
    let ctx = this.ctx;
    let path = this.path;
    if(this.count < path.length - 4) {
      ctx.beginPath();
      ctx.lineCap="round";
      ctx.moveTo(path[this.count][0], path[this.count][1]);
      ctx.lineTo(path[this.count+4][0], path[this.count+4][1]);
      ctx.stroke();

      this.count < 10 && (this.drawFillTriangle(this.pos1X-3, this.pos1Y-3, this.pos1X-3, this.pos1Y+3, this.pos1X+8, this.pos1Y+3, '#FFF', ctx));
    }else {
      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      ctx.drawImage(this.canvasCacheRect, 0, 0);

      ctx.save();
      ctx.globalAlpha = this.alpha;

      ctx.drawImage(this.canvasCacheTri2, this.nearDistance, 0);
      ctx.drawImage(this.canvasCacheTri1, -this.nearDistance, 0);
      ctx.drawImage(this.canvasCacheTri3, 0, this.nearDistance);

      this.nearDistance > 0 && this.nearDistance--;

      ctx.drawImage(this.imgLogo, (this.canvasWidth - 90) / 2, this.pos3Y + 20, 90, this.imgLogo.height);
      ctx.restore();

      ctx.drawImage(this.canvasCacheRect, 0, 0);
    }
    this.count+=4;
    
    if(this.alpha < 1) {
      this.alpha+=0.005;

      requestAnimationFrame(this._updater);
    }
  }
  drawFillTriangle(x1, y1, x2, y2, x3, y3, color, ctx) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x1, y1);
    ctx.fillStyle = color;
    ctx.fill();
  }

  drawFillFourPoly(x1, y1, x2, y2, x3, y3, x4, y4, color, ctx) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.lineTo(x1, y1);
    ctx.fillStyle = color;
    ctx.fill();
  }
  generatePath(x1, y1, x2, y2) {
    if(x2 == x1) {
      if(y2 - y1 >= 0) {
        for(var i = 0, len = y2 - y1; i < len; i++) {
          this.path.push([x1, y1 + i]);
        }
      }else{
        for(var i = 0, len = y1 - y2; i < len; i++) {
          this.path.push([x1, y1 - i]);
        }
      }
    }else {
      var k = (y2 - y1) / (x2 - x1);
      var b = y2 - x2 * k;
      if(x2 - x1 >= 0) {
        for(var i = 0, len = x2 - x1; i < len; i++) {
          this.path.push([x1 + i, k * (x1 + i) + b])
        }
      }else {
        for(var i = 0, len = x1 - x2; i < len; i++) {
          this.path.push([x1 - i, k * (x1 - i) + b])
        }
      }
    } 
  }
  cacheRect(pos1X, pos1Y, pos2X, pos2Y, pos3X, pos3Y, pos4X, pos4Y, pos5X, pos5Y) {
      this.canvasCacheRect = document.createElement('canvas');
      let canvasCacheRect = this.canvasCacheRect;
      canvasCacheRect.width = this.canvasWidth;
      canvasCacheRect.height = this.canvasHeight;
      let canvasCacheRectCtx = canvasCacheRect.getContext('2d');

      canvasCacheRectCtx.beginPath();
      canvasCacheRectCtx.lineWidth = 6;
      canvasCacheRectCtx.moveTo(pos1X, pos1Y);
      canvasCacheRectCtx.lineTo(pos2X, pos2Y);
      canvasCacheRectCtx.lineTo(pos3X, pos3Y);
      canvasCacheRectCtx.lineTo(pos4X, pos4Y);
      canvasCacheRectCtx.lineTo(pos1X, pos1Y-3);
      //canvasCacheRectCtx.lineTo(pos3X, pos3Y);
      canvasCacheRectCtx.stroke();

      canvasCacheRectCtx.beginPath();
      canvasCacheRectCtx.moveTo(pos1X, pos1Y);
      canvasCacheRectCtx.lineTo(pos3X, pos3Y);
      canvasCacheRectCtx.stroke();

      canvasCacheRectCtx.beginPath();
      canvasCacheRectCtx.moveTo(pos2X, pos2Y);
      canvasCacheRectCtx.lineTo(pos5X, pos5Y);
      canvasCacheRectCtx.stroke();
    }

  cacheTri1(pos1X, pos1Y, pos6X, pos6Y, pos5X, pos5Y, pos4X, pos4Y) {
    this.canvasCacheTri1 = document.createElement('canvas');
    let canvasCacheTri1 = this.canvasCacheTri1;
    canvasCacheTri1.width = this.canvasWidth;
    canvasCacheTri1.height = this.canvasHeight;
    let canvasCacheTri1Ctx = canvasCacheTri1.getContext('2d');

    this.drawFillFourPoly(pos1X, pos1Y, pos6X, pos6Y, pos5X, pos5Y, pos4X, pos4Y, "#008B92",canvasCacheTri1Ctx)
  }

  cacheTri2(pos2X, pos2Y, pos6X, pos6Y, pos3X, pos3Y) {
    this.canvasCacheTri2 = document.createElement('canvas');
    let canvasCacheTri2 = this.canvasCacheTri2;
    canvasCacheTri2.width = this.canvasWidth;
    canvasCacheTri2.height = this.canvasHeight;
    let canvasCacheTri2Ctx = canvasCacheTri2.getContext('2d');

    this.drawFillTriangle(pos2X, pos2Y, pos6X, pos6Y, pos3X, pos3Y, "#EB3251",canvasCacheTri2Ctx)
  }

  cacheTri3(pos5X, pos5Y, pos3X, pos3Y, pos6X, pos6Y) {
    this.canvasCacheTri3 = document.createElement('canvas');
    let canvasCacheTri3 = this.canvasCacheTri3;
    canvasCacheTri3.width = this.canvasWidth;
    canvasCacheTri3.height = this.canvasHeight;
    let canvasCacheTri3Ctx = canvasCacheTri3.getContext('2d');

    this.drawFillTriangle(pos5X, pos5Y, pos3X, pos3Y, pos6X, pos6Y, "#FCBC16",canvasCacheTri3Ctx)
  }

  cacheLogo() {
    this.imgLogo = new Image();
    this.imgLogo.src = 'logoText.png';
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    //console.log(this.props.visible)
    return (
    	<div id="sign-wrap" className={styles.wrap}>
        <canvas width="300" height="300" ref = {(canvas) => {this.canvas = canvas}}></canvas>
				<Form onSubmit={this.handleSubmit} className="login-form">
				  <FormItem>
				    {getFieldDecorator('userName', {
				      rules: [{ required: true, message: 'Please input your username!' }],
				    })(
				      <Input addonBefore={<Icon type="user" />} placeholder="Username" />
				    )}
				  </FormItem>
				  <FormItem>
				    {getFieldDecorator('password', {
				      rules: [{ required: true, message: 'Please input your Password!' }],
				    })(
				      <Input addonBefore={<Icon type="lock" />} type="password" placeholder="Password" />
				    )}
				  </FormItem>
				  <FormItem>
				    {getFieldDecorator('remember', {
				      valuePropName: 'checked',
				      initialValue: true,
				    })(
				      <Checkbox>Remember me</Checkbox>
				    )}
				    <Button 
              type="primary" 
              htmlType="submit" 
              className="login-form-button"
            >
				      {this.props.btnText}
				    </Button>
				    Or <a onClick={this.props.signupShow}> {this.props.linkText}  &nbsp;&nbsp;</a>
				  </FormItem>
				</Form>
				<CollectionCreateForm
					ref={this.saveFormRef}
          visible={this.props.visible}
          onCancel={this.props.signupCancel}
          onCreate={this.handleCreate}
        />
    	</div>
    );
  }
}

const WrappedSign = Form.create()(Sign);

export default WrappedSign