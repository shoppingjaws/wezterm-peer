import { initDb } from "../db.ts";
import { getMyPaneId, getSessionId } from "../pane.ts";

interface UnreadMessage {
	id: number;
	from_pane: string;
	message: string;
	created_at: string;
}

export function cmdOpen() {
	const myPaneId = getMyPaneId();
	const sessionId = getSessionId();
	const db = initDb();

	const messages = db
		.prepare(
			"SELECT id, from_pane, message, created_at FROM messages WHERE session_id = ? AND to_pane = ? AND read_at IS NULL ORDER BY created_at ASC",
		)
		.all(sessionId, myPaneId) as UnreadMessage[];

	if (messages.length === 0) {
		console.log("No unread messages.");
		db.close();
		return;
	}

	for (const m of messages) {
		console.log(`[#${m.id} from:${m.from_pane} ${m.created_at}] ${m.message}`);
	}

	const ids = messages.map((m) => m.id);
	const placeholders = ids.map(() => "?").join(",");
	db.prepare(
		`UPDATE messages SET read_at = datetime('now') WHERE id IN (${placeholders})`,
	).run(...ids);

	console.log(`${messages.length} message(s) marked as read.`);
	db.close();
}
