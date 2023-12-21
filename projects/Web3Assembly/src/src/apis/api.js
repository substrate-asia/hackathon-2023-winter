import { MyRequest } from "./request";

async function AddNodeReq(name, content) {
    return MyRequest.post({
        url: '/add_node',
        data: { name, content }
    });
}

async function UpdateNodeReq(id, src_id, name, content) {
    return MyRequest.post({
        url: '/update_node',
        data: { id, src_id, name, content }
    });
}

async function AddEdgeReq(src_id, tar_id, desc) {
    return MyRequest.post({
        url: '/add_edge',
        data: { src_id, tar_id, desc }
    });
}

async function GetNodeVersionListReq(node_id) {
    return MyRequest.post({
        url: '/get_node_version_list',
        data: { node_id }
    });
}

async function GetVersionReq(node_id, version_id) {
    return MyRequest.post({
        url: '/get_version',
        data: { node_id, version_id }
    });
}

async function GetGraphReq() {
    return MyRequest.post({
        url: '/get_graph',
        data: { }
    });
}

export {
    AddNodeReq,
    UpdateNodeReq,
    GetGraphReq,
    GetVersionReq,
    GetNodeVersionListReq,
    AddEdgeReq
}