import DetailContent from "./detailContent";
import DetailHeader from "./detailHeader";
import Cover from "./detailCover";
// import Appendant from "./appendant";
import Sharing from "./sharing";
// import styled from "styled-components";
import Divider from "@/components/divider";
// import Actions from "./actions";

export default function ProjectDetail() {
  return (
    <div className="flex flex-col w-full shadow-shadow-card-default">
      <Cover />
      <div className="flex flex-col p-[32px] pt-[56px] gap-[20px]">
        <DetailHeader />
        <Divider />
        <DetailContent />
        <Divider />
        {/* <Appendant /> */}
        <Sharing />
        {/* <Actions /> */}
      </div>
    </div>
  );
}
