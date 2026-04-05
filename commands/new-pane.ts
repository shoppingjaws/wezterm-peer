import { $ } from "bun";

export async function cmdNewPane(args: string[]) {
	const splitArgs: string[] = [];
	let commandArgs: string[] = [];

	const separatorIndex = args.indexOf("--");
	if (separatorIndex >= 0) {
		splitArgs.push(...args.slice(0, separatorIndex));
		commandArgs = args.slice(separatorIndex + 1);
	} else {
		splitArgs.push(...args);
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

	console.log(`Created pane ${newPaneId}.`);
}
