import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as assetBuildDataService from '@/services/assetBuildData';

export default {
  namespace: 'assetBuildData',
  state: {
    searchBuild: {},
    paginationBuild: {},
    dataBuild: {
      list: [],
      pagination: {},
    },
    // 单元
    searchUnit: {},
    paginationUnit: {},
    dataUnit: {
      list: [],
      pagination: {},
    },

    // 楼层
    searchFloor: {},
    paginationFloor: {},
    dataFloor: {
      list: [],
      pagination: {},
    },

    // 门牌
    searchPlate: {},
    paginationPlate: {},
    dataPlate: {
      list: [],
      pagination: {},
    },
    // 子门牌
    searchSubDoor: {},
    paginationSubDoor: {},
    dataSubDoor: {
      list: [],
      pagination: {},
    },
    submitting: false,
    formTitle: '',
    formID: '',
    formVisible: false,
    formData: {},
    // 楼栋数据
    formTypeBuild: '',
    formVisibleBuild: false,
    formDataBuild: {},
    formTitleBuild: '',
    formIDBuild: '',
    // 单元数据
    formTypeUnit: '',
    formVisibleUnit: false,
    formDataUnit: {},
    formTitleUnit: '',
    formIDUnit: '',

    // 楼层数据
    formTypeFloor: '',
    formVisibleFloor: false,
    formDataFloor: {},
    formTitleFloor: '',
    formIDFloor: '',

    // 门牌数据
    formTypePlate: '',
    formVisiblePlate: false,
    formDataPlate: {},
    formTitlePlate: '',
    formIDPlate: '',
    // 子门牌数据
    formTypeSubDoor: '',
    formVisibleSubDoor: false,
    formDataSubDoor: {},
    formTitleSubDoor: '',
    formIDSubDoor: '',
    // 项目数据
    proData: {},
    proID: '',

    // 楼栋name
    loudongName: '',
    // 单元 name
    UnitName: '',
    // 门牌Name
    DoorName: '',
    loudongN: '',
    unitNum: 0,
  },
  effects: {
    // *del({ payload }, { call, put }) {
    //   const response = yield call(assetBuildDataService.del, payload);
    //   if (response.status === 'OK') {
    //     message.success('删除成功');
    //     yield put({ type: 'fetch' });
    //   }
    // },
    // 楼栋数据
    *LoadBuild({ payload }, { put }) {
      yield put({
        type: 'changeFormVisibleBuild',
        payload: true,
      });
      if (payload.inProjectID) {
        yield put({
          type: 'selectProjectIDName',
          payload: { ID: payload.inProjectID },
        });

        // 保存proId
        yield put({
          type: 'saveProjectID',
          payload: payload.inProjectID,
        });
      }

      yield [
        put({
          type: 'saveFormTypeBuild',
          payload: payload.type,
        }),
        put({
          type: 'saveFormTitleBuild',
          payload: '新建楼栋',
        }),
        put({
          type: 'saveFormIDBuild',
          payload: '',
        }),
        put({
          type: 'saveFormDataBuild',
          payload: {},
        }),
      ];

      if (payload.type === 'E') {
        yield [
          put({
            type: 'saveFormTitleBuild',
            payload: '编辑楼栋',
          }),
          put({
            type: 'saveFormIDBuild',
            payload: payload.id,
          }),
          put({
            type: 'fetchFormBuild',
            payload: { record_id: payload.id },
          }),
        ];
      }
      if (payload.type === 'S') {
        yield [
          put({
            type: 'saveFormTitleBuild',
            payload: '查看楼栋',
          }),
          put({
            type: 'saveFormIDBuild',
            payload: payload.id,
          }),
          put({
            type: 'fetchFormBuild',
            payload: { record_id: payload.id },
          }),
        ];
      }
    },

    // 查询楼栋单条数据
    *fetchFormBuild({ payload }, { call, put }) {
      const response = yield call(assetBuildDataService.getBuildOne, payload);
      yield put({
        type: 'saveFormDataBuild',
        payload: response,
      });
    },

    *submitBuild({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formTypeBuild = yield select(state => state.assetBuildData.formTypeBuild);
      const proid = payload.project_id;
      let response;
      if (formTypeBuild === 'E') {
        params.record_id = yield select(state => state.assetBuildData.formIDBuild);
        response = yield call(assetBuildDataService.updateBuild, params);
      } else {
        response = yield call(assetBuildDataService.createBuild, params);
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (response.record_id && response.record_id !== '') {
        message.success('保存成功');
        yield put({
          type: 'changeFormVisibleBuild',
          payload: false,
        });
        // TODO 查询单元列表
        yield put({
          type: 'fetchBuidings',
          search:{project_id:proid}
        });
      }
    },

    // 查询项目名称和ID
    *selectProjectIDName({ payload }, { call, put }) {
      const response = yield call(assetBuildDataService.selectProInfo, payload);
      yield put({ type: 'saveProData', payload: response });
    },

    // 单元部分数据
    *cellRoute({ payload, unit }, { put }) {
      yield put(
        routerRedux.push({
          pathname: '/assettypedata/assetunit',
          query: {
            recordID: payload.record_id,
            currentName: payload.name,
            projectID: payload.project_id,
          },
        })
      );
      yield put({ type: 'saveLoudongName', payload: payload.name });
      yield put({ type: 'saveUnitNum', payload: unit });
    },

    *LoadUnit({ payload }, { put }) {
      yield put({
        type: 'changeFormVisibleUnit',
        payload: true,
      });

      if (payload.inProjectID) {
        yield put({
          type: 'selectProjectIDName',
          payload: { ID: payload.inProjectID },
        });
      }
      yield [
        put({
          type: 'saveFormTypeUnit',
          payload: payload.type,
        }),
        put({
          type: 'saveFormTitleUnit',
          payload: '新建单元',
        }),
        put({
          type: 'saveFormIDUnit',
          payload: '',
        }),
        put({
          type: 'saveFormDataUnit',
          payload: {},
        }),
      ];

      if (payload.type === 'E') {
        yield [
          put({
            type: 'saveFormTitleUnit',
            payload: '编辑单元',
          }),
          put({
            type: 'saveFormIDUnit',
            payload: payload.id,
          }),
          put({
            type: 'fetchFormUnit',
            payload: { record_id: payload.id },
          }),
        ];
      }
      if (payload.type === 'S') {
        yield [
          put({
            type: 'saveFormTitleUnit',
            payload: '查看单元',
          }),
          put({
            type: 'saveFormIDUnit',
            payload: payload.id,
          }),
          put({
            type: 'fetchFormUnit',
            payload: { record_id: payload.id },
          }),
        ];
      }
    },
    *fetchFormUnit({ payload }, { call, put }) {
      const response = yield call(assetBuildDataService.getBuildOne, payload);
      yield [
        put({
          type: 'saveFormDataUnit',
          payload: response,
        }),
      ];
    },
    *submitUnit({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formType = yield select(state => state.assetBuildData.formTypeUnit);

      let response;
      if (formType === 'E') {
        params.record_id = yield select(state => state.assetBuildData.formIDUnit);
        response = yield call(assetBuildDataService.updateBuild, params);
      } else {
        response = yield call(assetBuildDataService.createBuild, params);
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (response.record_id && response.record_id !== '') {
        message.success('保存成功');
        yield put({
          type: 'changeFormVisibleUnit',
          payload: false,
        });
        // TODO 查询单元列表
        yield put({
          type: 'fetchUnit',
        });
      }
    },
    *delUnit({ payload }, { call, put }) {
      const response = yield call(assetBuildDataService.delBuild, payload);
      if (response.status === 'OK') {
        message.success('删除成功');
        yield put({ type: 'fetchUnit' });
      }
    },
    // 楼层部分数据
    *floorRoute({ payload }, { put }) {
      yield put(
        routerRedux.push({
          pathname: '/assettypedata/assetfloor',
          query: {
            recordID: payload.item.record_id,
            projectID: payload.item.project_id,
            type: payload.item.asset_type,
            currentName: payload.item.name,
            loudong: payload.loudongName,
          },
        })
      );
      yield put({ type: 'saveUnitName', payload: payload.item.name });
      yield put({ type: 'saveUnitNum', payload: payload.unit });
    },

    // 跳转门牌
    *plateRoute({ payload }, { put }) {
      yield put(
        routerRedux.push({
          pathname: '/assettypedata/assetnumplate',
          query: {
            recordID: payload.item.record_id,
            projectID: payload.item.project_id,
            type: payload.item.asset_type,
            currentName: payload.item.name,
            loudong: payload.loudongName,
          },
        })
      );
      yield put({
        type: 'saveloudong',
        payload: payload.loudongName,
      });
    },

    // 跳转子门牌
    *subDoorRoute({ payload }, { put }) {
      yield put(
        routerRedux.push({
          pathname: '/assettypedata/assetsubdoor',
          query: {
            recordID: payload.record_id,
            projectID: payload.project_id,
            type: payload.asset_type,
            currentName: payload.name,
          },
        })
      );
      yield put({ type: 'saveDoorName', payload: payload.name });
    },

    // 查询写字楼列表
    *fetchBuidings({ search, pagination }, { call, put, select }) {
      let params = {
        q: 'page',
      };
      if (search) {
        params = { ...params, ...search };
        yield put({
          type: 'saveSearchBuild',
          payload: search,
        });
      } else {
        const s = yield select(state => state.assetBuildData.searchBuild);
        if (s) {
          params = { ...params, ...s };
        }
      }

      if (pagination) {
        params = { ...params, ...pagination };
        yield put({
          type: 'savePagination',
          payload: pagination,
        });
      } else {
        const p = yield select(state => state.assetBuildData.paginationBuild);
        if (p) {
          params = { ...params, ...p };
        }
      }
      const response = yield call(assetBuildDataService.queryBuildingsPage, params);
      yield [
        put({
          type: 'saveBuidings',
          payload: response,
        }),
      ];
    },

    // 删除楼栋
    *delBuild({ payload }, { call, put }) {
      const response = yield call(assetBuildDataService.delBuild, payload);
      if (response.status === 'OK') {
        message.success('删除成功');
        yield put({ type: 'fetchBuidings' });
      }
    },
    // 查询单元列表
    *fetchUnit({ search, pagination }, { call, put, select }) {
      let params = {
        q: 'page',
      };
      if (search) {
        params = { ...params, ...search };
        yield put({
          type: 'saveSearchUint',
          payload: search,
        });
      } else {
        const s = yield select(state => state.assetBuildData.searchUnit);
        if (s) {
          params = { ...params, ...s };
        }
      }

      if (pagination) {
        params = { ...params, ...pagination };
        yield put({
          type: 'savePaginationUnit',
          payload: pagination,
        });
      } else {
        const p = yield select(state => state.assetBuildData.paginationUnit);
        if (p) {
          params = { ...params, ...p };
        }
      }
      const response = yield call(assetBuildDataService.queryBuildingsPage, params);
      yield [
        put({
          type: 'saveUnitList',
          payload: response,
        }),
      ];
    },

    // 查询楼层列表
    *fetchFloor({ search, pagination }, { call, put, select }) {
      let params = {
        q: 'page',
      };
      if (search) {
        params = { ...params, ...search };
        yield put({
          type: 'saveSearchFloor',
          payload: search,
        });
      } else {
        const s = yield select(state => state.assetBuildData.searchFloor);
        if (s) {
          params = { ...params, ...s };
        }
      }

      if (pagination) {
        params = { ...params, ...pagination };
        yield put({
          type: 'savePaginationFloor',
          payload: pagination,
        });
      } else {
        const p = yield select(state => state.assetBuildData.paginationFloor);
        if (p) {
          params = { ...params, ...p };
        }
      }
      const response = yield call(assetBuildDataService.queryBuildingsPage, params);
      yield [
        put({
          type: 'saveFloorList',
          payload: response,
        }),
      ];
    },
    // 查询楼层单条数据
    *fetchFormFloor({ payload }, { call, put }) {
      const response = yield call(assetBuildDataService.getBuildOne, payload);
      yield put({
        type: 'saveFormDataFloor',
        payload: response,
      });
    },

    *LoadFloor({ payload }, { put }) {
      yield put({
        type: 'changeFormVisibleFloor',
        payload: true,
      });

      if (payload.inProjectID) {
        yield put({
          type: 'selectProjectIDName',
          payload: { ID: payload.inProjectID },
        });
      }
      yield [
        put({
          type: 'saveFormTypeFloor',
          payload: payload.type,
        }),
        put({
          type: 'saveFormTitleFloor',
          payload: '新建楼层',
        }),
        put({
          type: 'saveFormIDFloor',
          payload: '',
        }),
        put({
          type: 'saveFormDataFloor',
          payload: {},
        }),
      ];

      if (payload.type === 'E') {
        yield [
          put({
            type: 'saveFormTitleFloor',
            payload: '编辑楼层',
          }),
          put({
            type: 'saveFormIDFloor',
            payload: payload.id,
          }),
          put({
            type: 'fetchFormFloor',
            payload: { record_id: payload.id },
          }),
        ];
      }
      if (payload.type === 'S') {
        yield [
          put({
            type: 'saveFormTitleFloor',
            payload: '查看楼层',
          }),
          put({
            type: 'saveFormIDFloor',
            payload: payload.id,
          }),
          put({
            type: 'fetchFormFloor',
            payload: { record_id: payload.id },
          }),
        ];
      }
    },
    *submitFloor({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formType = yield select(state => state.assetBuildData.formTypeFloor);

      let response;
      if (formType === 'E') {
        params.record_id = yield select(state => state.assetBuildData.formIDFloor);
        response = yield call(assetBuildDataService.updateBuild, params);
      } else {
        response = yield call(assetBuildDataService.createBuild, params);
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (response.record_id && response.record_id !== '') {
        message.success('保存成功');
        yield put({
          type: 'changeFormVisibleFloor',
          payload: false,
        });
        // TODO 查询楼栋列表
        yield put({
          type: 'fetchFloor',
        });
      }
    },

    // 删除楼层
    *delFloor({ payload }, { call, put }) {
      const response = yield call(assetBuildDataService.delBuild, payload);
      if (response.status === 'OK') {
        message.success('删除成功');
        yield put({ type: 'fetchFloor' });
      }
    },

    // 查询门牌列表
    *fetchPlate({ search, pagination }, { call, put, select }) {
      let params = {
        q: 'page',
      };
      if (search) {
        params = { ...params, ...search };
        yield put({
          type: 'saveSearchPlate',
          payload: search,
        });
      } else {
        const s = yield select(state => state.assetBuildData.searchPlate);
        if (s) {
          params = { ...params, ...s };
        }
      }

      if (pagination) {
        params = { ...params, ...pagination };
        yield put({
          type: 'savePaginationPlate',
          payload: pagination,
        });
      } else {
        const p = yield select(state => state.assetBuildData.paginationPlate);
        if (p) {
          params = { ...params, ...p };
        }
      }
      const response = yield call(assetBuildDataService.queryBuildingsPage, params);
      yield [
        put({
          type: 'savePlateList',
          payload: response,
        }),
      ];
    },
    // 查询门牌单条数据
    *fetchFormPlate({ payload }, { call, put }) {
      const response = yield call(assetBuildDataService.getBuildOne, payload);
      yield put({
        type: 'saveFormDataPlate',
        payload: response,
      });
    },

    *LoadPlate({ payload }, { put }) {
      yield put({
        type: 'changeFormVisiblePlate',
        payload: true,
      });

      if (payload.inProjectID) {
        yield put({
          type: 'selectProjectIDName',
          payload: { ID: payload.inProjectID },
        });
      }
      yield [
        put({
          type: 'saveFormTypePlate',
          payload: payload.type,
        }),
        put({
          type: 'saveFormTitlePlate',
          payload: '新建门牌',
        }),
        put({
          type: 'saveFormIDPlate',
          payload: '',
        }),
        put({
          type: 'saveFormDataPlate',
          payload: {},
        }),
      ];

      if (payload.type === 'E') {
        yield [
          put({
            type: 'saveFormTitlePlate',
            payload: '编辑门牌',
          }),
          put({
            type: 'saveFormIDPlate',
            payload: payload.id,
          }),
          put({
            type: 'fetchFormPlate',
            payload: { record_id: payload.id },
          }),
        ];
      }
      if (payload.type === 'S') {
        yield [
          put({
            type: 'saveFormTitlePlate',
            payload: '查看门牌',
          }),
          put({
            type: 'saveFormIDPlate',
            payload: payload.id,
          }),
          put({
            type: 'fetchFormPlate',
            payload: { record_id: payload.id },
          }),
        ];
      }
    },
    *submitPlate({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formType = yield select(state => state.assetBuildData.formTypePlate);

      let response;
      if (formType === 'E') {
        params.record_id = yield select(state => state.assetBuildData.formIDPlate);
        response = yield call(assetBuildDataService.updateBuild, params);
      } else {
        response = yield call(assetBuildDataService.createBuild, params);
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (response.record_id && response.record_id !== '') {
        message.success('保存成功');
        yield put({
          type: 'changeFormVisiblePlate',
          payload: false,
        });
        // TODO 查询门牌列表
        yield put({
          type: 'fetchPlate',
        });
        yield put({
          type: 'fetchFormPlate',
          payload: { record_id: payload.parent_id },
        });
      }
    },

    // 删除门牌
    *delPlate({ payload }, { call, put }) {
      const response = yield call(assetBuildDataService.delBuild, payload);
      if (response.status === 'OK') {
        message.success('删除成功');
        yield put({ type: 'fetchPlate' });
      }
    },

    // 查询子门牌列表
    *fetchSubDoor({ search, pagination }, { call, put, select }) {
      let params = {
        q: 'page',
      };
      if (search) {
        params = { ...params, ...search };
        yield put({
          type: 'saveSearchSubDoor',
          payload: search,
        });
      } else {
        const s = yield select(state => state.assetBuildData.searchSubDoor);
        if (s) {
          params = { ...params, ...s };
        }
      }

      if (pagination) {
        params = { ...params, ...pagination };
        yield put({
          type: 'savePaginationPlate',
          payload: pagination,
        });
      } else {
        const p = yield select(state => state.assetBuildData.paginationPlate);
        if (p) {
          params = { ...params, ...p };
        }
      }
      const response = yield call(assetBuildDataService.queryBuildingsPage, params);
      yield [
        put({
          type: 'saveSubDoorList',
          payload: response,
        }),
      ];
    },
    // 查询门牌单条数据
    *fetchFormSubDoor({ payload }, { call, put }) {
      const response = yield call(assetBuildDataService.getBuildOne, payload);
      yield put({
        type: 'saveFormDataSubDoor',
        payload: response,
      });
    },

    *LoadSubDoor({ payload }, { put }) {
      yield put({
        type: 'changeFormVisibleSubDoor',
        payload: true,
      });

      if (payload.inProjectID) {
        yield put({
          type: 'selectProjectIDName',
          payload: { ID: payload.inProjectID },
        });
      }
      yield [
        put({
          type: 'saveFormTypeSubDoor',
          payload: payload.type,
        }),
        put({
          type: 'saveFormTitleSubDoor',
          payload: '新建门牌',
        }),
        put({
          type: 'saveFormIDSubDoor',
          payload: '',
        }),
        put({
          type: 'saveFormDataSubDoor',
          payload: {},
        }),
      ];

      if (payload.type === 'E') {
        yield [
          put({
            type: 'saveFormTitleSubDoor',
            payload: '编辑子门牌',
          }),
          put({
            type: 'saveFormIDSubDoor',
            payload: payload.id,
          }),
          put({
            type: 'fetchFormSubDoor',
            payload: { record_id: payload.id },
          }),
        ];
      }
      if (payload.type === 'S') {
        yield [
          put({
            type: 'saveFormTitleSubDoor',
            payload: '查看子门牌',
          }),
          put({
            type: 'saveFormIDSubDoor',
            payload: payload.id,
          }),
          put({
            type: 'fetchFormSubDoor',
            payload: { record_id: payload.id },
          }),
        ];
      }
    },
    *submitSubDoor({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formType = yield select(state => state.assetBuildData.formTypeSubDoor);

      let response;
      if (formType === 'E') {
        params.record_id = yield select(state => state.assetBuildData.formIDSubDoor);
        response = yield call(assetBuildDataService.updateBuild, params);
      } else {
        response = yield call(assetBuildDataService.createBuild, params);
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (response.record_id && response.record_id !== '') {
        message.success('保存成功');
        yield put({
          type: 'changeFormVisibleSubDoor',
          payload: false,
        });
        // TODO 查询门牌列表
        yield put({
          type: 'fetchSubDoor',
        });
        // yield put({
        //   type: 'fetchFormSubDoor',
        //   payload: { record_id: payload.parent_id },
        // });
      }
    },

    // 删除门牌
    *delSubDoor({ payload }, { call, put }) {
      const response = yield call(assetBuildDataService.delBuild, payload);
      if (response.status === 'OK') {
        message.success('删除成功');
        yield put({ type: 'fetchSubDoor' });
      }
    },
  },
  reducers: {
    saveData(state, { payload }) {
      return { ...state, data: payload };
    },
    saveSearch(state, { payload }) {
      return { ...state, search: payload };
    },
    savePagination(state, { payload }) {
      return { ...state, pagination: payload };
    },
    changeFormVisible(state, { payload }) {
      return { ...state, formVisible: payload };
    },
    saveFormTitle(state, { payload }) {
      return { ...state, formTitle: payload };
    },
    saveFormType(state, { payload }) {
      return { ...state, formType: payload };
    },
    saveFormID(state, { payload }) {
      return { ...state, formID: payload };
    },
    saveFormData(state, { payload }) {
      return { ...state, formData: payload };
    },
    changeSubmitting(state, { payload }) {
      return { ...state, submitting: payload };
    },
    // 楼栋数据
    changeFormVisibleBuild(state, { payload }) {
      return { ...state, formVisibleBuild: payload };
    },
    saveFormTitleBuild(state, { payload }) {
      return { ...state, formTitleBuild: payload };
    },
    saveFormTypeBuild(state, { payload }) {
      return { ...state, formTypeBuild: payload };
    },
    saveFormIDBuild(state, { payload }) {
      return { ...state, formIDBuild: payload };
    },
    saveFormDataBuild(state, { payload }) {
      return { ...state, formDataBuild: payload };
    },
    // 单元数据
    saveUnitList(state, { payload }) {
      return { ...state, dataUnit: payload };
    },
    saveSearchUint(state, { payload }) {
      return { ...state, searchUnit: payload };
    },
    savePaginationUnit(state, { payload }) {
      return { ...state, paginationUnit: payload };
    },
    changeFormVisibleUnit(state, { payload }) {
      return { ...state, formVisibleUnit: payload };
    },
    saveFormTitleUnit(state, { payload }) {
      return { ...state, formTitleUnit: payload };
    },
    saveFormTypeUnit(state, { payload }) {
      return { ...state, formTypeUnit: payload };
    },
    saveFormIDUnit(state, { payload }) {
      return { ...state, formIDUnit: payload };
    },
    saveFormDataUnit(state, { payload }) {
      return { ...state, formDataUnit: payload };
    },

    // 楼层数据
    saveFloorList(state, { payload }) {
      return { ...state, dataFloor: payload };
    },
    saveSearchFloor(state, { payload }) {
      return { ...state, searchFloor: payload };
    },
    savePaginationFloor(state, { payload }) {
      return { ...state, paginationFloor: payload };
    },
    changeFormVisibleFloor(state, { payload }) {
      return { ...state, formVisibleFloor: payload };
    },
    saveFormTitleFloor(state, { payload }) {
      return { ...state, formTitleFloor: payload };
    },
    saveFormTypeFloor(state, { payload }) {
      return { ...state, formTypeFloor: payload };
    },
    saveFormIDFloor(state, { payload }) {
      return { ...state, formIDFloor: payload };
    },
    saveFormDataFloor(state, { payload }) {
      return { ...state, formDataFloor: payload };
    },

    // 写字楼列表
    saveBuidings(state, { payload }) {
      return { ...state, dataBuild: payload };
    },
    saveSearchBuild(state, { payload }) {
      return { ...state, searchBuild: payload };
    },
    savePaginationBuild(state, { payload }) {
      return { ...state, paginationBuild: payload };
    },

    // 项目名称
    saveProData(state, { payload }) {
      return { ...state, proData: payload };
    },
    // 保存项目ID
    saveProjectID(state, { payload }) {
      return { ...state, proID: payload };
    },

    // 门牌数据
    savePlateList(state, { payload }) {
      return { ...state, dataPlate: payload };
    },
    saveSearchPlate(state, { payload }) {
      return { ...state, searchPlate: payload };
    },
    savePaginationPlate(state, { payload }) {
      return { ...state, paginationPlate: payload };
    },
    changeFormVisiblePlate(state, { payload }) {
      return { ...state, formVisiblePlate: payload };
    },
    saveFormTitlePlate(state, { payload }) {
      return { ...state, formTitlePlate: payload };
    },
    saveFormTypePlate(state, { payload }) {
      return { ...state, formTypePlate: payload };
    },
    saveFormIDPlate(state, { payload }) {
      return { ...state, formIDPlate: payload };
    },
    saveFormDataPlate(state, { payload }) {
      return { ...state, formDataPlate: payload };
    },
    saveLoudongName(state, { payload }) {
      return { ...state, loudongName: payload };
    },
    saveUnitName(state, { payload }) {
      return { ...state, UnitName: payload };
    },
    saveDoorName(state, { payload }) {
      return { ...state, DoorName: payload };
    },
    saveloudong(state, { payload }) {
      return { ...state, loudongN: payload };
    },
    saveUnitNum(state, { payload }) {
      return { ...state, unitNum: payload };
    },

    // 子门牌数据
    saveSubDoorList(state, { payload }) {
      return { ...state, dataSubDoor: payload };
    },
    saveSearchSubDoor(state, { payload }) {
      return { ...state, searchSubDoor: payload };
    },
    savePaginationSubDoor(state, { payload }) {
      return { ...state, paginationSubDoor: payload };
    },
    changeFormVisibleSubDoor(state, { payload }) {
      return { ...state, formVisibleSubDoor: payload };
    },
    saveFormTitleSubDoor(state, { payload }) {
      return { ...state, formTitleSubDoor: payload };
    },
    saveFormTypeSubDoor(state, { payload }) {
      return { ...state, formTypeSubDoor: payload };
    },
    saveFormIDSubDoor(state, { payload }) {
      return { ...state, formIDSubDoor: payload };
    },
    saveFormDataSubDoor(state, { payload }) {
      return { ...state, formDataSubDoor: payload };
    },
  },
};
