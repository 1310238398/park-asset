import { stringify } from 'qs';
import request from '@/utils/request';

const router = 'organizations';
const routerPro = 'projects';
const buildingsRouter = 'factory_buildings';

export async function querySupplementPage(params) {
  return request(`/v1/${buildingsRouter}?${stringify(params)}`);
}

// 查询单条数据
export async function getSupplementOne(params) {
  return request(`/v1/${buildingsRouter}/${params.record_id}`);
}

// 查询项目ID和名字
export async function selectProInfo(params) {
  return request(`/v1/${routerPro}/${params.ID}`);
}

// 更新保存
export async function updateSupplement(params) {
  return request(`/v1/${buildingsRouter}/${params.record_id}`, {
    method: 'PUT',
    body: params,
  });
}

// 创建
export async function createSupplement(params) {
  return request(`/v1/${buildingsRouter}`, {
    method: 'POST',
    body: params,
  });
}

// 删除
export async function delSupplement(params) {
  return request(`/v1/${buildingsRouter}/${params.record_id}`, {
    method: 'DELETE',
  });
}
// 查询乙方单位
export async function query(params) {
  return request(`/v1/business-partners?${stringify(params)}`);
}

