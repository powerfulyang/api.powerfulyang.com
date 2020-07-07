import { Injectable } from '@nestjs/common';
import { IMessageInfo, IRepository, IUser, Payload, Type } from './github.interfaces';
import { TelegramBotService } from 'api/telegram-bot';

@Injectable()
export class GithubService {
    constructor(private chatBotService: TelegramBotService) {}

    private async _requestSendMsgToChatbot(data: IMessageInfo) {
        return this.chatBotService.sendToMe(data.text.content);
    }

    private static _getCommonContent(
        repo: IRepository,
        sender: IUser,
        action: string,
        assignee: IUser,
    ): string {
        return `Repository Detail: ${repo.html_url}\nAction: ${action}\nSender: ${
            sender.login
        }\nAssignee: ${(assignee && assignee.login) || '--'}`;
    }

    private static _formatIssueContent(param: Payload): string {
        const { repository, issue, sender, action } = param;

        return `Issue Change\n\nIssue Detail: ${issue.url}\n${GithubService._getCommonContent(
            repository,
            sender,
            action,
            issue.assignee,
        )}`;
    }

    private static _formatPrContent(param: Payload): string {
        const { repository, pull_request, sender, action } = param;

        return `Pull Request Change\n\nPR Title: ${pull_request.title}\nPR Detail: ${
            pull_request.html_url
        }\n${GithubService._getCommonContent(repository, sender, action, pull_request.assignee)}`;
    }

    private static _formatPrReviewContent(param: Payload): string {
        const { repository, pull_request, sender, action, review } = param;

        const content = `Pull Request Review Change\n\nPR Detail: ${
            pull_request.html_url
        }\nReview Detail: ${review.html_url}\n${GithubService._getCommonContent(
            repository,
            sender,
            action,
            pull_request.assignee,
        )}`;

        return content;
    }

    public async sendMsg(payload: Payload, type: Type) {
        const funcMapToGetContent = {
            issues: GithubService._formatIssueContent.bind(this),
            pull_request: GithubService._formatPrContent.bind(this),
            pull_request_review: GithubService._formatPrReviewContent.bind(this),
        };

        const msg: IMessageInfo = {
            msgtype: 'text',
            text: {
                content: `${funcMapToGetContent[type](payload)}`,
            },
        };

        try {
            return await this._requestSendMsgToChatbot(msg);
        } catch (err) {
            throw err;
        }
    }
}
