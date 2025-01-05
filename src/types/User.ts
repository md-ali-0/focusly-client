import { Shop } from "./Shop";

export type Vendor = {
    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
};

export type User = {
    id: string;
    email: string;
    password: string;
    name: string;
    avatar: string;
    phone?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    address?: string;
    country?: string;
    role: Role;
    shop: Shop;
    followedShops: Shop[]
    status: UserStatus;
    createdAt: Date;
    updatedAt: Date;
};

export enum UserStatus {
    ACTIVE,
    SUSPEND,
}

enum Role {
    ADMIN,
    VENDOR,
    USER,
}
