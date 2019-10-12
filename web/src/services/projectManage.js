import { stringify } from 'qs';
import request from '../utils/request';

const router = 'projects';
const proRouter = 'statistics/project/name';

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

