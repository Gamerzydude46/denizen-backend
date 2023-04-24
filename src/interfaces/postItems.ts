interface Image {
    data: Buffer;
    contentType: string;
}

interface MulterRequest extends Request {
    file: any;
}
