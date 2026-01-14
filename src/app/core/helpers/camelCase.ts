export const stringToCamelCase = (inputString: string): string => {
    const words: string[] = inputString.split(/[\s-]+/);
    if (words.length === 0) {
        return "";
    }

    const camelCasedWords: string[] = words.map((word, index) => {
        if (index === 0) {
            return word.charAt(0).toLowerCase() + word.slice(1);
        } else {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
    });

    return camelCasedWords.join("");
};
