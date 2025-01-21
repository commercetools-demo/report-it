import 'graphiql/graphiql.css';
import './graphiql-overrides.css';
import { useMemo } from 'react';
import { GraphiQL } from 'graphiql';
import type { TGraphQLTargets } from '@commercetools-frontend/constants';
import explorerPlugin from './plugin-explorer';
import QueryContext from './query-context';
import { useGraphQlFetcher } from '../../../hooks/use-graph-ql-fetcher';

type TEditorProps = {
  target: TGraphQLTargets;
  query: string;
  variables: string;
  onUpdateQuery: (query: string) => void;
  onUpdateVariables: (variables: string) => void;
};

const Editor = ({
  query,
  variables,
  target,
  onUpdateQuery,
  onUpdateVariables,
}: TEditorProps) => {
  const context = useMemo(() => ({ query, setQuery: onUpdateQuery }), [query]);

  const { fetcher } = useGraphQlFetcher();
  return (
    <QueryContext.Provider value={context}>
      <GraphiQL
        fetcher={fetcher}
        query={query}
        onEditQuery={onUpdateQuery}
        onEditVariables={onUpdateVariables}
        variables={variables}
        plugins={[explorerPlugin]}
        maxHistoryLength={0}
        disableTabs
      />
    </QueryContext.Provider>
  );
};
Editor.displayName = 'Editor';

export default Editor;
