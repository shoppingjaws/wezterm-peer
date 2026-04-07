import { $ } from "bun";
import { initDb } from "../db.ts";
import { getMyPaneId, registerPeerEdge } from "../pane.ts";

export async function cmdNewPane(args: string[]) {
	const myPaneId = getMyPaneId();

	const splitArgs: string[] = [];
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
		splitArgs.push(...filteredArgs.slice(0, separatorIndex));
		commandArgs = filteredArgs.slice(separatorIndex + 1);
	} else {
		splitArgs.push(...filteredArgs);
	}

	if (commandArgs.length > 0) {
		splitArgs.push("--", ...commandArgs);
	}

	const result =
		await $`wezterm cli split-pane ${splitArgs}`.quiet();
	const newPaneId = result.stdout.toString().trim();

	if (!newPaneId) {
		console.error("Error: Failed to create new pane.");
		process.exit(1);
	}

	const db = initDb();
	registerPeerEdge(db, myPaneId, newPaneId, "child", description);
	db.close();

	console.log(`Created pane ${newPaneId} and added to peer group.`);
}
