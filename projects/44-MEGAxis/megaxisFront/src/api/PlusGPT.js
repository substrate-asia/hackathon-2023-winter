import request from '../utils/request'
import {getToken} from "../utils/auth";

export function askGPT(data) {
    return request({
        url: '/chatgpt/ask',
        method: 'post',
        data
    })
}

export function getPromptParams(data) {
    data["uid"] = getToken()
    return request({
        url: '/chatgpt/getPromptParams',
        method: 'post',
        data
    })
}
