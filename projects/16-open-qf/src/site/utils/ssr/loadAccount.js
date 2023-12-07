import Cookies from "cookies";

export function loadAccount(context) {
  let account = null;
  const cookies = new Cookies(context.req, context.res);
  const cookieAddress = cookies.get("address");
  if (cookieAddress) {
    const [network, address] = cookieAddress.split("/");
    account = {
      address,
      network,
    };
  }

  return {
    account,
  };
}
