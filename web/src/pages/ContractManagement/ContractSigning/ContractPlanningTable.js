
import React, { PureComponent } from 'react';

import { Table, Input, Button, Popconfirm, Form } from 'antd';
import { EditableCell, EditableFormRow } from './PlanningEditableCell';

class ContractPlanningTable extends PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '科目名称',
        dataIndex: 'kmmc',
        width: 150,
      },
      {
        title: '合约规划名称',
        dataIndex: 'hyghmc',
        width: 150,
      },
      {
        title: '合同名称',
        dataIndex: 'htmc',
        width: 150,
      },
      {
        title: '合同预估金额',
        dataIndex: 'ygje',
        width: 150,
      },
      {
        title: '合同预估变更金额',
        dataIndex: 'bgje',
        width: 180,
      },
      {
        title: '合同签订金额',
        dataIndex: 'amount_signed',
        width: 150,
        editable: true,
      },
      {
        title: '余额',
        dataIndex: 'ye',
        width: 150,
        render: (row, record) => {
          const dataSource = [...this.state.dataSource];
          dataSource.map(item => {
            if (item.amount_signed) {
              item.ye = item.ygje - item.amount_signed;
            }
          });
          return record.ye;
        },
      },
      {
        title: '余额处理方式',
        dataIndex: 'method',
        width: 150,
      },
      {
        title: '操作',
        dataIndex: '',
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm title="确定引用" onConfirm={() => this.handleQuote(record.id)}>
              <a>引用</a>
            </Popconfirm>
          ) : null,
      },
    ];

    this.state = {
      dataSource: [
        {
          id: '1',
          kmmc: '0',
          hyghmc: 'Edward King 0',
          htmc: '这是一个合同名称0',
          ygje: 20,
          bgje: 10,
          amount_signed: null,
          ye: null,
          method: 'London, Park Lane no. 0',
        },
        {
          id: '2',
          kmmc: '1',
          hyghmc: 'Edward King 1',
          htmc: '这是一个合同名称1',
          ygje: 30,
          bgje: 20,
          amount_signed: null,
          ye: null,
          method: 'London, Park Lane no.1',
        },
      ],
    };
  }

  handleQuote = id => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.id !== id) });
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
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
        <Table components={components} bordered dataSource={dataSource} columns={columns} />
      </div>
    );
  }
}

export default ContractPlanningTable;
