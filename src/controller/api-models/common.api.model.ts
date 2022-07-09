export class BaseApiResponse <T> {
    public status: boolean;
    public message: string;
    public data?: T;

    constructor(message: string, status: boolean, data: T) {
        this.message = message;
        this.status = status;
        this.data = data;
    }

    static build<T>(message: string, status: boolean, data: T) {
        return new BaseApiResponse<T>(message, status, data);
    }
}