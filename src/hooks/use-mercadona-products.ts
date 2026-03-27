"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useMercadonaProducts(categoryId: number | null) {
  const { data, error, isLoading } = useSWR(
    categoryId ? `/api/mercadona/products/${categoryId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    category: data,
    isLoading,
    isError: error,
  };
}
