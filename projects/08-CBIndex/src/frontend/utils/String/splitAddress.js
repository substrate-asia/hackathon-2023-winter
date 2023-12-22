export function splitString(inputString) {
    if (inputString.length < 10) {
        // 如果输入的字符串长度不足10个字符，你可能需要进行错误处理或者返回原始字符串
        return inputString;
    }

    const frontPart = inputString.slice(0, 6);
    const backPart = inputString.slice(-4);

    return `${frontPart}...${backPart}`;

}

