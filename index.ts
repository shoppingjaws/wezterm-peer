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
	case "send": {
		const paneId = args[0];
		const message = args.slice(1).join(" ");
		if (!paneId || !message) {
			console.error("Usage: peer send <pane-id> <message>");
			process.exit(1);
		}
		await cmdSend(paneId, message);
		break;
	}
	case "new-pane":
		await cmdNewPane(args);
		break;
	case "new-tab":
		await cmdNewTab(args);
		break;
	case "open":
		cmdOpen();
		break;
	case "history":
		cmdHistory(args[0]);
		break;
	case "clean":
		cmdClean();
		break;
	default:
		console.log("Usage: peer <list|peek|send|new-pane|new-tab|open|history|clean>");
		console.log("");
		console.log("Commands:");
		console.log("  list                   List panes (same tab + peer group)");
		console.log("  peek <pane-id>         Read terminal text from a pane");
		console.log("  send <pane-id> <msg>   Send a message to a pane");
		console.log("  new-pane [opts] [-- cmd]  Split a new pane in current tab");
		console.log("  new-tab  [opts] [-- cmd]  Spawn a new tab and add to peer group");
		console.log("  open                   Show and mark as read unread messages");
		console.log("  history [pane-id]      Show message history");
		console.log("  clean                  Reset the message database");
		process.exit(command ? 1 : 0);
}
