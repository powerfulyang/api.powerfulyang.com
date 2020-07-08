export enum EventType {
    issues = 'issues',
    pull_request = 'pull_request',
    pull_request_review = 'pull_request_review',
    check_run = 'check_run',
    check_suite = 'check_suite',
    create = 'create',
    delete = 'delete',
    deployment = 'deployment',
    deployment_status = 'deployment_status',
    fork = 'fork',
    gollum = 'gollum',
    issue_comment = 'issue_comment',
    label = 'label',
    milestone = 'milestone',
    page_build = 'page_build',
    project = 'project',
    project_card = 'project_card',
    project_column = 'project_column',
    public = 'public',
    pull_request_review_comment = 'pull_request_review_comment',
    push = 'push',
    registry_package = 'registry_package',
    release = 'release',
    status = 'status',
    watch = 'watch',
}

export enum MsgType {
    text = 'text',
    markdown = 'markdown',
}

export interface ActionType<T extends { action: unknown }> {
    action: T['action'];
}
