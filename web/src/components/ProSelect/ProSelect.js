import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { query,get } from '../../services/projectManage';

export default class ProSelect extends PureComponent {
  static defaultProps = {
    style: {},
    onChange: () => {},
  };

  static propTypes = {
    // 样式对象
    style: PropTypes.object,
    // 事件
    onChange: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
      data: [],
    };
  }

  componentDidMount() {
    const { type } = this.props;
    // if (type === 'get') {
    //   this.getUser(this.props.value);
    // }
    this.fetch('');
  }

  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({ value: nextProps.value });
    }
  }

  getUser = value => {
    const users = value.join('&id=');
    if (users) {
      get({ users }).then(data => {
        const tmp = this.state.data;
        this.setState({
          data: [...tmp, ...data.list],
        });
      });
    }
  };

  fetch = name => {
    query({ q: 'list', name }).then(data => {
      if (data) {
        this.setState({ data: data.list });
      } else {
        this.setState({ data });
      }
    });
  };

  handleSearch = value => {
    this.fetch(value);
  };

  handleChange = value => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  onSelect = (value, option) => {
    if (this.props.callback) {
      this.props.callback(value, 'ok', option);
    }
  };

  render() {
    const { style, disabled } = this.props;
    const { mode } = this.props;
    return (
      <Select
        mode={mode}
        disabled={disabled}
        allowClear
        showSearch
        value={this.state.value}
        placeholder="输入名称(模糊匹配)"
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        onSelect={this.onSelect}
        notFoundContent={null}
        style={style}
      >
        {this.state.data &&
          this.state.data.map(v => {
            return (
              <Select.Option  value={v.name} data={v}>
                {v.name}
              </Select.Option>
            );
          })}
      </Select>
    );
  }
}
