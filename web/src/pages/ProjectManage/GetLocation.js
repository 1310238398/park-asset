import React, { PureComponent } from 'react';
import { Map, Marker } from 'react-amap';
import { connect } from 'dva';
// import { Modal } from 'antd';
// import PicturesWall from '../../components/PicturesWall/PicturesWall';
// import { checkPhoneNum } from '../../utils/utils';
// DicSelect from '@/components/DictionaryNew/DicSelect';

@connect(state => ({
  projectManage: state.projectManage,
}))
class GetLocation extends PureComponent {
  constructor(props) {
    super(props);
    // console.log('12121', props);
    this.state = {
      visible: true,
      position: { longitude: 116.98, latitude: 36.67 },
      draggable: true,
      inAddress: '',
    };
    this.markerEvents = {
      click: () => {
        // console.log('marker clicked!');
      },
      dragging: e => {
        //  console.log(e);
        this.setState({ position: { longitude: e.lnglat.lng, latitude: e.lnglat.lat } });
      },
    };
  }

  //   dingWeiMap = () => {
  //     // 地图加载
  //     var map = new AMap.Map('container', {
  //       resizeEnable: true,
  //     });
  //     // 输入提示
  //     var autoOptions = {
  //       input: this.state.inAddress,
  //     };
  //     var auto = new AMap.Autocomplete(autoOptions);
  //     var placeSearch = new AMap.PlaceSearch({
  //       map: map,
  //     }); // 构造地点查询类
  //     AMap.event.addListener(auto, 'select', select); // 注册监听，当选中某条记录时会触发
  //     function select(e) {
  //       placeSearch.setCity(e.poi.adcode);
  //       placeSearch.search(e.poi.name); // 关键字查询查询
  //     }
  //   };

  static getDerivedStateFromProps(nextProps, state) {
    if ('address' in nextProps) {
      return { ...state, inAddress: nextProps.address };
    }
    return state;
  }

  onOKClick = () => {
    // const { onSubmit } = this.props;
    // form.validateFieldsAndScroll((err, values) => {
    //   if (err) {
    //     return;
    //   }
    //   const formData = { ...values };
    //   onSubmit(formData);
    // });
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  render() {
    // const {
    //   onCancel,
    // } = this.props;

    // const formItemLayout = {
    //   labelCol: {
    //     span: 6,
    //   },
    //   wrapperCol: {
    //     span: 18,
    //   },
    // };
    // const formItemLayout2 = {
    //   labelCol: {
    //     span: 3,
    //   },
    //   wrapperCol: {
    //     span: 21,
    //   },
    // };
    const { position, draggable, visible } = this.state;
    return (
      <div>
        <div style={{ width: '100%', height: 160 }} id="container">
          <Map
            center={position}
            zoom={16}
            amapkey="9cc74cf787ce9db3e56143e361b4d346"
            version="1.4.15"
          >
            <Marker
              events={this.markerEvents}
              position={position}
              visible={visible}
              draggable={draggable}
            />
          </Map>
        </div>
      </div>
    );
  }
}

export default GetLocation;
