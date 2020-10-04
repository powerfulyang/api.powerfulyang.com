export interface RssInterface {
    fetchUndo(lastId?: string, rssUrl?: string): Promise<any>;
}
