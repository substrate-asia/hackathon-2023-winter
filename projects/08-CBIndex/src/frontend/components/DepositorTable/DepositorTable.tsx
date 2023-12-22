import React from "react";
import { Table } from "antd";
import FormatTime from "../../components/Time/FormatTime";
const DepositorTable = ({ DepositorList }: any) => {
    const columns = [
        {
            title: 'Wallet Address',
            dataIndex: 'depositor_address',
            key: 'depositor_address',
        },
        {
            title: 'Percentage',
            dataIndex: 'percentage',
            key: 'percentage',
            render: (text: number) => {
                return <>{(text * 100).toFixed(2)}%</>
            }
        },
        {
            title: 'Share Size',
            dataIndex: 'shares_num',
            key: 'shares_num',
        },
        {
            title: 'create At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: any) => {
                return <FormatTime time={text} />
            }
        },
    ];


    return <>
        <Table dataSource={DepositorList} columns={columns} />
    </>
}

export default DepositorTable;