import { LIBRARY_NAME } from "./constant.ts";

export function log(message: string) {
    console.log(`[${LIBRARY_NAME}]`, message);
}

export function measure() {
    const start = performance.now();
    return (message: string) => {
        const end = performance.now();
        const time = end - start;

        log(message.replace("{time}", `${time.toFixed(2)}ms`));
    };
}
