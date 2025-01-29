export const decode = (input: string) => JSON.parse(Buffer.from(input, 'base64').toString('utf-8'));
export const encode = (input: string) => Buffer.from(input).toString("base64");
