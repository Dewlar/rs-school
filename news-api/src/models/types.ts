export interface IResponseConfig {
    endpoint: string;
    options?: {
        sources?: string;
    };
}

export type Callback<T> = (data: T) => void;
