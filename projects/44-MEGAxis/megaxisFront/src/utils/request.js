import axios from 'axios'
// todo：可切换其他ui而不是element
//import { getToken } from '@/utils/auth'
// import base_url from '@/api/base_url'

const base_url = "http://52.199.77.200:8000"
// create an axios instance
const service = axios.create({
  baseURL: base_url, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

//  request interceptor
//  service.interceptors.request.use(
//   config => {
//      do something before request is sent
//
//      if (store.getters.token) {
//        let each request carry token
//        ['X-Token'] is a custom headers key
//        please modify it according to the actual situation
//       config.headers['X-Token'] = getToken()
//     }
//     return config
//   },
//   error => {
//     // do something with request error
//     console.log(error) // for debug
//     return Promise.reject(error)
//   }
// )

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.

    if (response.headers['content-type'] === 'application/octet-stream') {
      return response
    } else if (response.data.size > 0) {
      const reader = new FileReader()
      reader.addEventListener('loadend', function() {
        const r = JSON.parse(reader.result)
        // Message({
        //   message: r.msg || 'Error',
        //   type: 'error',
        //   duration: 5 * 1000
        // })
      })
      reader.readAsText(response.data, 'utf-8')
      return Promise.reject('error')
    } else if (res.code !== 0) {
      if (res.code >= 1000 && res.code <= 1019) {
        // 需要重新登录的报错
        // MessageBox.confirm('用户登录超时，请重新登录', 'Confirm logout', {
        //   confirmButtonText: '重新登录',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   // todo: 重新登录， disconnect wallet即可
        // })
      }
      // if (res.code % 100 >= 20 && res.code % 100 <= 39) {
      //   // 有data返回数据的报错
      //   Message({
      //     dangerouslyUseHTMLString: true,
      //     message: res.msg + '<br>' + res.data,
      //     type: 'error',
      //     duration: 5 * 1000
      //   })
      // } else {
      //   Message({
      //     message: res.msg || 'Error',
      //     type: 'error',
      //     duration: 5 * 1000
      //   })
      // }
      return Promise.reject(res)
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service
