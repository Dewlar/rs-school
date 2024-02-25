import { IResponseConfig, Callback } from '../../models/types';
import { Status } from '../../models/enum';

class Loader {
    constructor(
        private readonly baseLink: string,
        private options: { apiKey: string }
    ) {}

    getResp<T>(
        responseConfig: IResponseConfig,
        callback: Callback<T> = () => {
            console.error('No callback for GET response');
        }
    ): void {
        this.load('GET', callback, responseConfig);
    }

    errorHandler(res: Response): Response {
        if (!res.ok) {
            if (res.status === Status.error_401 || res.status === Status.error_404)
                console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
            throw Error(res.statusText);
        }

        return res;
    }

    makeUrl({ options, endpoint }: IResponseConfig) {
        const urlOptions: { [key: string]: string } = { ...this.options, ...options };
        let url = `${this.baseLink}${endpoint}?`;

        Object.keys(urlOptions).forEach((key) => {
            url += `${key}=${urlOptions[key]}&`;
        });

        return url.slice(0, -1);
    }

    load<T>(method: string, callback: Callback<T>, responseConfig: IResponseConfig): void {
        fetch(this.makeUrl(responseConfig), { method })
            .then(this.errorHandler)
            .then((res: Response) => res.json())
            .then((data) => callback(data))
            .catch((err) => console.error(err));
    }
}

export default Loader;
