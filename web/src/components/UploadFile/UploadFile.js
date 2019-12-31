import React from 'react';
import PropTypes from 'prop-types';
import { Upload, Icon, Modal, Button, Table, Popconfirm, Divider } from 'antd';
import styles from './UploadFile.less';
import store from '@/utils/store';

const defaction = '/api/v1/files';

export default class UploadFile extends React.Component {
  static propTypes = {
    accept: PropTypes.string,
    bucket: PropTypes.string.isRequired,
    num: PropTypes.number,
    listType: PropTypes.oneOf(['picture-card', 'picture', 'text']),
    rich: PropTypes.object,
    showUploadList: PropTypes.bool,
    // value: PropTypes.arrayOf(PropTypes.string),
    action: PropTypes.string,
  };

  static defaultProps = {
    accept: '*',
    num: 3,
    rich: null,
    showUploadList: true,
    listType: 'text',
    action: defaction,
  };

  constructor(props) {
    super(props);
    const { value, num, action, name } = props;
   
    const filelist = [];
   
    this.validFilelist = [];
    if (value && value.length) {
      this.validFilelist = [...value];
      let i = -1;

      for (const item of value) {
        filelist.push({
          uid: `${i}`,
          name: item,
          status: 'done',
          url: item,
          thumbUrl: item,
        });
        i += -1;
      }
    }
    let fnum = 9;
    if (num > 0) {
      fnum = num;
    }
    let a = defaction;
    if (action) {
      a = action;
    }
    this.fileList = filelist;
    this.state = {
      action: a,
      previewVisible: false,
      previewImage: '',
      num: fnum,
      name: name || 'data',
      // fileList:[]
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { previewVisible } = this.state;
    if (previewVisible !== nextState.previewVisible) {
      return true;
    }

    if (nextProps.value) {
      const fileList = nextProps.value;
      if (fileList) {
        if (!this.isChg(fileList)) {
          // 无变化
          return null;
        }
        this.validFilelist = [...fileList];
        // 获取新增的文件列表
        const tmp = fileList.filter(item => {
          return !this.fileList.some(i => {
            return i.url === item;
          });
        });
        // 原来的文件列表
        const old = this.fileList;
        // 正在上传的文件列表
        const nodone = old.filter(item => {
          return item.status !== 'done';
        });
        // 原来已经传完的文件列表,并且是以改变的值
        const done = old.filter(item => {
          return (
            item.status === 'done' &&
            fileList.some(i => {
              return item.url === i;
            })
          );
        });
        // 合并
        let i = -1;
        for (const item of tmp) {
          done.push({
            uid: `${i}`,
            name: item,
            status: 'done',
            url: item,
            thumbUrl: item,
          });
          i += -1;
        }
        done.sort((a, b) => {
          let ak = 0;
          let bk = 0;
          for (const key in fileList) {
            if (a.url === fileList[key]) {
              ak = key;
            } else if (b.url === fileList[key]) {
              bk = key;
            }
          }
          return ak - bk;
        });
        for (const item of nodone) {
          done.push(item);
        }
        this.fileList = done;
        // this.setState({ fileList:done });
      }
    }
    return true;
  }

  triggerChange = ({ fileList }) => {
    // Should provide an event to pass value to Form.
    console.log('triggerChange ');
    const { onChange } = this.props;
    if (onChange) {
      const tmp = fileList.filter(item => {
        return {}.hasOwnProperty.call(item, 'url');
      });
      const out = tmp.map(item => {
        if ({}.hasOwnProperty.call(item, 'url')) {
          return item.url;
        } else {
          return '';
        }
      });
      console.log('out ');
      if (this.isChg(out)) {
        this.validFilelist = [...out];
        onChange(out);
      }
    }
  };

  isChg = fileList => {
    if (this.validFilelist.length !== fileList.length) {
      return true;
    }
    for (const key in fileList) {
      if (!this.validFilelist[key] || fileList[key] !== this.validFilelist[key]) {
        return true;
      }
    }
    return false;
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = info => {
    let { fileList } = info;
      // 1. Limit the number of uploaded files

    // fileList = fileList.slice(-this.state.num);
    // 2. Read from response and show file link
    fileList = fileList.map(file => {
      const out = { ...file };
      if (out.response) {
        // Component will show file.url as link
        out.url = out.response.url;
      }
      return out;
    });

    // 3. Filter successfully uploaded files according to response from server
    fileList = fileList.filter(file => {
      if (file.response) {
        return !!file.response.url;
      }
      return true;
    });
     this.fileList = fileList;
    //  this.setState({fileList});
    this.forceUpdate();
    this.triggerChange({ fileList });
    if(info.file.status==="uploading"){
      console.log('正在上传')
    }
    if(info.file.status==="done"){
      console.log('上传完成')
    }
    
  };

  insertRich = previewImage => {
    const { rich } = this.props;
    if (!rich) {
      return;
    }
    rich.insertImages(previewImage);
  };

  
  // 文件删除
  handleDelete = file => {
    const {fileList} = this.state;
    const filterList = fileList.filter(item => item.uid !== file.uid);
    const arrList = [];
    arrList.push({
      file:file,
      fileList:filterList
    })
    this.handleChange(arrList[0]);
  };


  render() {
    const { previewVisible, previewImage, action, name } = this.state;
    const { listType, accept,bucket, rich, showUploadList, disabled} = this.props;
    const tokenInfo = store.getAccessToken();
    const { fileList } = this;
    const columns = [
      {
        title: '文件名',
        dataIndex: 'name',
        width: 150,
      },
      {
        title: '操作',
        dataIndex: '',
        width: 150,
        render: (text, record) => {
          return <span>
            <a  href={record.url} target="_blank">打开</a>
            <Divider type="vertical" />
            <Popconfirm title="确定删除" onConfirm={() => this.handleDelete(record)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        },
      },
    ];
    const uprop = {
      action,
      showUploadList,
      listType,
      fileList,
      data: { bucket },
      name,
      disabled,
      headers: {
        Authorization: `${tokenInfo.token_type} ${tokenInfo.access_token}`,
      },
    };
    if (accept) {
      uprop.accept = accept;
    }
    if(fileList){
      fileList.forEach(file => {
        if(!file.thumbUrl){
        }else{
          file.url =file.thumbUrl.url;
          file.name =file.thumbUrl.name;
          file.thumbUrl=file.thumbUrl.thumbUrl;
        }
      });
    }
    return (
      <div className="clearfix">
        <Upload
          {...uprop}
          // showUploadList={false}
          onChange={this.handleChange}
        >
          {/* {fileList.length >= this.props.num ? null : ( */}
            <Button>
              <Icon type="upload" /> 上传附件
            </Button>
          {/* )} */}
        </Upload>
        {/* <Table bordered dataSource={fileList} columns={columns} pagination={false}/> */}
      </div>
    );
  }
}
