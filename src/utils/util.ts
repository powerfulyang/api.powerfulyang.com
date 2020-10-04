export const getTags = (text?: string) => {
    const tagsText = text?.replace(/[\n\r]/, '').match(/#[^#]*/gi);
    return (tagsText || []).map((x) => x.trim());
};
