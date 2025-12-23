export type LoginTypes = {
    login: string;
    password: string;
};

export type SignUpTypes = {
    login: string;
    password: string;
    email: string;
};

export type UserType = {
    id: string;
    login: string;
    email: string;
    imageUrl: string;
};

export type User = {
    id: string;
    email: string;
    login: string;
    imageUrl: string | null;
};
