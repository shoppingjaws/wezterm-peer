import { $ } from "bun";
import { initDb } from "../db.ts";
import { getMyPaneId, registerPeerEdge } from "../pane.ts";

export async function cmdNewTab(args: string[]) {
	const myPaneId = getMyPaneId();

	const spawnArgs: string[] = [];
	let commandArgs: string[] = [];
	let description: string | undefined;

	// Extract --description option before separator processing
	const filteredArgs: string[] = [];
	for (let i = 0; i < args.length; i++) {
		if (args[i] === "--description" && i + 1 < args.length) {
			description = args[i + 1]!;
			i++;
		} else {
			filteredArgs.push(args[i]!);
		}
	}

	const separatorIndex = filteredArgs.indexOf("--");
	if (separatorIndex >= 0) {
		spawnArgs.push(...filteredArgs.slice(0, separatorIndex));
		commandArgs = filteredArgs.slice(separatorIndex + 1);
	} else {
		spawnArgs.push(...filteredArgs);
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
	registerPeerEdge(db, myPaneId, newPaneId, "child", description);
	db.close();

	console.log(`Created tab with pane ${newPaneId} and added to peer group.`);
}
