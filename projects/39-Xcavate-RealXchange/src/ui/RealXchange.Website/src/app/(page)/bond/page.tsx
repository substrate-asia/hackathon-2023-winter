import { SectionHeader, SectionTitle } from '@/components/section-header';
import { Shell } from '@/components/shells/shell';

export default function Bond() {
  return (
    <Shell>
      <SectionHeader className=" gap-[36px]">
        <SectionTitle>Projects</SectionTitle>
      </SectionHeader>
    </Shell>
  );
}
