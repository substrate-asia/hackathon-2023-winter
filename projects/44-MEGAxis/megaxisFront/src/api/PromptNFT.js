import request from '../utils/request'
import {getToken} from "../utils/auth";

export function getByType(data) {
    return request({
        url: '/prompt/getByType',
        method: 'post',
        data
    })
}

export function getByKey(data) {
    return request({
        url: '/prompt/getByKey',
        method: 'post',
        data
    })
}
export function getFavorites(data) {
    data["uid"] = getToken()
    return request({
        url: '/prompt/getFavorites',
        method: 'post',
        data
    })
}
export function getBought(data) {
    data["uid"] = getToken()
    return request({
        url: '/prompt/getBought',
        method: 'post',
        data
    })
}

export function getMyPrompt(data) {
    data["uid"] = getToken()
    return request({
        url: '/prompt/getMyPrompt',
        method: 'post',
        data
    })
}
export function getDetail(data) {
    data["uid"] = getToken()
    return request({
        url: '/prompt/getDetail',
        method: 'post',
        data
    })
}
export function purchase(data) {
    data["uid"] = getToken()
    return request({
        url: '/prompt/purchase',
        method: 'post',
        data
    })
}

export function makePrompt(data) {
    data["uid"] = getToken()
    return request({
        url: '/prompt/make',
        method: 'post',
        data
    })
}
export function getContent(data) {
    data["uid"] = getToken()
    return request({
        url: '/prompt/getContent',
        method: 'post',
        data
    })
}
export function changePrompt(data) {
    data["uid"] = getToken()
    return request({
        url: '/prompt/change',
        method: 'post',
        data
    })
}

export function likePrompt(data) {
    data["uid"] = getToken()
    return request({
        url: '/prompt/like',
        method: 'post',
        data
    })
}