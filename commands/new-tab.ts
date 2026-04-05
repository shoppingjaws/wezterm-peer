import { $ } from "bun";
import { initDb } from "../db.ts";
import { getMyPaneId, registerPeerEdge } from "../pane.ts";

export async function cmdNewTab(args: string[]) {
	const myPaneId = getMyPaneId();

	const spawnArgs: string[] = [];
	let commandArgs: string[] = [];

	const separatorIndex = args.indexOf("--");
	if (separatorIndex >= 0) {
		spawnArgs.push(...args.slice(0, separatorIndex));
		commandArgs = args.slice(separatorIndex + 1);
	} else {
		spawnArgs.push(...args);
	}

	if (commandArgs.length > 0) {
		spawnArgs.push("--", ...commandArgs);
	}

	const result =
		await $`wezterm cli spawn ${spawnArgs}`.quiet();
	const newPaneId = result.stdout.toString().trim();

	if (!newPaneId) {
		console.error("Error: Failed to create new tab.");
		process.exit(1);
	}

	const db = initDb();
	registerPeerEdge(db, myPaneId, newPaneId, "child");
	db.close();

	console.log(`Created tab with pane ${newPaneId} and added to peer group.`);
}
