import { PaginationDto, PaginationResponse } from '../dto/pagination.dto';

export class PaginationTransformer {
  static createPaginationMeta(page: number, limit: number, total: number) {
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      page,
      limit,
      total,
      totalPages,
      hasNext,
      hasPrev,
    };
  }

  static toPaginatedResponse<T>(
    data: T[],
    paginationDto: PaginationDto,
    total: number,
  ): PaginationResponse<T> {
    const { page = 1, limit = 10 } = paginationDto;

    return {
      data,
      pagination: this.createPaginationMeta(page, limit, total),
    };
  }
}
