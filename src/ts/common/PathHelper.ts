export interface FilePath {
    folder: string,
    nameWithoutExt: string,
    extension: string,
    fullFileName: string
}

export function pathOf(path: string): (FilePath | null) {
    const matches = path.match(/^(.*[\\\/])?(\.*.*?)(\.[^.]+?|)$/);
    if (!matches) return null;
    return {
        folder: matches[1],
        nameWithoutExt: matches[2],
        extension: matches[3],
        fullFileName: matches[2] + matches[3],
    };
}