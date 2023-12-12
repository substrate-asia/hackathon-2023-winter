import Card from "@/components/card";
import { Button } from "@/components/button";
import { RoundCardMetadata } from "@/components/card/round";
import { abbreviateBigNumber, toPrecision } from "@osn/common";
import { DECIMALS } from "@/utils/constants";
import { cn } from "@/utils";

export default function RoundProjectInfo({ data }) {
  return (
    <div
      className={cn("grid grid-cols-3 gap-5", "max-sm:flex max-sm:flex-col")}
    >
      <Card
        className="col-span-2"
        head={
          <div>
            <RoundCardMetadata data={data} />

            <p className="mt-4 text-text-secondary text14medium">
              {data.description}
            </p>
          </div>
        }
      >
        <div className="flex justify-between gap-4">
          <div className="space-y-1">
            <div className="text14medium text-text-tertiary">
              Program Funders
            </div>
            <div className="text16semibold text-text-primary">
              {data.founders?.[0]}
            </div>
          </div>
          <div className="flex items-end justify-end">
            <Button>Apply</Button>
          </div>
        </div>
      </Card>

      <div className="col-span-1">
        <Card className="text-center h-full">
          <div className="w-full h-full flex gap-5 flex-col items-center justify-center">
            <div className="">
              <div className="text14medium text-text-tertiary">
                Matching Pool
              </div>
              <div className="text24bold text-text-primary">
                {abbreviateBigNumber(toPrecision(data.asset.amount, DECIMALS))}{" "}
                {data.asset.id}
              </div>
            </div>
            <div>
              <div className="text14medium text-text-tertiary">
                Total Contributors
              </div>
              <div className="text24bold text-text-primary">
                {data.contributors || " TODO"}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
