[![Open in Gitpod](https://img.shields.io/badge/Open_in-Gitpod-white?logo=gitpod)](https://gitpod.io/#FOLDER=vara-man/https://github.com/gear-foundation/dapps)
[![Docs](https://img.shields.io/github/actions/workflow/status/gear-foundation/dapps/contracts.yml?logo=rust&label=docs)](https://dapps.gear.rs/vara_man_io)

# Five in a Row

### 🏗️ Building

```sh
cargo b -p "tic-tac-toe*"
```

### ✅ Testing

```sh
cargo t -p "tic-tac-toe*"
```

### Config
`sPerBlock`, `gasToRemoveGame`, `timeInterval` are used when removing game instance (game end).

Pay attention to `gasToRemoveGame`, setting it too low may trigger Error in sending message.

`turnDeadlineMs`: the maximum time for each turn in milisecond.
Sample Config:
```
{
    "Config": {
        "sPerBlock": "3",
        "gasToRemoveGame": "20,000,000,000",
        "timeInterval": "20",
        "turnDeadlineMs": "30,000"
    }
}
```