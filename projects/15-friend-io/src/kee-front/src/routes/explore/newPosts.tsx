import { useLazyGetTwitterListLastQuery } from "@/app/services/user";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import { ViewportList } from "react-viewport-list";
import GoBackNav from "@/components/GoBackNav";
import { TwitterUserInfo } from "@/types/user";
import Ui from "@/app/slices/ui";
import { getContract } from "../wallet";
import { useLazyGetWalletByUidQuery } from "@/app/services/user";
import { convertToRelativeTime } from "@/utils";

function newPostPage() {
  const ref = useRef<HTMLUListElement | null>(null);
  const [getWalletByUid, { data: wallet }] = useLazyGetWalletByUidQuery();
  const buyShare = async (uid: number) => {
    const contract = getContract();
    // 检查用户钱包地址是否存在.
    let shareWalletResult = await getWalletByUid(uid);
    let shareWallet = shareWalletResult.data;
    console.log("shareWallet is %s", shareWallet);
    // console.log("shareWallet is:" + shareWallet);
    if (shareWallet) {
      // 得到用户的购买价格
      let buyPriceAfterFee = await contract.getBuyPriceAfterFee(shareWallet, 1);
      // 去购买用户的share
      console.log("buyPriceAfterFee is:  " + buyPriceAfterFee);
      let shareSupply = await contract.sharesSupply(shareWallet);
      console.log("shareSupply is:%d", shareSupply);
      // const result = await contract.buyShares.staticCall(
      //   "0xeA398f3037b3F7EE32BC7E1FABBF66cf22Bb537E",
      //   1
      // );
      const result = await contract.buyShares(shareWallet, 1, {
        value: buyPriceAfterFee
      });
      console.log("result is:" + JSON.stringify(result));
    }
  };
  const [
    getNewTwitterInfo,
    { isLoading: usersLoading, isSuccess: usersSuccess, isError: usersError, data: twitterUsers }
  ] = useLazyGetTwitterListLastQuery();

  useEffect(() => {
    getNewTwitterInfo();
  }, []);

  return (
    <ul
      className="flex flex-col gap-1 w-full md:w-[512px] mb-44 max-h-[800px] overflow-y-scroll"
      ref={ref}
    >
      <ViewportList viewportRef={ref} items={twitterUsers}>
        {(twitterUser: TwitterUserInfo) => {
          return (
            <li
              key={twitterUser.uid}
              onClick={buyShare.bind(null, twitterUser.uid)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md md:hover:bg-slate-50 md:dark:hover:bg-gray-800"
            >
              <div className="flex gap-4 items-stretch">
                <img
                  className="overflow-hidden rounded-full h-12 w-12"
                  src={twitterUser.profile_image_url}
                  alt=""
                />
                <div className="flex flex-col justify-center">
                  <span className="font-bold text-md text-gray-600 dark:text-white flex items-center gap-1">
                    {twitterUser.username}
                  </span>
                  <div className="flex">
                    <span className="text-sm text-gray-600 dark:text-white flex items-center gap-1">
                      Created: {convertToRelativeTime(twitterUser.created_time)}&nbsp;
                    </span>
                    <span className="text-sm text-gray-600 dark:text-white flex items-center gap-1">
                      | Price: {twitterUser.price / 1000000000000}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          );
        }}
      </ViewportList>
    </ul>
  );
}

export default newPostPage;
