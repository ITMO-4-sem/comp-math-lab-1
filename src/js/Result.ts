export class Result {
    private status: boolean;
    private message: string;


    constructor(resultStatus: boolean, resultMessage: string) {
        this.status = resultStatus;
        this.message = resultMessage;
    }


    public getStatus(): boolean {
        return this.status;
    }

    public getMessage(): string {
        return this.message;
    }
}