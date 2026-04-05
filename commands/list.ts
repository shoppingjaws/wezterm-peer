import { initDb } from "../db.ts";
import { getMyPaneId, getPeerGroupPaneIds, listPanes } from "../pane.ts";

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
	db.close();

	const sameTabIds = new Set(
		panes.filter((p) => p.tab_id === myPane.tab_id).map((p) => p.pane_id),
	);

	const visiblePanes = panes.filter(
		(p) => sameTabIds.has(p.pane_id) || peerPaneIds.has(String(p.pane_id)),
	);

	console.log("WINID\tTABID\tPANEID\tWORKSPACE\tSIZE\tTITLE");
	for (const p of visiblePanes) {
		const marker = p.pane_id === Number(myPaneId) ? " *" : "";
		console.log(
			`${p.window_id}\t${p.tab_id}\t${p.pane_id}${marker}\t${p.workspace}\t${p.size}\t${p.title}`,
		);
	}
}
