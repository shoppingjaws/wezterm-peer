import { $ } from "bun";

export interface PaneInfo {
	window_id: number;
	tab_id: number;
	pane_id: number;
	workspace: string;
	size: string;
	title: string;
}

export function getMyPaneId(): string {
	const paneId = process.env.WEZTERM_PANE;
	if (!paneId) {
		console.error("Error: WEZTERM_PANE environment variable is not set.");
		process.exit(1);
	}
	return paneId;
}

export function getSessionId(): string {
	const socket = process.env.WEZTERM_UNIX_SOCKET;
	if (!socket) {
		console.error(
			"Error: WEZTERM_UNIX_SOCKET environment variable is not set.",
		);
		process.exit(1);
	}
	return socket;
}

export async function listPanes(): Promise<PaneInfo[]> {
	const result = await $`wezterm cli list --format json`.quiet();
	const panes: Array<{
		window_id: number;
		tab_id: number;
		pane_id: number;
		workspace: string;
		size: { cols: number; rows: number };
		title: string;
	}> = JSON.parse(result.stdout.toString());
	return panes.map((p) => ({
		window_id: p.window_id,
		tab_id: p.tab_id,
		pane_id: p.pane_id,
		workspace: p.workspace,
		size: `${p.size.cols}x${p.size.rows}`,
		title: p.title,
	}));
}

export async function getTabPaneIds(): Promise<Set<number>> {
	const myPaneId = getMyPaneId();
	const panes = await listPanes();
	const myPane = panes.find((p) => p.pane_id === Number(myPaneId));
	if (!myPane) return new Set();
	return new Set(
		panes.filter((p) => p.tab_id === myPane.tab_id).map((p) => p.pane_id),
	);
}

export function getPeerGroupPaneIds(db: import("bun:sqlite").Database): Set<string> {
	const sessionId = getSessionId();
	const rows = db
		.prepare("SELECT pane_id FROM peer_group WHERE session_id = ?")
		.all(sessionId) as Array<{ pane_id: string }>;
	return new Set(rows.map((r) => r.pane_id));
}

export function registerPeer(db: import("bun:sqlite").Database, paneId: string) {
	const sessionId = getSessionId();
	db.prepare(
		"INSERT OR IGNORE INTO peer_group (session_id, pane_id) VALUES (?, ?)",
	).run(sessionId, paneId);
}
