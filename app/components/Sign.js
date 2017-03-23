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
  render() {
    const { getFieldDecorator } = this.props.form;
    //console.log(this.props.visible)
    return (
    	<div id="sign-wrap" className={styles.wrap}>
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