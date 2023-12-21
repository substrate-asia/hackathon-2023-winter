import icon from './Icon.json'
import allIcon from './coin_info.json'
export const getImageUrl = (symbol) => {
    let url = ""
    if (icon[symbol]) {
        url = icon[symbol]
    } else {
        url = allIcon[JSON.parse(localStorage.getItem("chainInfo")).nativeToken.coingeckoId].image_url
    }
    return url
}