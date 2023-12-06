import { ROUND_LIST_DATA } from "@/fixtures/roundList";
import RoundCard from "@/components/card/round";
import ListLayout from "@/components/layouts/listLayout";

export default function HomePage() {
  return (
    <ListLayout title="Program Rounds" description="How OpenQF Works">
      <div className="space-y-5">
        {ROUND_LIST_DATA.map((data, idx) => (
          <RoundCard key={idx} data={data} />
        ))}
      </div>
    </ListLayout>
  );
}
