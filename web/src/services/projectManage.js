import { stringify } from 'qs';
import request from '../utils/request';

const router = 'projects';
const proRouter = 'statistics/project/name';

const pro_router = 'pc-projects';
const proj_business_formats = 'proj-business-formats';
// 
export async function createPro(params) {
  // /api/v1/
  return request(`/v1/${pro_router}`, {
    method: 'POST',
    body: params,
  });
}

// 查询项目概况项目树状列表
export async function queryList(params) {
  return request(`/v1/${pro_router}?${stringify(params)}`);
 
}
// 查询项目详情
export async function getProInfo(params) {
  return request(`/v1/${pro_router}/${params.record_id}`);
}
// 更新项目资料
export async function updateProInfo(params) {

  return request(`/v1/${pro_router}/${params.record_id}`, {
    method: 'PUT',
    body: params,
  });
}

// 查询项目的业态数据

export async function getProFormat(params) {
  return request(`/v1/${proj_business_formats}/?q=list&project_id=${params.record_id}`);
}

// 更新项目的业态 

export async function updateProFormat(params) {

  return request(`/v1/${proj_business_formats}/update_list`, {
    method: 'POST',
    body: params,
  });
}

// 查询项目的交付标准
export async function queryProStandard(project_id) {
//  /api/v1/proj-delivery-standards?q=tree
  return request(`/v1/proj-delivery-standards?q=tree&projectID=${project_id}`);
}

// 创建交付标准
export async function createStandard(params) {

  ///api/v1/proj-delivery-standards
  return request(`/v1/proj-delivery-standards`, {
    method: 'POST',
    body: params,
  });
}

// 更新交付标准
export async function updateStandard(params) {
 // /api/v1/proj-delivery-standards
  return request(`/v1/proj-delivery-standards/${params.record_id}`, {
    method: 'PUT',
    body: params,
  });
}

// 删除交付标准
export async function deleteStandard(record_id) {
  ///api/v1/proj-delivery-standards/{id}
  return request(`/v1/proj-delivery-standards/${record_id}`, {
    method: 'DELETE',
  });
}


export async function query(params) {
  return request(`/v1/${router}?${stringify(params)}`);
}

export async function get(params) {
  return request(`/v1/${router}/${params.record_id}`);
}

export async function create(params) {
  return request(`/v1/${router}`, {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request(`/v1/${router}/${params.record_id}`, {
    method: 'PUT',
    body: params,
  });
}

export async function del(params) {
  return request(`/v1/${router}/${params.record_id}`, {
    method: 'DELETE',
  });
}

export async function enable(params) {
  return request(`/v1/${router}/${params.record_id}/enable`, {
    method: 'PATCH',
  });
}

export async function disable(params) {
  return request(`/v1/${router}/${params.record_id}/disable`, {
    method: 'PATCH',
  });
}

export async function companySecond(params) {
  return request(`/v1/organizations?${stringify(params)}`);
}

export async function PoltList(params) {
  return request(`/v1/plots?${stringify(params)}`);
}

export async function queryProList(params) {
  return request(`/v1/${proRouter}?${stringify(params)}`);
}

