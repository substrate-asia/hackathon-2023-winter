import { SectionHeader, SectionTitle } from '@/components/section-header';
import { Shell } from '@/components/shells/shell';
import { Projects } from '@/sections/projects/projects';

export default function Page() {
  return (
    <Shell>
      <SectionHeader className=" gap-[36px]">
        <SectionTitle>Active projects.</SectionTitle>
      </SectionHeader>
      <Projects />
    </Shell>
  );
}
