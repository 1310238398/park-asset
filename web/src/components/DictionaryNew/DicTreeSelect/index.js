import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TreeSelect } from 'antd';
import { queryTree } from '../../../services/dictionary';

export default class DicTreeSelect extends Component {
  static propTypes = {
    // 指定列表访问编码
    pcode: PropTypes.string.isRequired,
    // 字典code值类型是否是数值类型,
    vmode: PropTypes.oneOf(['string', 'float', 'int', 'bool']),
    level: PropTypes.number,
    // 部分显示字典项
    code: PropTypes.array,
    selectProps: PropTypes.object,
  };

  static defaultProps = {
    vmode: 'string',
    code: [],
    level: 0,
    selectProps: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };

    const { pcode, level, value } = this.props;
    const data = this.loadData();
    if (data) {
      this.state.data = this.vfilter(data);
      this.state.value = value;
      return;
    }
    queryTree({ q: 'tree', parent_code: pcode, level }).then(rdata => {
      this.save(rdata);
      this.updateValue(rdata);
    });
  }

  shouldComponentUpdate(nextProps) {
    if ('value' in nextProps) {
      if (nextProps.value !== this.props.value) {
        let old = '';
        if (nextProps.value && Array.isArray(nextProps.value)) {
          old = nextProps.value.join(',,');
        } else {
          old = nextProps.value;
        }
        let nv = '';
        if (this.props.value && Array.isArray(this.props.value)) {
          nv = this.props.value.join(',,');
        } else {
          nv = this.props.value;
        }
        if (old !== nv) {
          this.value = nextProps.value;
        }
      }
    }
    return true;
  }

  vfilter = sdata => {
    const { code, vmode } = this.props;
    const vdata = sdata.filter(item => {
      return code && code.length > 0 ? code.some(v => v === item.code) : true;
    });
    const v2 = v => {
      if (vmode === 'float') {
        return parseFloat(v);
      }
      if (vmode === 'int') {
        return parseFloat(v);
      }
      if (vmode === 'bool') {
        return v ? 'true' : 'false';
      }
      return v;
    };
    return vdata.map(item => {
      const out = { ...item, value: v2(item.code) };
      return out;
    });
  };

  updateValue = sdata => {
    this.setState({ data: this.vfilter(sdata) });
  };

  fetch = () => {
    const { pcode, level } = this.props;
    const data = this.loadData();
    if (data) {
      this.updateValue(data);
      return;
    }
    queryTree({ q: 'tree', parent_code: pcode, level }).then(rdata => {
      this.save(rdata);
      this.updateValue(rdata);
    });
  };

  loadData = () => {
    const { pcode, level } = this.props;
    return JSON.parse(window.sessionStorage.getItem(`dictree|${level}|${pcode}`));
  };

  save = data => {
    const { pcode, level } = this.props;
    window.sessionStorage.setItem(`dicselect|${level}|${pcode}`, JSON.stringify(data));
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

  v2i = v => {
    return parseInt(v, 10);
  };

  render() {
    const { selectProps } = this.props;

    delete (selectProps, 'onChange');
    delete (selectProps, 'value');
    delete (selectProps, 'treeData');

    const sprops = {
      allowClear: true,
      style: { width: '100%' },
      dropdownStyle: { maxHeight: 400, overflow: 'auto' },
      treeDefaultExpandAll: true,
      placeholder: '请选择',
      ...selectProps,
      value: this.value,
      treeData: this.state.data,
      onChange: this.handleChange,
    };
    return <TreeSelect {...sprops} />;
  }
}
