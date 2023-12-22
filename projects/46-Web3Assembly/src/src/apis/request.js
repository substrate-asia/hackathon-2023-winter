import Vue from 'vue'
import axios from 'axios'

const vue = new Vue()

export const BACKEND_API = "http://124.220.1.170:8080"
export const TIME_OUT = 3000

export function request(config) {
    const service = axios.create({
        baseURL: BACKEND_API,
        timeout: TIME_OUT,
    });
    service.interceptors.request.use(config => {
        return config
    }, err => { return err });
    service.interceptors.response.use(res => {
        if (res.status !== 200) {
            console.log('请求遇到问题，请重试');
        }
        // 特殊处理下载文件(加参数 -> responseType: blob)
        if (config.responseType === 'blob') {
            blobToFile(res.data, config.fileName)
        }
        return res;
    }, err => {
        vue.$message.error(err.response.data.message) // 后端报错提示
        return err;
    });
    return service(config);
}

export const MyRequest = {
    post(config) {
        return request({
            ...config,
            method: 'POST',
        });
    },
    get(config) {
        return request({
            ...config,
            method: 'GET',
        });
    },
    patch(config) {
        return request({
            ...config,
            method: 'PATCH',
        })
    },
    put(config) {
        return request({
            ...config,
            method: 'PUT',
        })
    },
    delete(config) {
        return request({
            ...config,
            method: 'DELETE',
        })
    }
}

const blobToFile = function (blob, fileName) {
    const blobs = new Blob([blob])
    var a = document.createElement('a')
    a.href = URL.createObjectURL(blobs)
    a.download = fileName
    vue.$message.success('下载成功')
    document.body.appendChild(a)
    a.click()
    a.remove()
}
  
