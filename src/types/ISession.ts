export interface TSession {
    isAuth: boolean;
    user: number | null
    role: 'ADMIN' | 'USER' | 'guest' | 'VENDOR'
}
