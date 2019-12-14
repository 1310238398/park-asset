import request from '../utils/request';
import { stringify } from 'qs';

const router = "contract-planning-templates";

export function queryContractPlan(params){
    return request(`/v1/${router}?${stringify(params)}`);
}

export function queryContractPlanById(params){
    return request(`/v1/${router}/${params.record_id}`);
}

export function createContactPlan(params){
    return request(`/v1/${router}`,{
        method : 'POST',
        body : params,
    })
}

export function updateContractPlan(params){
    return request(`/v1/${router}/${params.record_id}`,{
        method : 'PUT',
        body : params,
    });
}

export function delContractPlan(params){
    return request(`/v1/${router}/${params}`,{
        method : 'DELETE',
    })
}