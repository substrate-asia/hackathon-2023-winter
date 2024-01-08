import React, { useEffect, useState } from "react";
import VaultsTable from "../../components/TableType/VaultsTable/VaultsTable";
import { getVaultsListApi } from '../../src/pages/api/api'
import classes from './style.module.less'
import { useAccount } from "wagmi";
const VaultsPage = () => {
    const { address } = useAccount()
    const [dataSource, setDataSource] = useState([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    useEffect(() => {
        setLoading(true)
        getVaultsListApi(page).then(d => {
            setDataSource(d.data.items)
            setTotal(d.data.total)
            setLoading(false)
        })
    }, [page])
    return <>
        <div>
            <div className={ classes.pageTitle}>
                Fund List
            </div>
            <VaultsTable dataSource={dataSource} loading={loading} total={total} setPage={setPage} address={address} />
        </div>
    </>
}

export default VaultsPage;