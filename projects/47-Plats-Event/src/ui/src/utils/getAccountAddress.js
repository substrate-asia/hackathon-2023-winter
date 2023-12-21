export const getAccoutAddress = () => {
    return JSON.parse(localStorage.getItem("CreateNFT"))?.address;
}