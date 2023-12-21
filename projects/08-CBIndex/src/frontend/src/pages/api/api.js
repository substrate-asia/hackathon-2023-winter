import Ajax from "./Ajax";

export const getVaultsListApi = (page) => {
    return Ajax("/v1/vault_list?page=" + page + "&pageSize=10");
}
export const getVaultsDetailsApi = (address) => {
    return Ajax("/v1/vault/" + address);
}

export const getVaultsPortfolioApi = (address) => {
    return Ajax("/v1/portfolio/" + address);
}

export const getActiveListApi = (guardianAddress, operation, page) => {
    return Ajax("/v1/activity_list?page=" + page + "&pageSize=4&guardianAddress=" + guardianAddress + "&operation=" + operation);
}

export const getDepositorApi = (vaultAddress) => {
    return Ajax("/v1/depositor_list?page=1&pageSize=100&vaultAddress=" + vaultAddress);
}

export const claimFaucetApi = (address) => {
    return Ajax({
        url: "/v1/faucet/" + address,
        method: "POST"
    });
}

export const vaultLineDataApi = (vaultAddress, time) => {
    return Ajax("/v1/vault_time_series?vaultAddress=" + vaultAddress + "&period=" + time);
}

export const getvault_confApi = () => {
    return Ajax("/v1/vault_conf");
}