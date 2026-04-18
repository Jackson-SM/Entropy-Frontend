import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, HardDrive, GitBranch, ExternalLink, ChevronRight, ArrowLeft, RefreshCw, Folder, FileText, AlertCircle, Search, Hash } from 'lucide-react';
import {
  fetchGmailMessages, fetchDriveFiles, fetchGitHubRepos, fetchGitHubItems,
  fetchNotionPages, fetchSlackChannels, fetchSlackMessages,
  type GmailMessage, type DriveFile, type GitHubRepo, type GitHubItem,
  type NotionPage, type SlackChannel, type SlackMessage,
} from '../../api/browse';
import { useBrowseData, useAgeLabel } from '../../hooks/useBrowseData';

type SourceTab = 'gmail' | 'gdrive' | 'github' | 'notion' | 'slack';

const TABS: { id: SourceTab; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'gmail',  label: 'Gmail',        icon: <Mail size={15} />,      color: '#ea4335' },
  { id: 'gdrive', label: 'Google Drive', icon: <HardDrive size={15} />, color: '#4285f4' },
  { id: 'github', label: 'GitHub',       icon: <GitBranch size={15} />, color: '#2ea043' },
  { id: 'notion', label: 'Notion',       icon: <FileText size={15} />,  color: '#9b9b9b' },
  { id: 'slack',  label: 'Slack',        icon: <Hash size={15} />,      color: '#e01e5a' },
];

// ─── Shared utils ────────────────────────────────────────────────────────────

function formatDate(raw: string): string {
  if (!raw) return '';
  try {
    return new Date(raw).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return raw.slice(0, 10);
  }
}

function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
      <AlertCircle size={36} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
      <p style={{ margin: 0, fontSize: '0.875rem' }}>{message}</p>
    </div>
  );
}

function LoadingRows({ count = 5 }: { count?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ height: 60, borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', animation: 'pulse 1.5s infinite' }} />
      ))}
    </div>
  );
}

/** Shows "Updated X ago · Refresh" with a subtle refreshing spinner */
function CacheBar({ fetchedAt, refreshing, onRefresh }: { fetchedAt: number | null; refreshing: boolean; onRefresh: () => void }) {
  const age = useAgeLabel(fetchedAt);
  if (!fetchedAt && !refreshing) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
      {refreshing ? (
        <RefreshCw size={11} style={{ animation: 'spin 0.8s linear infinite', color: 'var(--accent-primary)' }} />
      ) : (
        <span>Updated {age}</span>
      )}
      {!refreshing && (
        <button
          onClick={onRefresh}
          style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '0.7rem', padding: 0 }}
        >
          Refresh
        </button>
      )}
    </div>
  );
}

// ─── Gmail Browser ───────────────────────────────────────────────────────────

function GmailBrowser() {
  const [q, setQ] = useState('in:inbox');
  const [inputQ, setInputQ] = useState('in:inbox');

  const fetcher = useCallback(() => fetchGmailMessages(q), [q]);
  const { data, loading, refreshing, error, fetchedAt, refresh } = useBrowseData<{
    messages: GmailMessage[];
    result_size_estimate: number;
  }>(`gmail:${q}`, fetcher);

  const messages = data?.messages ?? [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Search bar */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            value={inputQ}
            onChange={e => setInputQ(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') setQ(inputQ); }}
            placeholder="Gmail query (e.g. from:boss@company.com)"
            style={{
              width: '100%', padding: '0.5rem 0.75rem 0.5rem 2.25rem',
              background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
              fontSize: '0.875rem', boxSizing: 'border-box',
            }}
          />
        </div>
        <button className="btn-ghost" onClick={() => setQ(inputQ)} style={{ padding: '0.5rem 1rem' }}>Search</button>
        <button className="btn-ghost" onClick={refresh} disabled={refreshing} title="Refresh" style={{ padding: '0.5rem' }}>
          <RefreshCw size={14} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
        </button>
      </div>

      <CacheBar fetchedAt={fetchedAt} refreshing={refreshing} onRefresh={refresh} />

      {loading ? <LoadingRows /> : error ? <EmptyState message={error} /> : messages.length === 0 ? (
        <EmptyState message="No messages found. Try syncing first, or change the query." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {messages.map(msg => (
            <motion.a
              key={msg.id}
              href={msg.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                display: 'flex', gap: '1rem', alignItems: 'flex-start',
                padding: '0.875rem 1rem',
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${msg.unread ? 'rgba(99,102,241,0.25)' : 'var(--border-subtle)'}`,
                cursor: 'pointer', textDecoration: 'none', color: 'inherit',
                transition: 'all 0.15s',
              }}
              whileHover={{ background: 'var(--bg-panel-solid)', borderColor: 'var(--border-muted)' }}
            >
              <div style={{ marginTop: '0.35rem', flexShrink: 0 }}>
                <div style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: msg.unread ? 'var(--accent-primary)' : 'transparent',
                  border: msg.unread ? 'none' : '1.5px solid var(--border-muted)',
                }} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{
                    fontWeight: msg.unread ? 700 : 500, fontSize: '0.875rem',
                    color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '55%',
                  }}>
                    {msg.subject}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', flexShrink: 0 }}>{formatDate(msg.date)}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {msg.from}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
                  {msg.snippet}
                </div>
              </div>

              <ExternalLink size={13} style={{ flexShrink: 0, color: 'var(--text-muted)', marginTop: '0.2rem' }} />
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Drive Browser ───────────────────────────────────────────────────────────

const DRIVE_ICONS: Record<string, { icon: React.ReactNode; color: string }> = {
  folder:  { icon: <Folder size={18} />,    color: '#fbbc04' },
  doc:     { icon: <FileText size={18} />,   color: '#4285f4' },
  sheet:   { icon: <FileText size={18} />,   color: '#34a853' },
  slide:   { icon: <FileText size={18} />,   color: '#fbbc04' },
  pdf:     { icon: <FileText size={18} />,   color: '#ea4335' },
  image:   { icon: <FileText size={18} />,   color: '#8ab4f8' },
  code:    { icon: <FileText size={18} />,   color: '#94a3b8' },
  text:    { icon: <FileText size={18} />,   color: '#94a3b8' },
  file:    { icon: <FileText size={18} />,   color: '#94a3b8' },
};

function DriveBrowser() {
  const [folderStack, setFolderStack] = useState<{ id: string; name: string }[]>([{ id: 'root', name: 'My Drive' }]);
  const currentFolder = folderStack[folderStack.length - 1];

  const fetcher = useCallback(() => fetchDriveFiles(currentFolder.id), [currentFolder.id]);
  const { data, loading, refreshing, error, fetchedAt, refresh } = useBrowseData<{
    files: DriveFile[];
    folder_name: string;
    next_page_token?: string;
  }>(`gdrive:${currentFolder.id}`, fetcher);

  const files = data?.files ?? [];

  const openFolder = (file: DriveFile) => {
    setFolderStack(s => [...s, { id: file.id, name: file.name }]);
  };

  const goBack = () => {
    setFolderStack(s => s.length > 1 ? s.slice(0, -1) : s);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        {folderStack.length > 1 && (
          <button className="btn-ghost" onClick={goBack} style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', gap: '0.3rem' }}>
            <ArrowLeft size={13} /> Back
          </button>
        )}
        {folderStack.map((f, i) => (
          <span key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
            {i > 0 && <ChevronRight size={12} style={{ color: 'var(--text-muted)' }} />}
            <span
              style={{
                color: i === folderStack.length - 1 ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: i < folderStack.length - 1 ? 'pointer' : 'default',
                fontWeight: i === folderStack.length - 1 ? 600 : 400,
              }}
              onClick={() => i < folderStack.length - 1 && setFolderStack(folderStack.slice(0, i + 1))}
            >
              {f.name}
            </span>
          </span>
        ))}
        <button className="btn-ghost" onClick={refresh} disabled={refreshing} style={{ marginLeft: 'auto', padding: '0.3rem' }}>
          <RefreshCw size={13} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
        </button>
      </div>

      <CacheBar fetchedAt={fetchedAt} refreshing={refreshing} onRefresh={refresh} />

      {loading ? <LoadingRows /> : error ? <EmptyState message={error} /> : files.length === 0 ? (
        <EmptyState message="This folder is empty." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.5rem' }}>
          {files.map(file => {
            const iconCfg = DRIVE_ICONS[file.icon] || DRIVE_ICONS.file;
            return (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card-static"
                style={{ padding: '0.875rem', cursor: 'pointer', userSelect: 'none' }}
                onClick={() => file.is_folder ? openFolder(file) : window.open(file.url, '_blank')}
                whileHover={{ scale: 1.02, background: 'var(--bg-panel-solid)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                  <div style={{ color: iconCfg.color, flexShrink: 0 }}>{iconCfg.icon}</div>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {file.name}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{formatDate(file.modified_time)}</span>
                  {!file.is_folder && (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {file.size && <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{file.size}</span>}
                      <a href={file.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ color: 'var(--text-muted)' }}>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  )}
                  {file.is_folder && <ChevronRight size={13} style={{ color: 'var(--text-muted)' }} />}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── GitHub Browser ──────────────────────────────────────────────────────────

const LANG_COLORS: Record<string, string> = {
  Python: '#3572A5', TypeScript: '#3178c6', JavaScript: '#f1e05a',
  Rust: '#dea584', Go: '#00ADD8', Java: '#b07219', 'C++': '#f34b7d',
  Swift: '#F05138', Kotlin: '#A97BFF', Ruby: '#701516',
};

function GitHubBrowser() {
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [itemType, setItemType] = useState<'commits' | 'issues'>('commits');

  const repoFetcher = useCallback(() => fetchGitHubRepos(), []);
  const { data: repoData, loading: reposLoading, refreshing: reposRefreshing, error: reposError, fetchedAt: reposFetchedAt, refresh: refreshRepos } =
    useBrowseData<{ repos: GitHubRepo[] }>('github:repos', repoFetcher);
  const repos = repoData?.repos ?? [];

  const itemsFetcher = useCallback(
    () => fetchGitHubItems(selectedRepo?.full_name ?? '', itemType),
    [selectedRepo?.full_name, itemType],
  );
  const { data: itemsData, loading: itemsLoading, refreshing: itemsRefreshing, fetchedAt: itemsFetchedAt, refresh: refreshItems } =
    useBrowseData<{ items: GitHubItem[] }>(
      selectedRepo ? `github:items:${selectedRepo.full_name}:${itemType}` : '__skip__',
      itemsFetcher,
    );
  const items = itemsData?.items ?? [];

  const selectRepo = (repo: GitHubRepo) => {
    setSelectedRepo(repo);
    setItemType('commits');
  };

  if (selectedRepo) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn-ghost" onClick={() => setSelectedRepo(null)} style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', gap: '0.3rem' }}>
            <ArrowLeft size={13} /> All repos
          </button>
          <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{selectedRepo.full_name}</span>
          <a href={selectedRepo.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', marginLeft: 'auto' }}>
            <ExternalLink size={14} />
          </a>
        </div>

        <div style={{ display: 'flex', gap: '0.375rem', background: 'var(--bg-elevated)', padding: '0.25rem', borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
          {(['commits', 'issues'] as const).map(t => (
            <button key={t} onClick={() => setItemType(t)} style={{
              padding: '0.3rem 1rem', fontSize: '0.8125rem', fontWeight: 500,
              borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
              background: itemType === t ? 'var(--bg-panel-solid)' : 'transparent',
              color: itemType === t ? 'var(--text-primary)' : 'var(--text-muted)',
              transition: 'all 0.15s',
            }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <CacheBar fetchedAt={itemsFetchedAt} refreshing={itemsRefreshing} onRefresh={refreshItems} />

        {itemsLoading ? <LoadingRows /> : items.length === 0 ? (
          <EmptyState message={`No ${itemType} found.`} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {items.map(item => (
              <motion.a key={item.id + item.type} href={item.url} target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                style={{
                  display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                  padding: '0.75rem 1rem', background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)',
                  textDecoration: 'none', color: 'inherit', transition: 'all 0.15s',
                }}
                whileHover={{ background: 'var(--bg-panel-solid)' }}
              >
                {item.type === 'commit' ? (
                  <code style={{ fontSize: '0.7rem', background: 'rgba(99,102,241,0.12)', color: 'var(--accent-primary)', padding: '0.15rem 0.4rem', borderRadius: 4, flexShrink: 0, marginTop: 2 }}>
                    {item.id}
                  </code>
                ) : (
                  <span style={{
                    fontSize: '0.6875rem', fontWeight: 600, padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-full)', flexShrink: 0, marginTop: 2,
                    background: item.state === 'open' ? 'rgba(46,160,67,0.15)' : 'rgba(139,92,246,0.15)',
                    color: item.state === 'open' ? '#2ea043' : '#8b5cf6',
                  }}>{item.state ?? item.type}</span>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {item.author} · {formatDate(item.date)}{item.comments != null && item.comments > 0 ? ` · ${item.comments} comments` : ''}
                  </div>
                  {item.labels && item.labels.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginTop: '0.375rem' }}>
                      {item.labels.slice(0, 3).map(l => (
                        <span key={l} style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem', background: 'var(--bg-panel-solid)', borderRadius: 'var(--radius-full)', color: 'var(--text-muted)' }}>{l}</span>
                      ))}
                    </div>
                  )}
                </div>
                <ExternalLink size={12} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 3 }} />
              </motion.a>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <CacheBar fetchedAt={reposFetchedAt} refreshing={reposRefreshing} onRefresh={refreshRepos} />
      {reposLoading ? <LoadingRows /> : reposError ? <EmptyState message={reposError} /> : repos.length === 0 ? (
        <EmptyState message="No repositories found. Connect GitHub first." />
      ) : (
        repos.map((repo, i) => (
          <motion.div key={repo.full_name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="glass-card-static"
            style={{ padding: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}
            onClick={() => selectRepo(repo)}
            whileHover={{ background: 'var(--bg-panel-solid)' }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9375rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{repo.name}</span>
                {repo.private && (
                  <span style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem', background: 'rgba(245,158,11,0.12)', color: '#f59e0b', borderRadius: 'var(--radius-full)' }}>Private</span>
                )}
              </div>
              {repo.description && (
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{repo.description}</p>
              )}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {repo.language && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: LANG_COLORS[repo.language] || '#94a3b8' }} />
                    {repo.language}
                  </span>
                )}
                {repo.stars > 0 && <span>★ {repo.stars}</span>}
                {repo.open_issues > 0 && <span>{repo.open_issues} issues</span>}
                <span style={{ marginLeft: 'auto' }}>Updated {formatDate(repo.updated_at)}</span>
              </div>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          </motion.div>
        ))
      )}
    </div>
  );
}

// ─── Notion Browser ─────────────────────────────────────────────────────────

function NotionBrowser() {
  const fetcher = useCallback(() => fetchNotionPages(), []);
  const { data, loading, refreshing, error, fetchedAt, refresh } = useBrowseData<{
    pages: NotionPage[];
  }>('notion:pages', fetcher);

  const pages = data?.pages ?? [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <CacheBar fetchedAt={fetchedAt} refreshing={refreshing} onRefresh={refresh} />

      {loading ? <LoadingRows /> : error ? <EmptyState message={error} /> : pages.length === 0 ? (
        <EmptyState message="No Notion pages found. Connect Notion and sync first." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.5rem' }}>
          {pages.map(page => (
            <motion.a
              key={page.id}
              href={page.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card-static"
              style={{ padding: '0.875rem', cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
              whileHover={{ scale: 1.02, background: 'var(--bg-panel-solid)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '1rem' }}>{page.icon || '📄'}</span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {page.title || 'Untitled'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{page.type}</span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{formatDate(page.last_edited)}</span>
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Slack Browser ──────────────────────────────────────────────────────────

function SlackBrowser() {
  const [selectedChannel, setSelectedChannel] = useState<SlackChannel | null>(null);

  const channelFetcher = useCallback(() => fetchSlackChannels(), []);
  const { data: chData, loading: chLoading, refreshing: chRefreshing, error: chError, fetchedAt: chFetchedAt, refresh: refreshCh } =
    useBrowseData<{ channels: SlackChannel[] }>('slack:channels', channelFetcher);
  const channels = chData?.channels ?? [];

  const msgFetcher = useCallback(
    () => fetchSlackMessages(selectedChannel?.id ?? ''),
    [selectedChannel?.id],
  );
  const { data: msgData, loading: msgLoading, refreshing: msgRefreshing, fetchedAt: msgFetchedAt, refresh: refreshMsg } =
    useBrowseData<{ messages: SlackMessage[] }>(
      selectedChannel ? `slack:msgs:${selectedChannel.id}` : '__skip__',
      msgFetcher,
    );
  const messages = msgData?.messages ?? [];

  if (selectedChannel) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn-ghost" onClick={() => setSelectedChannel(null)} style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', gap: '0.3rem' }}>
            <ArrowLeft size={13} /> Channels
          </button>
          <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>#{selectedChannel.name}</span>
        </div>

        <CacheBar fetchedAt={msgFetchedAt} refreshing={msgRefreshing} onRefresh={refreshMsg} />

        {msgLoading ? <LoadingRows /> : messages.length === 0 ? (
          <EmptyState message="No messages found in this channel." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  padding: '0.75rem 1rem', background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{msg.user}</span>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{formatDate(msg.timestamp)}</span>
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{msg.text}</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <CacheBar fetchedAt={chFetchedAt} refreshing={chRefreshing} onRefresh={refreshCh} />
      {chLoading ? <LoadingRows /> : chError ? <EmptyState message={chError} /> : channels.length === 0 ? (
        <EmptyState message="No Slack channels found. Connect Slack first." />
      ) : (
        channels.map((ch, i) => (
          <motion.div
            key={ch.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="glass-card-static"
            style={{ padding: '0.875rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            onClick={() => setSelectedChannel(ch)}
            whileHover={{ background: 'var(--bg-panel-solid)' }}
          >
            <Hash size={16} color="#e01e5a" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{ch.name}</div>
              {ch.topic && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {ch.topic}
                </div>
              )}
            </div>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{ch.member_count} members</span>
            <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          </motion.div>
        ))
      )}
    </div>
  );
}

// ─── Main SourceBrowser component ────────────────────────────────────────────

export function SourceBrowser() {
  const [activeTab, setActiveTab] = useState<SourceTab>('gmail');

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', marginBottom: '0.5rem' }}>Your Data</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0 0 1.5rem' }}>
        Browse your connected sources live — data is fetched directly from each service.
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 1.125rem',
              borderRadius: 'var(--radius-full)',
              border: `1.5px solid ${activeTab === tab.id ? tab.color : 'var(--border-subtle)'}`,
              background: activeTab === tab.id ? `${tab.color}18` : 'transparent',
              color: activeTab === tab.id ? tab.color : 'var(--text-secondary)',
              fontWeight: activeTab === tab.id ? 600 : 400,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'gmail'  && <GmailBrowser />}
          {activeTab === 'gdrive' && <DriveBrowser />}
          {activeTab === 'github' && <GitHubBrowser />}
          {activeTab === 'notion' && <NotionBrowser />}
          {activeTab === 'slack'  && <SlackBrowser />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
