import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Select,
  InputNumber,
} from 'antd';


const EditableContext = React.createContext();


@Form.create()
class EditableCell extends React.Component {

    state = {
      toposNode: [
        "税种1",
        "税种2",
        "税种3"
      ]
    }
    renderToposNode = (data) => {
      let ret = [];
      ret = data.map(obj => {
        return (<Select.Option key={obj} value={obj}>{obj}</Select.Option>)
      })
      return ret;
    }
    getInput = () => {
      let handleChange = (value) => {
        console.log(value);
      }
      if (this.props.inputType === 'number') {
        return <InputNumber />;
      }
      else if (this.props.inputType === 'select') {
        const { toposNode } = this.state;
        return (
          <div>
            <Select
              //mode="multiple"
              style={{ width: 120 }}
  
              onBlur={handleChange}
            // onChange={handleChange}
            >
              {this.renderToposNode(toposNode)}
            </Select>
          </div>
        )
      }
      return <Input />;
    };
  
    renderCell = ({ getFieldDecorator }) => {
      const {
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        // form: { getFieldDecorator, getFieldValue },
        children,
        ...restProps
      } = this.props;
  
      return (
        <td {...restProps}>
          {editing ? (
            <Form.Item style={{ margin: 0 }}>
              {getFieldDecorator(dataIndex, {
                rules: [
                  {
                    required: true,
                    message: `请输入 ${title}!`,
                  },
                ],
                initialValue: record[dataIndex],
              })(this.getInput())}
            </Form.Item>
          ) : (
              children
            )}
        </td>
      );
    };
  
    render() {
      return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
    }
  }
  export default EditableCell;