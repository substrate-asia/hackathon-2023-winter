import request from '../utils/request'
import {getToken} from "../utils/auth";

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getProfile(data) {
  data["uid"] = getToken()
  return request({
    url: '/user/profile',
    method: 'post',
    data: data
  })
}

export function changeProfile(data) {
  data["uid"] = getToken()
  return request({
    url: '/user/changeProfile',
    method: 'post',
    data: data
  })
}

export function changeImg(data) {
  data["uid"] = getToken()
  return request({
    url: '/user/getAllUser',
    method: 'post',
    data
  })
}


export function deleteUser(data, token) {
  return request({
    url: '/user/deleteUser',
    method: 'post',
    headers: { token: getToken() },
    data: data
  })
}
