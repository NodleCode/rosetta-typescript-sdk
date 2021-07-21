export default class ExpressServer {
    port: number;
    host: string;
    openApiPath: string;
    app: any;
    schema: any;
    server: any;
    constructor(port: number, host: string, openApiYaml: any);
    setupMiddleware(): void;
    configure(config: any): void;
    launch(): void;
    close(): Promise<void>;
}
