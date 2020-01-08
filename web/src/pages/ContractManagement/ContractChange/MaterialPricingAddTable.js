import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Input, Button, Popconfirm, Form, InputNumber } from 'antd';
import * as styles from './ContractChange.less';
import { newUUID } from '@/utils/utils';
import { EditableCell, EditableFormRow } from './EditableCell';

function fillKey(data) {
  if (!data) {
    return [];
  }
  return data.map(item => {
    const nitem = { ...item };
    if (!nitem.key) {
      nitem.key = newUUID();
    }
    return nitem;
  });
}

class MaterialPricingAddTable extends PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '操作',
        dataIndex: 'key',
        width: 100,
        fixed: 'left',
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record.key)}>
              <a>删除</a>
            </Popconfirm>
          ) : null,
      },

      {
        title: '名称',
        dataIndex: 'name',
        editable: true,
        width: 250,
      },
      {
        title: '规格型号',
        dataIndex: 'specification',
        editable: true,
      },
      {
        title: '单位',
        dataIndex: 'unit',
        editable: true,
      },
      {
        title: '估量',
        dataIndex: 'count',
        editable: true,
      },
      {
        title: '施工单位报价',
        dataIndex: 'quote_w',
        editable: true,
      },
      {
        title: '建设单位批价',
        dataIndex: 'quote_c',
        editable: true,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        editable: true,
      },
    ];
    this.state = {
      dataSource:fillKey(props.value),
    };
  }

  static getDerivedStateFromProps(nextProps, state) {
    if ('value' in nextProps) {
      return {
        ...state,
        dataSource: fillKey(nextProps.value),
      };
    }
    return state;
  }

  // 删除
  handleDelete = key => {
    const { dataSource } = this.state;
    const data = dataSource.filter(item => item.key !== key);
    this.setState({ dataSource: data }, () => {
      this.triggerChange(data);
    });
  };

  // 添加
  handleAdd = () => {
    const { dataSource } = this.state;
    const item = {
      key: newUUID(),
      name: ``,
      specification: ``,
      unit: ``,
      count: ``,
      quote_w: ``,
      quote_c: ``,
    };
    const data = [...dataSource, item];
    this.setState(
      {
        dataSource: data,
      },
      () => {
        this.triggerChange(data);
      }
    );
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData }, () => {
      this.triggerChange(newData);
    });
  };

  triggerChange = data => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(data);
    }
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
          添加
        </Button>
        <Table
          components={components}
          bordered
          rowKey={record => record.key}
          rowClassName={styles.editableRow}
          pagination={false}
          dataSource={dataSource}
          columns={columns}
          size="small"
          scroll={{ x: 1100, y: 240 }}
        />
      </div>
    );
  }
}

export default MaterialPricingAddTable;
