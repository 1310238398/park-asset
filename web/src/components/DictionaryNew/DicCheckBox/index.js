import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import { queryTree } from '../../../services/dictionary';

export default class DicCheckBox extends Component {
  static propTypes = {
    // 指定列表访问编码
    pcode: PropTypes.string.isRequired,
    // 字典code值类型是否是数值类型,
    vmode: PropTypes.oneOf(['string', 'float', 'int']),
    // 部分显示字典项
    code: PropTypes.array,
    selectProps: PropTypes.object,
  };

  static defaultProps = {
    vmode: 'string',
    code: [],
    selectProps: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
    const { pcode, code, value } = this.props;
    const data = this.loadData();
    if (data) {
      const vdata = data.filter(item => {
        return code && code.length > 0 ? code.some(v => v === this.getCodeValue(item.code)) : true;
      });
      this.state.data = vdata;
      this.value = value;
      return;
    }
    queryTree({ q: 'tree', parent_code: pcode, level: 1 }).then(rdata => {
      this.save(rdata.list);
      this.updateValue(rdata.list);
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

  componentDidUpdate(_prevProps, _prevState, snapshot) {
    // If we have a snapshot value, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    // (snapshot here is the value returned from getSnapshotBeforeUpdate)
    if (snapshot !== true) {
      // this.value = snapshot;
      // this.forceUpdate();
      this.fetch();
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    // Are we adding new items to the list?
    // Capture the scroll position so we can adjust scroll later.
    if ('code' in prevProps) {
      const { oldcode } = prevProps;
      const { code } = this.props;
      if (!oldcode && !code) {
        return null;
      }
      if (!oldcode || !code) {
        return true;
      }
      if (oldcode.length !== code.length) {
        return true;
      }
      for (const v of oldcode) {
        let flag = false;
        for (const v2 of code) {
          if (v === v2) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          return true;
        }
      }
      return null;
    }

    return null;
  }
  // componentWillReceiveProps(nextProps) {
  //   if ('value' in nextProps) {
  //     this.setState({ value: nextProps.value });
  //   }
  // }

  updateValue = sdata => {
    const { code, value } = this.props;
    const vdata = sdata.filter(item => {
      return code && code.length > 0 ? code.some(v => v === this.getCodeValue(item.code)) : true;
    });
    this.value = value;
    this.setState({ data: vdata });
  };

  fetch = () => {
    const { pcode, value } = this.props;
    const data = this.loadData();
    if (data) {
      // const vdata = data.filter(item => {
      //   return code && code.length > 0 ? code.some(v => v === this.getCodeValue(item.code)) : true;
      // });
      this.setState({ data });
      this.value = value;
      return;
    }
    queryTree({ q: 'tree', parent_code: pcode, level: 1 }).then(rdata => {
      this.save(rdata.list);
      this.updateValue(rdata.list);
    });
  };

  loadData = () => {
    const { pcode } = this.props;
    return JSON.parse(window.sessionStorage.getItem(`dicselect|${pcode}`));
  };

  save = data => {
    const { pcode } = this.props;
    if (data && data.length > 0)
      window.sessionStorage.setItem(`dicselect|${pcode}`, JSON.stringify(data));
  };

  handleChange = value => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  getCodeValue = v => {
    const { vmode } = this.props;
    if (vmode === 'float') {
      return parseFloat(v);
    }
    if (vmode === 'int') {
      return parseInt(v, 10);
    }
    return v;
  };

  v2i = v => {
    return parseInt(v, 10);
  };

  render() {
    const { selectProps, vmode, code } = this.props;
    const { data } = this.state;
    delete (selectProps, 'onChange');
    delete (selectProps, 'value');
    delete (selectProps, 'treeData');

    const v2 = v => {
      if (vmode === 'float') {
        return parseFloat(v);
      }
      if (vmode === 'int') {
        return parseInt(v, 10);
      }
      return v;
    };

    const vdata = data.filter(item => {
      return code && code.length > 0 ? code.some(v => v === this.getCodeValue(item.code)) : true;
    });
    return (
      <Checkbox.Group style={{ width: '100%' }} onChange={this.handleChange}>
        {vdata.map(v => {
          return (
            <Checkbox key={v.record_id} value={v2(v.code)}>
              {v.name}
            </Checkbox>
          );
        })}
      </Checkbox.Group>
      // <Select {...sprops}>
      //   {vdata.map(v => {
      //     return (
      //       <Select.Option key={v.record_id} value={v2(v.code)}>
      //         {v.name}
      //       </Select.Option>
      //     );
      //   })}
      // </Select>
    );
  }
}
