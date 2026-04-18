import { apiGet } from './client';

export interface GmailMessage {
  id: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  snippet: string;
  unread: boolean;
  labels: string[];
  url: string;
}

export interface DriveFile {
  id: string;
  name: string;
  mime_type: string;
  icon: string;
  is_folder: boolean;
  modified_time: string;
  size: string;
  url: string;
}

export interface GitHubRepo {
  full_name: string;
  name: string;
  description: string;
  url: string;
  language: string;
  stars: number;
  forks: number;
  open_issues: number;
  updated_at: string;
  private: boolean;
  default_branch: string;
}

export interface GitHubItem {
  id: string;
  sha?: string;
  type: 'commit' | 'issue' | 'pr';
  title: string;
  body: string;
  author: string;
  author_avatar: string;
  state?: string;
  date: string;
  url: string;
  labels?: string[];
  comments?: number;
}

export async function fetchGmailMessages(
  q = 'in:inbox',
  perPage = 20,
): Promise<{ messages: GmailMessage[]; result_size_estimate: number; next_page_token?: string }> {
  return apiGet(`/api/connectors/gmail/messages?q=${encodeURIComponent(q)}&per_page=${perPage}`);
}

export async function fetchDriveFiles(
  folderId = 'root',
  pageToken?: string,
): Promise<{ folder_id: string; folder_name: string; files: DriveFile[]; next_page_token?: string }> {
  const pt = pageToken ? `&page_token=${pageToken}` : '';
  return apiGet(`/api/connectors/gdrive/files?folder_id=${folderId}${pt}`);
}

export async function fetchGitHubRepos(): Promise<{ repos: GitHubRepo[] }> {
  return apiGet('/api/connectors/github/repos');
}

export async function fetchGitHubItems(
  repo: string,
  itemType: 'commits' | 'issues',
): Promise<{ repo: string; type: string; items: GitHubItem[] }> {
  return apiGet(`/api/connectors/github/items?repo=${encodeURIComponent(repo)}&item_type=${itemType}`);
}

export interface NotionPage {
  id: string;
  title: string;
  icon?: string;
  url: string;
  last_edited: string;
  type: 'page' | 'database';
}

export interface SlackChannel {
  id: string;
  name: string;
  is_private: boolean;
  member_count: number;
  topic?: string;
}

export interface SlackMessage {
  id: string;
  text: string;
  user: string;
  channel: string;
  timestamp: string;
  url?: string;
}

export async function fetchNotionPages(): Promise<{ pages: NotionPage[] }> {
  return apiGet('/api/connectors/notion/pages');
}

export async function fetchSlackChannels(): Promise<{ channels: SlackChannel[] }> {
  return apiGet('/api/connectors/slack/channels');
}

export async function fetchSlackMessages(
  channel: string,
): Promise<{ messages: SlackMessage[] }> {
  return apiGet(`/api/connectors/slack/messages?channel=${encodeURIComponent(channel)}`);
}
