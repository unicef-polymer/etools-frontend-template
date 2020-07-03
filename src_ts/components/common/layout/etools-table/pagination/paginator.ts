export interface EtoolsPaginator {
  page: number;
  page_size: number;
  total_pages: number;
  count: number;
  visible_range: string[] | number[];
}

export const defaultPaginator: EtoolsPaginator = {
  page: 1,
  page_size: 20,
  total_pages: 0,
  count: 0,
  visible_range: []
};

const updatePaginatorTotalResults = (data: any) => {
  if (data && data.count) {
    const count = parseInt(data.count, 10);
    if (!isNaN(count)) {
      return count;
    }
  }
  return 0;
};

const computeTotalPages = (pageSize: number, totalResults: number) => {
  return pageSize < totalResults ? Math.ceil(totalResults / pageSize) : 1;
};

const computeVisibleRange = (paginator: EtoolsPaginator) => {
  let start = 1;
  let end = paginator.count;
  if (!paginator.count) {
    start = 0;
  } else {
    if (paginator.page !== 1) {
      start = (paginator.page - 1) * paginator.page_size + 1;
    }
    if (paginator.page !== paginator.total_pages) {
      end = start + (paginator.count < paginator.page_size ? paginator.count : paginator.page_size) - 1;
    }
  }

  return [start, end];
};

export const getPaginator = (currentPaginator: EtoolsPaginator, data: any) => {
  // init paginator
  const paginator: EtoolsPaginator = {...currentPaginator};
  paginator.count = updatePaginatorTotalResults(data);
  paginator.total_pages = computeTotalPages(paginator.page_size, paginator.count);
  paginator.visible_range = computeVisibleRange(paginator);
  return paginator;
};
