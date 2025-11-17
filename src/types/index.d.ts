// 全局Config ts
export interface ConfigInfo {
    list: {
        text: {
            cn: string,
            zh: string,
            en: string
        },
        value: string,
    }[]
}

export interface ConfigData {
    id: string;
    name: string;
    settings: any;
    'area-codes': ConfigInfo
}