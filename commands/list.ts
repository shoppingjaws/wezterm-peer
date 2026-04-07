import { initDb } from "../db.ts";
import { getMyPaneId, getPeerDescription, getPeerGroupPaneIds, getPeerRelation, listPanes } from "../pane.ts";

export async function cmdList() {
	const myPaneId = getMyPaneId();
	const panes = await listPanes();
	const myPane = panes.find((p) => p.pane_id === Number(myPaneId));
	if (!myPane) {
		console.error(`Error: Current pane ${myPaneId} not found.`);
		process.exit(1);
	}

	const db = initDb();
	const peerPaneIds = getPeerGroupPaneIds(db);

	const sameTabIds = new Set(
		panes.filter((p) => p.tab_id === myPane.tab_id).map((p) => p.pane_id),
	);

	const visiblePanes = panes.filter(
		(p) => sameTabIds.has(p.pane_id) || peerPaneIds.has(String(p.pane_id)),
	);

	console.log("WINID\tTABID\tPANEID\tRELATION\tDESCRIPTION\tWORKSPACE\tSIZE\tTITLE");
	for (const p of visiblePanes) {
		const isSelf = p.pane_id === Number(myPaneId);
		const relation = isSelf
			? "self"
			: (getPeerRelation(db, String(p.pane_id)) ?? "none");
		const description = isSelf
			? ""
			: (getPeerDescription(db, String(p.pane_id)) ?? "");
		console.log(
			`${p.window_id}\t${p.tab_id}\t${p.pane_id}\t${relation}\t${description}\t${p.workspace}\t${p.size}\t${p.title}`,
		);
	}

	db.close();
}
