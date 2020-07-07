export type Type = 'issues' | 'pull_request' | 'pull_request_review';
export type MsgType = 'text' | 'markdown';
export type ActionType = 'opened' | 'closed' | 'edited' | 'assigned';

export interface IParam {
    action: string;
    sender: IUser;
    repository: IRepository;
    issue: IIssue;
    pull_request: IPullRequest;
    review: IReview;
}

export interface IUser {
    login: string;
}

export interface IRepository {
    name: string;
    html_url: string;
}

export interface IHeader {
    'x-github-event': Type;
    'x-github-delivery': string;
    'x-hub-signature': string;
}

export interface IMessageInfo {
    msgtype: MsgType;
    text: IMessageContent;
}

export interface IMessageContent {
    content: string;
    mentioned_list?: string[];
    mentioned_mobile_list?: string[];
}

export interface IIssue {
    url: string;
    assignee: IUser;
}

export interface IPullRequest {
    title: string;
    html_url: string;
    head: IBranchInfo;
    base: IBranchInfo;
    assignee: IUser;
    merged: boolean;
}

export interface IBranchInfo {
    ref: string;
}

export interface IReview {
    html_url: string;
    state: string;
}

export interface IRes {
    errcode: number;
    errmsg: string;
}
