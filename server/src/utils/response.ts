export const createResponse = (
    status: number,
    success: boolean,
    message: string,
    data: any = null // Establece un valor predeterminado
) => {
    return {
        status,
        success,
        message,
        data,
    };
};
