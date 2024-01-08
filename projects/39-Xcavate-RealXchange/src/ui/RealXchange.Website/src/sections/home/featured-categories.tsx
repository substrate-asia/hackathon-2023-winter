import { Icons } from '@/components/icons';
import { featuredProjects } from '@/config/project';
import Image from 'next/image';
import Link from 'next/link';

export default function FeaturedCategories() {
  return (
    <div className="grid w-full grid-cols-3 gap-x-4">
      {featuredProjects.map(project => {
        const Icon = Icons[project.category ?? ''];
        return (
          <Link
            href={project.category}
            key={project.image}
            className="flex h-[234px] w-[250px] flex-col items-start gap-4 rounded-lg bg-primary-light px-2 pb-6 pt-2 shadow-feature-card"
          >
            <Image
              src={project.image}
              alt={project.title}
              width={236}
              height={178}
              priority
            />

            <div className="flex w-full items-center justify-between">
              <h4 className="text-[ 0.75rem;] font-unbounded">{project.category}</h4>
              <Icon className=" h-3.5 w-3.5" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
