# @shoppingjaws/peer

A CLI tool for managing WezTerm panes, peer groups, and inter-pane messaging.

## Prerequisites

- [Bun](https://bun.sh/) runtime
- [WezTerm](https://wezfurlong.org/wezterm/) terminal

## Install

```bash
npm install -g @shoppingjaws/peer
```

## Commands

```
peer <list|peek|inbox|new-pane|new-tab|history|clean>
```

### `peer list`

List panes in the same tab and peer group.

```bash
peer list
```

```
WINID  TABID  PANEID  RELATION  WORKSPACE  SIZE       TITLE
0      0      0       self      default    120x40     ~
0      0      1       child     default    120x20     ~
```

`RELATION` shows the relationship from your perspective:
- `self` — current pane
- `child` — pane you created
- `parent` — pane that created you
- `none` — same tab but no peer relation

### `peer peek <pane-id>`

Read terminal output from a pane. Only works for panes in the same tab or peer group.

```bash
peer peek 1
peer peek 1 --start-line 0 --end-line 50
```

| Option | Description |
|---|---|
| `--start-line N` | Start reading from line N |
| `--end-line N` | Stop reading at line N |

### `peer new-pane [opts] [-- cmd]`

Split a new pane in the current tab and register it as a child in the peer group. Options are passed through to `wezterm cli split-pane`.

```bash
peer new-pane
peer new-pane --horizontal
peer new-pane -- bash
```

### `peer new-tab [opts] [-- cmd]`

Spawn a new tab and register it as a child in the peer group. Options are passed through to `wezterm cli spawn`.

```bash
peer new-tab
peer new-tab -- zsh
```

### `peer inbox send <pane-id> <message>`

Send a message to the specified pane.

```bash
peer inbox send 1 "build done"
```

### `peer inbox open`

Show unread messages and mark them as read.

```bash
peer inbox open
```

```
[#1 from:0 2025-04-05 12:00:00] build done
1 message(s) marked as read.
```

### `peer history [pane-id]`

Show message history. Optionally filter by a specific pane.

```bash
peer history
peer history 1
```

### `peer clean`

Delete all messages for the current session.

```bash
peer clean
```

## Data Storage

Messages and peer group data are stored in `/tmp/peer/peer.db` (SQLite), isolated per session (`WEZTERM_UNIX_SOCKET`).

## License

MIT
