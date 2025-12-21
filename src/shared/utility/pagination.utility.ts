import { FilterDto, SortOrder } from '../dto/filter.dto';

export class PaginationUtility {
    static getPrismaOptions(filter: FilterDto) {
        const page = filter.page || 1;
        const limit = filter.limit || 10;
        const skip = (page - 1) * limit;

        // Sort logic can be complex if sortBy is related field, but simple implementation:
        const orderBy = filter.sortBy ? { [filter.sortBy]: filter.order || SortOrder.DESC } : undefined;

        return {
            take: limit,
            skip,
            orderBy,
        };
    }

    static getMeta(count: number, filter: FilterDto) {
        const page = filter.page || 1;
        const limit = filter.limit || 10;
        const totalPages = Math.ceil(count / limit);

        return {
            page,
            limit,
            total: count,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        };
    }
}
