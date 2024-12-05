
export const createResponse = (status: number, success: boolean, message: string, data?: any) => {
    return {
        status,
        success,
        message,
        data
    };
};
