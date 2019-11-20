import { stringify } from 'qs';
import request from '../utils/request';

const router = 'business-formats';

export async function queryList(){
    return request(`/v1/${router}`);
}

export async function get(params) {
    return request(`/v1/${router}/${params.record_id}`);
}

export async function create(params){
    return request(`/v1/${router}`, {
        method: 'POST',
        body: params,
      });
}

export async function update(params){
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