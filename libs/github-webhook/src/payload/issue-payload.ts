import { User, WebhookPayload } from './webhook-payload';

export interface Label {
  id: number;
  node_id: string;
  url: string;
  name: string;
  color: string;
  default: boolean;
  description: string;
}

export interface Milestone {
  url: string;
  html_url: string;
  labels_url: string;
  id: number;
  node_id: string;
  number: number;
  title: string;
  description: string;
  creator: User;
  open_issues: number;
  closed_issues: number;
  state: string;
  created_at: Date;
  updated_at: Date;
  due_on: Date;
  closed_at: Date;
}

export enum AuthorAssociation {
  COLLABORATOR = 'COLLABORATOR',
  OWNER = 'OWNER',
}

export interface Issue {
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  id: number;
  node_id: string;
  number: number;
  title: string;
  user: User;
  labels: Label[];
  state: 'closed' | 'open';
  locked: boolean;
  assignee: User;
  assignees: User[];
  milestone: Milestone | null;
  comments: number;
  created_at: Date;
  updated_at: Date;
  closed_at: Date;
  author_association: AuthorAssociation;
  active_lock_reason: null;
  body: string;
}

export interface Comment {
  url: string;
  html_url: string;
  issue_url: string;
  id: number;
  node_id: string;
  user: User;
  created_at: Date;
  updated_at: Date;
  author_association: AuthorAssociation;
  body: string;
}

export interface IssuePayload extends WebhookPayload {
  action:
    | 'opened'
    | 'edited'
    | 'deleted'
    | 'transferred'
    | 'pinned'
    | 'unpinned'
    | 'closed'
    | 'reopened'
    | 'assigned'
    | 'unassigned'
    | 'labeled'
    | 'unlabeled'
    | 'locked'
    | 'unlocked'
    | 'milestoned'
    | 'demilestoned';
  changes: {
    body: {
      from: string;
    };
  };
  issue: Issue;
  comment: Comment;
  label: Label;
}
