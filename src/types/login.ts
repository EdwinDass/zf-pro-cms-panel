export class LoginPayload {
    email: string;
    password: string;
    constructor(data: Partial<LoginPayload>) {
        this.email = data?.email || ""
        this.password = data?.password || ""
    }
}