import { $ } from "bun";
import { initDb } from "../db.ts";
import {
	getMyPaneId,
	getPeerGroupPaneIds,
	getTabPaneIds,
} from "../pane.ts";

export async function cmdPeek(paneId: string, args: string[]) {
	const myPaneId = getMyPaneId();

	const tabPanes = await getTabPaneIds();
	const db = initDb();
	const peerPaneIds = getPeerGroupPaneIds(db);
	db.close();

	if (!tabPanes.has(Number(paneId)) && !peerPaneIds.has(paneId)) {
		console.error(
			`Error: Pane ${paneId} is not in the same tab or peer group as pane ${myPaneId}.`,
		);
		process.exit(1);
	}

	const opts: string[] = [];
	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		const next = args[i + 1];
		if (arg === "--start-line" && next) {
			opts.push("--start-line", next);
			i++;
		} else if (arg === "--end-line" && next) {
			opts.push("--end-line", next);
			i++;
		}
	}
	const result =
		await $`wezterm cli get-text --pane-id ${paneId} ${opts}`.quiet();
	console.log(result.stdout.toString());
}
