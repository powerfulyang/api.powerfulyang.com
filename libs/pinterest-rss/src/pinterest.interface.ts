export interface RSSPinterestInterface {
    rss: RSS;
}

export interface RSS {
    $: RSSClass;
    channel: Channel[];
}

export interface RSSClass {
    version: string;
    'xmlns:atom': string;
}

export interface Channel {
    'atom:link': AtomLinkElement[];
    description: string[];
    item: Item[];
    language: string[];
    lastBuildDate: string[];
    link: string[];
    title: string[];
}

export interface AtomLinkElement {
    $: AtomLink;
}

export interface AtomLink {
    href: string;
    rel: string;
}

export interface Item {
    description: string[];
    guid: string[];
    link: string[];
    pubDate: string[];
    title: string[];
}

export interface PinterestInterface {
    id: string;
    imgUrl: string;
}
