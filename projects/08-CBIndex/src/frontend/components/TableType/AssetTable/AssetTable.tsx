import React from "react";
import { Table, Avatar } from "antd";
import icon from "../../../utils/TokenIcon/Icon.json";
import { ServerAssetes } from "../../../utils/consts/Consts";
import classes from "./style.module.less";
import { getImageUrl } from '../../../utils/TokenIcon/getIconImage'
const AssetTable = ({ assetList }: any) => {
  const columns = [
    {
      title: "Token",
      dataIndex: "asset",
      key: "asset",
      render: (text: any, row: any) => {
        return (
          <div className={classes.denominationAssetColumn}>
            <Avatar
              src={`${ServerAssetes.Icon + getImageUrl(row.asset.symbol)}`}
              className={classes.avatar}
            />
            {row.asset.symbol}
          </div>
        );
      },
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
    },
  ];

  return <Table dataSource={assetList} columns={columns} />;
};

export default AssetTable;
