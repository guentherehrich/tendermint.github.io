
## A First Example

Make sure you [have Go installed](https://golang.org/doc/install) and [put `$GOPATH/bin` in your `$PATH`](https://github.com/tendermint/tendermint/wiki/Setting-GOPATH).

Next, install the `tmsp-cli` tool and example applications:

```
go get -u github.com/tendermint/tmsp/cmd/...
```

Now run `tmsp-cli --help` to see the list of commands:

```
COMMANDS:
   batch        Run a batch of TMSP commands against an application
   console      Start an interactive console for multiple commands
   echo         Have the application echo a message
   info         Get some info about the application
   set_option   Set an option on the application
   append_tx    Append a new tx to application
   check_tx     Validate a tx
   commit       Get application Merkle root hash
   help, h      Shows a list of commands or help for one command
   
GLOBAL OPTIONS:
   --address "tcp://127.0.0.1:46658"    address of application socket
   --help, -h                           show help
   --version, -v                        print the version
```

The `tmsp-cli` tool lets us send TMSP messages to our application, to help build and debug them.

The most important messages are `append_tx`, `check_tx`, and `commit`,
but there are others for convenience, configuration, and information purposes.

Let's start a dummy application. The dummy just stores transactions in a merkle tree:

```
dummy
```

In another terminal, run 

```
tmsp-cli echo hello
tmsp-cli info
```

The application should echo `hello` and give you some information about itself.

A TMSP application must provide two things:

  - a socket server
  - a handler for TMSP messages

When we run the `tmsp-cli` tool we open a new connection to the application's socket server, 
send the given TMSP message, and wait for a response.

The server may be generic for a particular language, and we provide one for Go in `tmsp/server`.
There is one for Python in `example/python/tmsp/server.py`, and one for Node JS in `github.com/tendermint/js-tmsp`. 

The handler is specific to the application, and may be arbitrary, 
so long as it is deterministic and conforms to the TMSP interface specification.

So when we run `tmsp-cli info`, we open a new connection to the TMSP server, which calls the `Info()` method on the application, which tells us the number of transactions in our Merkle tree.

Now, since every command opens a new connection, we provide the `tmsp-cli console` and `tmsp-cli batch` commands, 
to allow multiple TMSP messages to be sent over a single connection.

Running `tmsp-cli console` should drop you in an interactive console for speaking TMSP messages to your application.

Try running these commands:

```
> echo hello
-> data: {hello}

> info 
-> data: {size:0}

> commit 

> append_tx abc
-> code: OK

> info 
-> data: {size:1}

> commit 
-> data: {750502FC7E84BBD788ED589624F06CFA871845D1}

> query abc
-> code: OK
-> data: {Index=0 value=abc exists=true}

> append_tx def=xyz
-> code: OK

> commit 
-> data: {76393B8A182E450286B0694C629ECB51B286EFD5}

> query def
-> code: OK
-> data: {Index=1 value=xyz exists=true}

```

Note that if we do `append_tx abc` it will store `(abc, abc)`, 
but if we do `append_tx abc=efg` it will store `(abc, efg)`.

Similarly, you could put the commands in a file and run `tmsp-cli --verbose batch < myfile`.


## Another Example

Now that we've got the hang of it, let's try another application, the "counter" app.

The counter app doesn't use a Merkle tree, it just counts how many times we've sent a transaction,
asked for a hash, or committed the state. The result of `commit` is just the number of transactions sent.

This application has two modes: `serial=off` and `serial=on`.

When `serial=on`, transactions must be a big-endian encoded incrementing integer, starting at 0.

If `serial=off`, there are no restrictions on transactions.

We can toggle the value of `serial` using the `set_option` TMSP message.

When `serial=on`, some transactions are invalid. 
In a live blockchain, transactions collect in memory before they are committed into blocks.
To avoid wasting resources on invalid transactions,
TMSP provides the `check_tx` message, 
which application developers can use to accept or reject messages, 
before they are stored in memory or gossipped to other peers.

In this instance of the counter app, `check_tx` only allows transactions whose integer is greater than the last committed one.

Let's kill the console and the dummy application, and start the counter app:

```
counter
```

Again, the code is just 

```go
server.StartListener("tcp://0.0.0.0:46658", example.NewCounterApplication())
```

where the CounterApplication is defined in `example/golang/counter.go`, and implements the TMSP application interface.

In another window, start the `tmsp-cli console`:

```
> set_option serial on
-> data: {serial=on}

> check_tx 0x00
-> code: OK

> check_tx 0xff
-> code: OK

> append_tx 0x00
-> code: OK

> check_tx 0x00
-> code: BadNonce
-> log: Invalid nonce. Expected >= 1, got 0

> append_tx 0x01
-> code: OK

> append_tx 0x04
-> code: BadNonce
-> log: Invalid nonce. Expected 2, got 4

> info 
-> data: {hashes:0, txs:2}
```

This is a very simple application, but between `counter` and `dummy`, its easy to see how you can build out arbitrary application states on top of the TMSP.
In the near future, `erisdb` of Eris Industries will also run atop TMSP, bringing with it Ethereum-like accounts, the Ethereum virtual-machine, Eris's permissioning scheme, and native contracts extensions.

But the ultimate flexibility comes from being able to write the application easily in any language. 

We have implemented the counter in a number of languages (see the example directory).

To run the Node JS version, checkout the `github.com/tendermint/js-tmsp` repo, `cd` to `example` and run 

```
node app.js
```

(you'll have to kill the other counter application process). 
In another window, run the console and those previous TMSP commands. 
You should get the same results as for the Go version.

Want to write the counter app in your favorite language?! We'd be happy to accept the pull request!

## Next steps

In the next tutorial, we will show how to [launch a TMSP testnet](/tutorials/launch-a-tmsp-testnet).
