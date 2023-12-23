import { config } from "./config.js";

export function getCode(id) {
    return `<script src="${config.rpcUrl}/${id}"></script>`
}