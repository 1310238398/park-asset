import { stringify } from 'qs';
import request from '@/utils/request';

const router = 'organizations';
const routerPro = 'projects';
const buildingsRouter = 'com-contract';
const routerT = 'dictionaries';
const pRouter = 'proj-cost-items';
const cRouter = 'proj-contract-plannings';

// 查询合同草稿列表
export async function querySigingPage(params) {
  return request(`/v1/${buildingsRouter}?${stringify(params)}`);
}

// 查询单条合同数据
export async function getSigingOne(params) {
  return request(`/v1/${buildingsRouter}/${params.record_id}`);
}

// 查询项目ID和名字
export async function selectProInfo(params) {
  return request(`/v1/${routerPro}/${params.ID}`);
}

// 更新保存
export async function updateSiging(params) {
  return request(`/v1/${buildingsRouter}/${params.record_id}`, {
    method: 'PUT',
    body: params,
  });
}

// 创建
export async function createSiging(params) {
  return request(`/v1/${buildingsRouter}`, {
    method: 'POST',
    body: params,
  });
}

// 删除
export async function delSiging(params) {
  return request(`/v1/${buildingsRouter}/${params.record_id}`, {
    method: 'DELETE',
  });
}
// 提交审核
export async function commitSiging(params) {
  return request(`/v1/${buildingsRouter}/${params.record_id}/commit`, {
    method: 'PUT',
  });
}

// 合同生效
export async function entrySiging(params) {
  return request(`/v1/${buildingsRouter}/${params.record_id}/take-effect`, {
    method: 'PUT',
    body: params,
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

