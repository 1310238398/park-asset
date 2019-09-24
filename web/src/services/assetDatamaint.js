import { stringify } from 'qs';
import request from '@/utils/request';

const router = 'organizations';
const buildingsRouter = 'office_buildings';

export async function queryBuildingsPage(params) {
  return request(`/v1/${buildingsRouter}?${stringify(params)}`);
}

export async function queryPage(params) {
  return request(`/v1/${router}?${stringify(params)}`);
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
