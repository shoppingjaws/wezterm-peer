import { initDb } from "../db.ts";
import {
	getMyPaneId,
	getPeerGroupPaneIds,
	getSessionId,
	getTabPaneIds,
} from "../pane.ts";

export async function cmdSend(paneId: string, message: string) {
	const myPaneId = getMyPaneId();
	const sessionId = getSessionId();

	const tabPanes = await getTabPaneIds();
	const db = initDb();
	const peerPaneIds = getPeerGroupPaneIds(db);

	if (!tabPanes.has(Number(paneId)) && !peerPaneIds.has(paneId)) {
		console.error(
			`Error: Pane ${paneId} is not in the same tab or peer group as pane ${myPaneId}.`,
		);
		db.close();
		process.exit(1);
	}

	const stmt = db.prepare(
		"INSERT INTO messages (session_id, from_pane, to_pane, message) VALUES (?, ?, ?, ?)",
	);
	const result = stmt.run(sessionId, myPaneId, paneId, message);
	console.log(
		`Sent message to pane ${paneId} (id: ${result.lastInsertRowid})`,
	);
	db.close();
}
