import { createContext } from 'react';

type QueryContextType = {
  query: string;
  setQuery: (query: string) => void;
};

const QueryContext = createContext<QueryContextType>({
  query: '',
  setQuery: () => {},
});

export default QueryContext;
