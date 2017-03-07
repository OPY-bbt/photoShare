import React, {PropTypes, Component} from 'react'
import { Link, browserHistory } from 'react-router'
import { Form, Icon, Input, Button, Checkbox, Row, Colm, Modal, Radio} from 'antd';

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
          <FormItem label="Title">
            {getFieldDecorator('title', {
              rules: [{ required: true, message: 'Please input the title of collection!' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="Description">
            {getFieldDecorator('description')(<Input type="textarea" />)}
          </FormItem>
          <FormItem className="collection-create-form_last-form-item">
            {getFieldDecorator('modifier', {
              initialValue: 'public',
            })(
              <Radio.Group>
                <Radio value="public">Public</Radio>
                <Radio value="private">Private</Radio>
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
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  saveFormRef = (form) => {
    this.form = form;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    console.log(this.props.visible)
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
				    <Button type="primary" htmlType="submit" className="login-form-button">
				      {this.props.btnText}
				    </Button>
				    Or <a onClick={this.props.signupShow}> {this.props.linkText}  &nbsp;&nbsp;</a>
				  </FormItem>
				</Form>
				<CollectionCreateForm
					//ref={this.saveFormRef}
          visible={this.props.visible}
          //onCancel={this.handleCancel}
          //onCreate={this.handleCreate}
        />
    	</div>
    );
  }
}

const WrappedSign = Form.create()(Sign);

export default WrappedSign