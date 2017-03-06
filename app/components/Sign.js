import React, {PropTypes, Component} from 'react'
import { Link, browserHistory } from 'react-router'
import { Form, Icon, Input, Button, Checkbox, Row, Col} from 'antd';

import styles from '../css/sign.css'

const FormItem = Form.Item;

class Sign extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
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
				    <a className="login-form-forgot">Forgot password</a>
				    <Button type="primary" htmlType="submit" className="login-form-button">
				      Log in
				    </Button>
				    Or <a>register now!</a>
				  </FormItem>
				</Form>
    	</div>
    );
  }
}

const WrappedSign = Form.create()(Sign);

export default WrappedSign