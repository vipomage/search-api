/**
 * total: number of matching results
 *
 * pageSize: the page size passed by the calling party
 *
 * currentPage: the page index passed by the calling party
 *
 * pages: total number of result pages available based on the page size and total matching results
 */
export interface PaginationModel<T> {
	items: T[];
	total: number;
	pageSize: number;
	currentPage: number;
	pages: number;
}
