import Cookies from 'js-cookie'
const TokenKey = 'tieProtocol_uid'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getNameToken() {
  return Cookies.get('tie-username')
}

export function setNameToken(token) {
  return Cookies.set('tie-username', token)
}
