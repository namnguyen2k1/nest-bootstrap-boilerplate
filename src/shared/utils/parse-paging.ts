import { PagingDTO } from "@shared/dto/paging.dto";

export function parsePaging(dto: PagingDTO) {
  let offset: number = dto?.offset ?? 0;
  if (offset < 0) offset = 0;

  let limit: number = dto?.limit ?? 20;
  if (limit < 0) limit = 20;
  if (limit > 100) limit = 100;

  let sort: Record<string, 1 | -1> = dto?.sort ?? { createdAt: -1 };
  if (!Object.keys(dto?.sort).length) {
    sort = { createdAt: -1 };
  }

  return { offset, limit, sort };
}
