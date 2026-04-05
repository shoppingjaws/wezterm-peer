import { initDb } from "../db.ts";
import { getSessionId } from "../pane.ts";

export function cmdClean() {
	const sessionId = getSessionId();
	const db = initDb();
	const result = db
		.prepare("SELECT COUNT(*) as count FROM messages WHERE session_id = ?")
		.get(sessionId) as { count: number };
	db.prepare("DELETE FROM messages WHERE session_id = ?").run(sessionId);
	console.log(`Deleted ${result.count} messages. Database cleaned.`);
	db.close();
}
