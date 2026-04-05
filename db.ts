import { Database } from "bun:sqlite";
import { existsSync, mkdirSync } from "node:fs";

const DB_DIR = "/tmp/peer";
const DB_PATH = `${DB_DIR}/peer.db`;

export function initDb(): Database {
	if (!existsSync(DB_DIR)) {
		mkdirSync(DB_DIR, { recursive: true });
	}
	const db = new Database(DB_PATH, { create: true });
	db.run(`
		CREATE TABLE IF NOT EXISTS messages (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			session_id TEXT NOT NULL,
			from_pane TEXT NOT NULL,
			to_pane TEXT NOT NULL,
			message TEXT NOT NULL,
			created_at TEXT NOT NULL DEFAULT (datetime('now')),
			read_at TEXT DEFAULT NULL
		)
	`);
	db.run(`
		CREATE INDEX IF NOT EXISTS idx_messages_to_pane ON messages(session_id, to_pane, read_at)
	`);
	db.run(`
		CREATE TABLE IF NOT EXISTS peer_group (
			session_id TEXT NOT NULL,
			pane_id TEXT NOT NULL,
			created_at TEXT NOT NULL DEFAULT (datetime('now')),
			PRIMARY KEY (session_id, pane_id)
		)
	`);
	return db;
}
