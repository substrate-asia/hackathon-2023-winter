import { LogoIpfs, LogoIpfsActive } from "@osn/icons/opensquare";

export default function IpfsButton({ cid }) {
  return (
    <a
      className="cursor-pointer w-[20px] h-[20px] group"
      href={`${process.env.NEXT_PUBLIC_IPFS_ENDPOINT}${cid}`}
      target="_blank"
      rel="noreferrer"
    >
      <LogoIpfsActive className="hidden group-hover:block" />
      <LogoIpfs className="group-hover:hidden" />
    </a>
  );
}
