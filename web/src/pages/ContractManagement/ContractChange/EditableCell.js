import React, { PureComponent } from 'react';
import { Input, Form, InputNumber} from 'antd';
import * as styles from './ContractChange.less';
const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

export const EditableFormRow = Form.create()(EditableRow);

export class EditableCell extends PureComponent {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };
  save = () => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    if (dataIndex === 'quote_c' || dataIndex === 'quote_w' || dataIndex === 'count') {
      return editing ? (
        <Form.Item style={{ margin: 0 }}>
          {form.getFieldDecorator(dataIndex, {
            rules: [
              {
                required: false,
                message: `${title} is required.`,
              },
            ],
            initialValue: record[dataIndex],
          })(
            <InputNumber
              ref={node => (this.input = node)}
              onPressEnter={this.save}
              onBlur={this.save}
            />
          )}
        </Form.Item>
      ) : (
        <div className={styles.editable} style={{ paddingRight: 24 }} onClick={this.toggleEdit}>
          {children}
        </div>
      );
    } else if (dataIndex === 'remark') {
      return editing ? (
        <Form.Item style={{ margin: 0 }}>
          {form.getFieldDecorator(dataIndex, {
            rules: [
              {
                required: false,
                message: `${title} is required.`,
              },
            ],
            initialValue: record[dataIndex],
          })(
            <Input.TextArea
              ref={node => (this.input = node)}
              onPressEnter={this.save}
              onBlur={this.save}
            />
          )}
        </Form.Item>
      ) : (
        <div className={styles.editable} style={{ paddingRight: 24 }} onClick={this.toggleEdit}>
          {children}
        </div>
      );
    } else {
      return editing ? (
        <Form.Item style={{ margin: 0 }}>
          {form.getFieldDecorator(dataIndex, {
            rules: [
              {
                required: false,
                message: `${title} is required.`,
              },
            ],
            initialValue: record[dataIndex],
          })(
            <Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />
          )}
        </Form.Item>
      ) : (
        <div className={styles.editable} style={{ paddingRight: 24 }} onClick={this.toggleEdit}>
          {children}
        </div>
      );
    }
  };

  render() {
    const { editable, dataIndex, title, record, index,children, handleSave, ...restProps} = this.props;
    const { editing } = this.state;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}
