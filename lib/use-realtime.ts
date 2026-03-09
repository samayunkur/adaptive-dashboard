import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// リアルタイム更新設定
const REALTIME_CONFIG = {
  // 3秒ごとに自動更新
  refreshInterval: 3000,
  // フォーカス時に再取得
  revalidateOnFocus: true,
  // 再接続時に再取得
  revalidateOnReconnect: true,
  // ウィンドウ表示時に再取得
  revalidateIfStale: true,
};

// カウンター用フック
export const useCounters = () => {
  const { data, error, mutate } = useSWR(
    '/api/data?type=counter&action=get',
    fetcher,
    REALTIME_CONFIG
  );

  return {
    counters: data || {},
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

// アクティビティ用フック
export const useActivities = (type?: string) => {
  const url = type 
    ? `/api/data?type=activity&action=get&data[type]=${type}`
    : '/api/data?type=activity&action=get';
  
  const { data, error, mutate } = useSWR(url, fetcher, REALTIME_CONFIG);

  return {
    activities: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

// マイルストーン用フック
export const useMilestones = () => {
  const { data, error, mutate } = useSWR(
    '/api/data?type=milestone&action=get',
    fetcher,
    REALTIME_CONFIG
  );

  return {
    milestones: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

// TODO用フック
export const useTodos = () => {
  const { data, error, mutate } = useSWR(
    '/api/data?type=todo&action=get',
    fetcher,
    REALTIME_CONFIG
  );

  return {
    todos: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

// レイアウト用フック
export const useLayout = () => {
  const { data, error, mutate } = useSWR(
    '/api/data?type=layout&action=get',
    fetcher,
    REALTIME_CONFIG
  );

  return {
    layout: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

// 全データ用フック
export const useAllData = () => {
  const { data, error, mutate } = useSWR('/api/data', fetcher, REALTIME_CONFIG);

  return {
    data: data || {},
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
