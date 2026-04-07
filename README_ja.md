# @shoppingjaws/peer

WezTerm のペイン間でメッセージをやり取りしたり、ペインのグループ（peer group）を管理するための CLI ツールです。

## 前提条件

- [Bun](https://bun.sh/) ランタイム
- [WezTerm](https://wezfurlong.org/wezterm/) ターミナル上で動作すること

## インストール

```bash
npm install -g @shoppingjaws/peer
```

## コマンド一覧

```
peer <list|peek|inbox|new-pane|new-tab|history|clean>
```

### `peer list`

同じタブ内のペインと、peer group に属するペインを一覧表示します。

```bash
peer list
```

```
WINID  TABID  PANEID  RELATION  WORKSPACE  SIZE       TITLE
0      0      0       self      default    120x40     ~
0      0      1       child     default    120x20     ~
```

`RELATION` は自分から見た関係を示します：
- `self` — 自分自身
- `child` — 自分が作成したペイン
- `parent` — 自分を作成したペイン
- `none` — 同一タブだが peer 関係なし

### `peer peek <pane-id>`

指定したペインのターミナル出力を読み取ります。同一タブまたは peer group 内のペインのみ対象です。

```bash
peer peek 1
peer peek 1 --start-line 0 --end-line 50
```

| オプション | 説明 |
|---|---|
| `--start-line N` | 読み取り開始行 |
| `--end-line N` | 読み取り終了行 |

### `peer new-pane [opts] [-- cmd]`

現在のタブ内にペインを分割し、peer group に子として登録します。`--` 以降はペイン内で実行するコマンドです。オプションは `wezterm cli split-pane` にそのまま渡されます。

```bash
peer new-pane
peer new-pane --horizontal
peer new-pane -- bash
```

### `peer new-tab [opts] [-- cmd]`

新しいタブを作成し、peer group に子として登録します。オプションは `wezterm cli spawn` にそのまま渡されます。

```bash
peer new-tab
peer new-tab -- zsh
```

### `peer inbox send <pane-id> <message>`

指定したペインにメッセージを送信します。

```bash
peer inbox send 1 "ビルド完了しました"
```

### `peer inbox open`

自分宛の未読メッセージを表示し、既読にします。

```bash
peer inbox open
```

```
[#1 from:0 2025-04-05 12:00:00] ビルド完了しました
1 message(s) marked as read.
```

### `peer history [pane-id]`

メッセージ履歴を表示します。`pane-id` を指定すると、そのペインとの間のメッセージに絞り込みます。

```bash
peer history
peer history 1
```

### `peer clean`

現在のセッションのメッセージをすべて削除します。

```bash
peer clean
```

## データの保存先

メッセージと peer group の情報は `/tmp/peer/peer.db`（SQLite）に保存されます。セッション（`WEZTERM_UNIX_SOCKET`）ごとに分離されています。

## ライセンス

MIT
