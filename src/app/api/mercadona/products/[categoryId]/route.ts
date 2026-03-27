import { NextResponse } from "next/server";

const MERCADONA_API = "https://tienda.mercadona.es/api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  const { categoryId } = await params;

  try {
    const res = await fetch(`${MERCADONA_API}/categories/${categoryId}/`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Error fetching products" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error connecting to Mercadona" },
      { status: 500 }
    );
  }
}
