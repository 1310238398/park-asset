import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Cascader, Radio } from 'antd';
import { contractPlanList } from '@/services/contractSiging';
import { contractCList } from '@/services/contractSiging';

const sep = '/';
function parseValue(value) {
  return value ? value.split(sep) : [];
}
@connect(state => ({
  contractSiging: state.contractSiging,
}))
export class ContractPlanningSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: parseValue(props.value),
      children: [],
      items: [],
      options: [],
    };
  }

  componentDidMount() {
    const { proID } = this.props;
    contractPlanList({
      q: 'contract',
      project_id: proID,
    }).then(data => {
      const { list } = data;
      const lis = this.toPlanningSelect(list);
      this.setState({ options: lis });
    });
  }

  toPlanningSelect = data => {
    if (!data) {
      return [];
    }
    const newData = [];
    for (let i = 0; i < data.length; i += 1) {
      const item = { ...data[i], label: data[i].name, value: data[i].cost_id, isLeaf: false };
      if (item.children && item.children.length > 0) {
        item.children = this.toPlanningSelect(item.children);
      }
      newData.push(item);
    }
    return newData;
  };

  static getDerivedStateFromProps(nextProps, state) {
    if ('value' in nextProps) {
      return { ...state, value: parseValue(nextProps.value) };
    }
    return state;
  }

  handleChange = (value, item) => {
    this.setState({ value });
    const items = item ? item[item.length - 1] : [];
    this.triggerChange(value, items);
  };

  triggerChange = (data, item) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(data.join(sep), item);
    }
  };

  getList = value => {
    const childrenList = [];
    const { proID } = this.props;
    contractCList({
      q: 'list',
      project_id: proID,
      cost_id: value,
    }).then(data => {
      const { list } = data;
      for (let i = 0; i < list.length; i += 1) {
        const item = {
          ...list[i],
          label: list[i].name,
          value: list[i].cost_id,
        };
        childrenList.push(item);
      }
      this.setState({ children: childrenList });
    });
  };

  loadData = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    this.getList(targetOption.cost_id);
    // load options lazily
    setTimeout(() => {
      const { children, options } = this.state;
      targetOption.loading = false;
      const tarChildren = [];
      for (let j = 0; j < children.length; j += 1) {
        const item = { ...children[j], label: `${children[j].name}`, value: children[j].cost_id };
        tarChildren.push(item);
      }
      targetOption.children = tarChildren;
      this.setState({
        options: [...options],
      });
    }, 1000);
  };


  render() {
    let { options, value } = this.state;
    const {dataPro} = this.props;
    return (
      <div>
        <Cascader
          value={value}
          options={options}
          loadData={this.loadData}
          onChange={this.handleChange}
          style={{ width: '100%' }}
        />
      </div>
    );
  }
}

export default ContractPlanningSelect;
