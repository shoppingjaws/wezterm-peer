#!/usr/bin/env bun
import { cmdClean } from "./commands/clean.ts";
import { cmdHistory } from "./commands/history.ts";
import { cmdList } from "./commands/list.ts";
import { cmdNewPane } from "./commands/new-pane.ts";
import { cmdNewTab } from "./commands/new-tab.ts";
import { cmdOpen } from "./commands/open.ts";
import { cmdPeek } from "./commands/peek.ts";
import { cmdSend } from "./commands/send.ts";

const [command, ...args] = process.argv.slice(2);

switch (command) {
	case "list":
		await cmdList();
		break;
	case "peek": {
		const paneId = args[0];
		if (!paneId) {
			console.error(
				"Usage: peer peek <pane-id> [--start-line N] [--end-line N]",
			);
			process.exit(1);
		}
		await cmdPeek(paneId, args.slice(1));
		break;
	}
	case "inbox": {
		const subcommand = args[0];
		switch (subcommand) {
			case "send": {
				const paneId = args[1];
				const message = args.slice(2).join(" ");
				if (!paneId || !message) {
					console.error("Usage: peer inbox send <pane-id> <message>");
					process.exit(1);
				}
				await cmdSend(paneId, message);
				break;
			}
			case "open":
				cmdOpen();
				break;
			default:
				console.log("Usage: peer inbox <open|send>");
				console.log("");
				console.log("Subcommands:");
				console.log("  open                   Show and mark as read unread messages");
				console.log("  send <pane-id> <msg>   Send a message to a pane");
				process.exit(subcommand ? 1 : 0);
		}
		break;
	}
	case "new-pane":
		await cmdNewPane(args);
		break;
	case "new-tab":
		await cmdNewTab(args);
		break;
	case "history":
		cmdHistory(args[0]);
		break;
	case "clean":
		cmdClean();
		break;
	default:
		console.log("Usage: peer <list|peek|inbox|new-pane|new-tab|history|clean>");
		console.log("");
		console.log("Commands:");
		console.log("  list                   List panes (same tab + peer group)");
		console.log("  peek <pane-id>         Read terminal text from a pane");
		console.log("  inbox <open|send>      Manage inbox messages");
		console.log("  new-pane [opts] [--description text] [-- cmd]  Split a new pane");
		console.log("  new-tab  [opts] [--description text] [-- cmd]  Spawn a new tab");
		console.log("  history [pane-id]      Show message history");
		console.log("  clean                  Reset the message database");
		process.exit(command ? 1 : 0);
}
