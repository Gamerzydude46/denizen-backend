interface Image {
    URL: string;
    name: string;
}

interface MulterRequest extends Request {
    file: any;
}

interface Receiver {
    name: string;
    contact: number;
}
