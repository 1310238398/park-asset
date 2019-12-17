import request from '../utils/request';
import { stringify } from 'qs';

const router = "contract-planning-templates";

export async function queryContractPlan(params){
    return request(`/v1/${router}?${stringify(params)}`);
}

export async function queryContractPlanById(params){
    return request(`/v1/${router}/${params.record_id}`);
}

export async function createContactPlan(params){
    return request(`/v1/${router}`,{
        method : 'POST',
        body : params,
    })
}

export async function updateContractPlan(params){
    return request(`/v1/${router}/${params.record_id}`,{
        method : 'PUT',
        body : params,
    });
}

export async function delContractPlan(params){
    return request(`/v1/${router}/${params}`,{
        method : 'DELETE',
    })
}