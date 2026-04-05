import { initDb } from "../db.ts";
import { getMyPaneId, getSessionId } from "../pane.ts";

interface HistoryMessage {
	id: number;
	from_pane: string;
	to_pane: string;
	message: string;
	created_at: string;
	read_at: string | null;
}

export function cmdHistory(filterPaneId?: string) {
	const myPaneId = getMyPaneId();
	const sessionId = getSessionId();
	const db = initDb();

	let messages: HistoryMessage[];

	if (filterPaneId) {
		messages = db
			.prepare(
				`SELECT id, from_pane, to_pane, message, created_at, read_at FROM messages
				 WHERE session_id = ? AND ((from_pane = ? AND to_pane = ?) OR (from_pane = ? AND to_pane = ?))
				 ORDER BY created_at ASC`,
			)
			.all(
				sessionId,
				myPaneId,
				filterPaneId,
				filterPaneId,
				myPaneId,
			) as HistoryMessage[];
	} else {
		messages = db
			.prepare(
				`SELECT id, from_pane, to_pane, message, created_at, read_at FROM messages
				 WHERE session_id = ? AND (from_pane = ? OR to_pane = ?)
				 ORDER BY created_at ASC`,
			)
			.all(sessionId, myPaneId, myPaneId) as HistoryMessage[];
	}

	if (messages.length === 0) {
		console.log("No messages.");
		db.close();
		return;
	}

	for (const m of messages) {
		const status = m.read_at ? "✓read" : "unread";
		console.log(
			`[#${m.id} from:${m.from_pane} → to:${m.to_pane} ${m.created_at} ${status}]`,
		);
		console.log(m.message);
	}
	db.close();
}
