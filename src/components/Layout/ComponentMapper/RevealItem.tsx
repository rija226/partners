import type { ReactNode } from "react";
import { useInView } from "@/src/hooks/useInView";
import { GridItem } from "@components/CmsPage/CmsPage.style";

// mapComponents (ComponentMapper.tsx) is a plain function, not a component — it can't call
// useInView itself (hooks need an actual component instance per call). Wrapping each block in
// its own <RevealItem> gives every one its own hook call, which is the normal/correct way to
// use hooks across a list of items.
export default function RevealItem({ fullWidth, children }: { fullWidth: boolean; children: ReactNode }) {
  const { ref, inView } = useInView();
  return (
    <GridItem ref={ref} $fullWidth={fullWidth} $visible={inView}>
      {children}
    </GridItem>
  );
}
