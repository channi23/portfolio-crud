CREATE TABLE IF NOT EXISTS projects(
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tech_stack TEXT NOT NULL,
    github_url TEXT NOT NULL,
    live_url TEXT NOT NULL,
    created_at TEXT NOT NULL
);