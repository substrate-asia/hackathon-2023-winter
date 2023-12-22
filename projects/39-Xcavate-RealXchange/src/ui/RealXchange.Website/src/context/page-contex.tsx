'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type InitialStateProps = {
  page: string;
  project?: any;
};

export type PageContextProps = {
  page: string;
  project?: any;
};

const PageContext = createContext<any | null>(null);

export function usePageContext() {
  return useContext(PageContext);
}

export interface PageProps {
  /**
   * The default value.
   */
  index: string;
  children?: React.ReactNode;
}

export default function PageContextProvider({ index, children }: PageProps) {
  // const [selectedPage, setSelectedPage] = useState<string>(index);
  const [state, setState] = useState<InitialStateProps>({ page: index, project: {} });

  // change page to selected page
  const setPageValues = useCallback(
    (value: InitialStateProps) => {
      setState({
        ...value
      });
    },
    [setState]
  );

  const contextValue = useMemo(() => {
    return { ...state, setPageValues };
  }, [state, setPageValues]);

  return <PageContext.Provider value={contextValue}>{children}</PageContext.Provider>;
}
