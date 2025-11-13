export interface IndividualFormData {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
}

export interface CompanyFormData {
    companyName: string,
    companyAddress: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    aboutUsType: string,
    confirmEmail: string,
    confirmPassword: string
}

export type RegisterType = 'individual' | 'company'