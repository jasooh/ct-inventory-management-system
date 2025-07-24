// APIResponse.ts
// An interface defining the API responses from our API layer.

export interface APIResponse<T = undefined> {
    success: boolean;
    data?: T;
    error?: string;
}
