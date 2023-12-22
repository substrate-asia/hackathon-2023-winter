import React from "react";
import { Table } from "antd";
import icon from "../../../utils/TokenIcon/Icon.json";
import { Avatar, Spin } from "antd";
import Link from "next/link";
import { ServerAssetes } from "../../../utils/consts/Consts";
import classes from "./style.module.less";
import { getImageUrl } from '../../../utils/TokenIcon/getIconImage'
function truncateString(inputString: any, maxLength: Number) {
  if (inputString.length > maxLength) {
    return inputString.substring(0, maxLength) + '...';
  }
  return inputString;
}


const VaultsTable = ({ dataSource, loading, total, setPage, address }: any) => {
  const columns = [
    {
      title: "Fund Name",
      dataIndex: "name",
      key: "name",
      render: (text: any, row: any) => {
        return <div className={classes.fundNameColumn}>
          {truncateString(text, 20)}
          {row.owner === address && <div className={`${classes.myFundTag} myCreateLabel`}>My Fund</div>}
        </div>
      },
    },
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
      render: (text: any, row: any) => {
        return <>
          <div >
            {truncateString(text, 10)}
          </div>
        </>
      }
    },
    {
      title: "Denomination Asset",
      dataIndex: "denominationAssetAddress",
      key: "denominationAssetAddress",
      render: (text: any, row: any) => {
        return (
          <div className={classes.denominationAssetColumn}>
            <Avatar
              src={`${ServerAssetes.Icon + getImageUrl(row.denominationAsset.symbol)}`}
              className={classes.avatar}
            />
            {row.denominationAsset.symbol}
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text: any, row: any) => {
        return (
          <>
            <Link href={"/activefund/vaults/details?vaultAddress=" + row.vaultAddress}>
              Detail
            </Link>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Spin spinning={loading} tip="Loading blockchain data...">
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={{
            pageSize: 10,
            total: total,
          }}
          onChange={(v) => {
            setPage(v.current);
          }}
        />
      </Spin>
    </>
  );
};

export default VaultsTable;
