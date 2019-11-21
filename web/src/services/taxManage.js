import { stringify } from 'qs';
import request from '../utils/request';
import { async } from 'q';

const router = 'tax-calculations';

export async function query(){
    return request(`/v1/${router}`);
}

export async function create(params){
    return request(`/v1/${router}`,{
        method : 'POST',
        body : params,
    })
}