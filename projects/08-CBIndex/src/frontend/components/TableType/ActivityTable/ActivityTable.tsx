import React from "react";
import classes from './style.module.less'
import icon from '../../../utils/TokenIcon/Icon.json'
import { ServerAssetes } from '../../../utils/consts/Consts'
import { splitString } from '../../../utils/String/splitAddress'
import { Avatar } from "antd"
import Image from "next/image";
import cbiLogo from '../../../public/logo/cbi_logo.png'
import FormatTime from "../../Time/FormatTime";
import { Tooltip } from 'antd'
import { getImageUrl } from '../../../utils/TokenIcon/getIconImage'
const ActivityTable = ({ activityList, vaultInfo }: any) => {
    const redemptionFuc = (array: any) => {
        let obj = { amount: 0, sharesRedeemed: 0 }
        for (let i = 0; i < array.length; i++) {
            obj.amount = obj.amount + (Number(array[i].amountUsd) / Number(array[i].denominationAssetPrice))
            obj.sharesRedeemed = obj.sharesRedeemed + Number(array[i].sharesRedeemed)

        }
        return obj
    }
    const toolTipText = (array: any) => {
        let text = ""
        text = array.map((item: any) => {
            return <div style={{
                display: "flex"
            }}>
                {item.asset.symbol}<Avatar className={classes.avatar} src={`${ServerAssetes.Icon + getImageUrl(item.asset.symbol)}`} /> Amount: {(item.amountUsd / item.denominationAssetPrice).toFixed(2)}
            </div>
        })
        return text
    }
    return <>
        <div>
            {activityList.map((item: any) => {
                return <div>
                    <div className={classes.activeCardBox}>
                        <div className={classes.left}>
                            <div className={classes.leftTop}>
                                <div className={classes.leftItemBox} >
                                    <FormatTime time={item.createdAt} />
                                    <Image src="/icon/share.png" width={15} height={15} alt="Block"
                                        style={{
                                            marginLeft: "5px",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => {
                                            window.open(`${JSON.parse(localStorage.getItem("chainInfo") as any).chainConf.blockExplorer}tx/${item.txHash}`)
                                        }}
                                    />
                                </div>

                                {/* Type */}
                                <div className={classes.actionType}>
                                    {item.operation}
                                </div>
                            </div>
                            <div className={classes.leftBottom}>
                                <div>
                                    {vaultInfo.name}
                                </div>
                                <div className={classes.leftItemBox} >
                                    {vaultInfo.vaultAddress} <Image src="/icon/share.png" width={15} height={15} alt="Block"
                                        style={{
                                            marginLeft: "5px",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => {
                                            window.open(`${JSON.parse(localStorage.getItem("chainInfo") as any).chainConf.blockExplorer}address/${vaultInfo.vaultAddress}`)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        {item.operation === "Swap" &&
                            <div className={classes.right}>
                                {/* outgoingAsset */}
                                <div className={classes.rightItem}>
                                    <div>
                                        Protocol
                                    </div>
                                    <div className={classes.cardRightInfo}>
                                        Uniswap V2 <Avatar className={classes.avatar} src={`${ServerAssetes.Icon}coins/images/thumb/uniswap-uni.png`} />
                                    </div>
                                </div>
                                {/* outgoingAsset */}
                                <div className={classes.rightItem}>
                                    <div>
                                        Outgoing Asset

                                    </div>
                                    <div className={classes.cardRightInfo}>
                                        {Number(item.detail.outgoingAssetAmount).toFixed(8)}  {item.detail.outgoingAsset.symbol}    <Avatar className={classes.avatar} src={`${ServerAssetes.Icon + getImageUrl(item.detail.outgoingAsset.symbol)}`} />
                                    </div>
                                </div>
                                {/*incomingAsset*/}
                                <div className={classes.rightItem}>
                                    <div>
                                        Shares Received
                                    </div>
                                    <div>
                                        {Number(item.detail.incomingAssetAmount).toFixed(2)} {item.detail.incomingAsset.symbol} <Avatar className={classes.avatar} src={`${ServerAssetes.Icon + getImageUrl(item.detail.incomingAsset.symbol)}`} />
                                    </div>
                                </div>
                                {/* Depositor  */}
                                <div className={classes.rightItem}>
                                    <div>
                                        Depositor
                                    </div>
                                    <div>
                                        {splitString(item.detail.caller)}
                                        <Image src="/icon/share.png" width={15} height={15} alt="Block"
                                            style={{
                                                marginLeft: "var(--margin-sm)",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => {
                                                window.open(`${JSON.parse(localStorage.getItem("chainInfo") as any).chainConf.blockExplorer}address/${item.detail.caller}`)
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        }
                        {item.operation === "Redemption" && <div className={classes.right}>
                            {/* outgoingAsset */}
                            <div className={classes.rightItem}>
                                <div>
                                    Amount
                                </div>
                                <div className={classes.cardRightInfo}>
                                    <Tooltip placement="topLeft" title={toolTipText(item.detail)}>
                                        {redemptionFuc(item.detail).amount.toFixed(8)}
                                        {" DAI"}  <Avatar className={classes.avatar} src={`${ServerAssetes.Icon + icon["DAI" as keyof typeof icon]}`} />
                                    </Tooltip>
                                </div>
                            </div>
                            {/*incomingAsset*/}
                            <div className={classes.rightItem}>
                                <div>
                                    {item.operation === "Redemption" ? "Shares Redeemed" : "Shares  Received"}
                                </div>
                                <div className={classes.cardRightInfo}>
                                    {redemptionFuc(item.detail).sharesRedeemed.toFixed(2)}  <Image alt="icon" className={classes.avatar} src={cbiLogo} />
                                </div>
                            </div>
                            {/*Depositor  */}
                            <div className={classes.rightItem}>
                                <div>
                                    Operator
                                </div>
                                <div className={classes.cardRightInfo}>
                                    {splitString(item.detail[0].redeemer)}
                                    <Image src="/icon/share.png" width={15} height={15} alt="Block"
                                        style={{
                                            marginLeft: "var(--margin-sm)",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => {
                                            window.open(`${JSON.parse(localStorage.getItem("chainInfo") as any).chainConf.blockExplorer}address/${item.detail[0].redeemer}`)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        }
                        {item.operation === "Deposit" && <div className={classes.right}>
                            {/* outgoingAsset */}
                            <div className={classes.rightItem}>
                                <div>
                                    Amount
                                </div>
                                <div className={classes.cardRightInfo}>
                                    {Number(item.detail.amount).toFixed(8)}  {item.detail.asset.symbol}  <Avatar className={classes.avatar} src={`${ServerAssetes.Icon + getImageUrl(item.detail.asset.symbol)}`} />
                                </div>
                            </div>
                            {/*incomingAsset*/}
                            <div className={classes.rightItem}>
                                <div>
                                    {item.operation === "Redemption" ? "Shares Redeemed" : "Shares  Received"}
                                </div>
                                <div className={classes.cardRightInfo}>
                                    {item.detail.sharesReceived ? Number(item.detail.sharesReceived).toFixed(2) : Number(item.detail.sharesRedeemed).toFixed(2)}  <Image alt="icon" className={classes.avatar} src={cbiLogo} />
                                </div>
                            </div>
                            {/*Depositor  */}
                            <div className={classes.rightItem}>
                                <div>
                                    Operator
                                </div>
                                <div className={classes.cardRightInfo}>
                                    {splitString(item.detail.depositor ? item.detail.depositor : item.detail.redeemer)}
                                    <Image src="/icon/share.png" width={15} height={15} alt="Block"
                                        style={{
                                            marginLeft: "var(--margin-sm)",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => {
                                            window.open(`${JSON.parse(localStorage.getItem("chainInfo") as any).chainConf.blockExplorer}address/${item.detail.depositor}`)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>}
                    </div>
                </div>
            })
            }
        </div>
    </>
}

export default ActivityTable;