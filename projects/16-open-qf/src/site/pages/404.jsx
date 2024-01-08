import Link from "next/link";
import { withCommonPageWrapper } from "@/utils/ssr";
import StaticLayout from "@/components/layouts/staticLayout";
import Divider from "@/components/divider";
import { cn } from "@/utils";
import { PlaceholderPageNotFound } from "@osn/icons/opensquare";

function Content({ className, children }) {
  return (
    <div
      className={cn(
        "w-full max-w-7xl",
        "mx-auto",
        "px-8",
        "max-sm:px-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

const _404 = withCommonPageWrapper(() => {
  return (
    <StaticLayout>
      <div className="my-20 max-sm:my-10">
        <Content>
          <div className="flex flex-col gap-[20px]">
            <PlaceholderPageNotFound className="w-[80px] h-[80px]" />
            <h2 className="text24bold text-text-primary">Page Not Found</h2>
          </div>
        </Content>
        <Divider className="my-[40px]" />
        <Content>
          <div className="flex flex-col gap-[20px]">
            <p className="text-text-secondary text16semibold">
              Sorry. the content you’re looking for doesn’t exist.
              <br />
              Either it was removed, or you mistyped the link.
            </p>
            <div>
              <Link
                href="/"
                className="inline-block px-[16px] py-[10px] border border-stroke-action-default text-text-primary text14semibold"
              >
                Back to Homepage
              </Link>
            </div>
          </div>
        </Content>
      </div>
    </StaticLayout>
  );
});

export default _404;
