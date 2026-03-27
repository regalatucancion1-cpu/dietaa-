const MERCADONA_API = "https://tienda.mercadona.es/api";

export async function fetchMercadonaCategory(categoryId: number) {
  const res = await fetch(`${MERCADONA_API}/categories/${categoryId}/`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Mercadona API error: ${res.status}`);
  }

  return res.json();
}

export async function fetchMercadonaCategories() {
  const res = await fetch(`${MERCADONA_API}/categories/`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Mercadona API error: ${res.status}`);
  }

  return res.json();
}
