import { useHistory, useLocation } from 'react-router-dom';
export const useEasyParams = () => {
  const history = useHistory();
  const location = useLocation();
  const setParam = (key: string, value: string) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set(key, value);

    history.push({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  const clearParam = (key: string) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete(key);

    history.push({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  const getParam = (key: string) => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get(key);
  };
  return { setParam, clearParam, getParam };
};
