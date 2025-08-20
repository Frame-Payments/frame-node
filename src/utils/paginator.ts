export async function* paginate<T>(
  fetchPage: (page: number) => Promise<{ data: T[]; meta?: { has_more?: boolean } }>,
  pageSize = 20
): AsyncGenerator<T> {
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const { data, meta } = await fetchPage(page);
    for (const item of data) {
      yield item;
    }

    hasMore = meta?.has_more ?? false;
    page += 1;
  }
}