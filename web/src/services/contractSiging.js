import { stringify } from 'qs';
import request from '@/utils/request';

const router = 'organizations';
const routerPro = 'projects';
const comContRouter = 'com-contract';
const routerT = 'dictionaries';
const pRouter = 'proj-cost-items';
const cRouter = 'proj-contract-plannings';
const settRouter = 'settlement-records';

// 查询合同草稿列表
export async function querySigingPage(params,proID) {
  if(proID){
    return request(`/v1/${comContRouter}/${proID}/byproject?${stringify(params)}`);
  }else{
    return request(`/v1/${comContRouter}?${stringify(params)}`);
  }
  
}

// 查询单条合同数据
export async function getSigingOne(params) {
  return request(`/v1/${comContRouter}/${params.record_id}`);
}

// 查询单条合同数据设计变更
export async function getDesignOne(params) {
  return request(`/v1/${comContRouter}/${params}/alter/design`);
}
// 查询单条合同数据签证变更
export async function getVisaOne(params) {
  return request(`/v1/${comContRouter}/${params}/alter/sign`);
}

// 查询单条合同数据材料批价
export async function getMaterialOne(params) {
  return request(`/v1/${comContRouter}/${params}/alter/stuffpriceitem`);
}



// 查询项目ID和名字
export async function selectProInfo(params) {
  return request(`/v1/${routerPro}/${params.ID}`);
}

// 更新保存
export async function updateSiging(params) {
  return request(`/v1/${comContRouter}/${params.record_id}`, {
    method: 'PUT',
    body: params,
  });
}

// 创建
export async function createSiging(params) {
  return request(`/v1/${comContRouter}`, {
    method: 'POST',
    body: params,
  });
}

// 删除
export async function delSiging(params) {
  return request(`/v1/${comContRouter}/${params.record_id}`, {
    method: 'DELETE',
  });
}
// 提交审核
export async function commitSiging(params) {
  return request(`/v1/${comContRouter}/${params.id}/commit`, {
    method: 'PUT',
  });
}

// 合同生效
export async function entrySiging(params) {
  return request(`/v1/${comContRouter}/${params.record_id}/take-effect`, {
    method: 'PUT',
    body: params.data,
  });
}
// 查询乙方单位
export async function query(params) {
  return request(`/v1/business-partners?${stringify(params)}`);
}

// 查询所属科目
export async function contractPlanList(params) {
  return request(`/v1/${pRouter}?${stringify(params)}`);
}

// 查询合约规划
export async function contractCList(params) {
  return request(`/v1/${cRouter}?${stringify(params)}`);
}

// 项目名称
export async function queryProTree(params) {
  return request(`/v1/pc-projects?${stringify(params)}`);
}

// 合同结算保存
export async function saveSettlement(params) {
  return request(`/v1/${comContRouter}/${params.record_id}/settlement`, {
    method: 'POST',
    body: params.data,
  });
}
// 编辑结算信息
export async function saveEditSettlement(params) {
  return request(`/v1/${settRouter}/${params.data.record_id}`, {
    method: 'PUT',
    body: params.data,
  });
}

// 查询合同结算列表
export async function querySettlementPage(params) {

  return request(`/v1/${comContRouter}/${params.record_id}/settlementlist?${stringify(params.params)}`);
}

//根据合同id 获取结算信息
export async function querySettlementPageOne(params) {
  
  return request(`/v1/${comContRouter}/${params}/settlementlist`);
}
// 删除
export async function delSettlement(params) {
  return request(`/v1/${settRouter}/${params}`, {
    method: 'DELETE',
  });
}
// 查询单条结算信息
export async function getSettlementOne(params) {
  return request(`/v1/${settRouter}/${params.record_id}`);
}

