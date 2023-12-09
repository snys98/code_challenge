declare type UserProfile = {
    sub: string;
    id: number;
    username: string;
    iat: number;
    exp: number;
};

declare type Editable<T> = { -readonly [K in keyof T]: T[K] }; 
