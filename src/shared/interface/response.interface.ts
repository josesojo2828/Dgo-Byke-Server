export interface IResponse<T> {
    success: true;
    message?: string;
    data: T;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
        [key: string]: any;
    };
}

export interface IErrorResponse {
    success: false;
    statusCode: number;
    error: {
        code?: string;
        message: string | string[];
        details?: any;
        path?: string;
        timestamp: string;
    };
}
