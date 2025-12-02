export const customEncodeBase64 = (input: string, isPassword: boolean = false) => {
    if (typeof input != "string") {
        throw new Error(
            isPassword ?
                "Please provide valid password" :
                "Invalid format"
        );
    }
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let str = input;
    let output = '';

    for (let block = 0, charCode, i = 0, map = chars;
        str.charAt(i | 0) || (map = '=', i % 1);
        output += map.charAt(63 & block >> 8 - i % 1 * 8)) {

        charCode = str.charCodeAt(i += 3 / 4);

        if (charCode > 0xFF) {
            throw new Error(
                isPassword ?
                    "Please provide valid password" :
                    "Invalid format"
            );
        }

        block = block << 8 | charCode;
    }

    return output;
}
