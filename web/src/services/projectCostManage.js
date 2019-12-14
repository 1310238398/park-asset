import { stringify } from 'qs';
import request from '../utils/request';

const router = "cost-items";

export function query(){
    return request(`/v1/${router}?q=tree&show=map`);
}

export function queryContactTree(){
    return request(`/v1/${router}?q=tree&label=1`);
}

export async function create(params) {
    return request(`/v1/${router}`, {
        method: 'POST',
        body: params,
    });
}

export async function del(params){
    return request(`/v1/${router}/${params.record_id}`, {
        method: 'DELETE',
    });
}

export async function update(params){
    return request(`/v1/${router}/${params.record_id}`, {
        method: 'PUT',
        body: params,
    });
}