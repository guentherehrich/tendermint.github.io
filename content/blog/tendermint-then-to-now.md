---
title: "Tendermint: from Then to Now"
description: "The history of Tendermint, and information on the latest release and more"
date: "2016-09-17"
categories: 
    - "Tendermint"
---

## Tendermint: from Then to Now

Some of you have asked about the history of [Tendermint](http://tendermint.com/), so here it is. Back in the day, we had some serious concerns about Bitcoin as a global currency, mainly because it is incredibly [energy intensive](http://motherboard.vice.com/read/bitcoin-could-consume-as-much-electricity-as-denmark-by-2020). So we started Tendermint to develop a more environmentally friendly cryptocurrency. 

But what started as a simple cryptocurrency based on an adaptation of a [1980’s consensus algorithm called DLS](http://groups.csail.mit.edu/tds/papers/Lynch/jacm88.pdf) eventually evolved into what it is today: a general purpose Byzantine fault tolerant (BFT) consensus algorithm for running replicated state machines over the internet in possibly adversarial conditions.

Replicated state machines are a staple of modern Internet technology. They permit a consistent and fault-tolerant view of some set of data. Popular open-source implementations of replicated state machines include [Apache ZooKeeper](http://bookkeeper.apache.org/), [CoreOS' etcd](https://coreos.com/etcd/), and [Hashicorp's Consul](https://www.consul.io/). 

In each of these, the state machine is a simple key-value store, and the underlying consensus algorithm is either Paxos or [Raft](https://raft.github.io/). Neither of these algorithms tolerate even a single malicious node in the system. You can see an animation of the Paxos algorithm [here](http://harry.me/blog/2014/12/27/neat-algorithms-paxos/). 

In contrast, Tendermint lets you build arbitrary state machines in any programming language, whether that is a key-value store in Go, a voting system in C++, or a cryptocurrency in OCaml. In each case, the application implements a simple interface, and Tendermint handles the rest, including connecting to peers, syncing the latest state, gossipping transactions, and maintaining a consistent log of transactions.

## Who is using Tendermint?

It’s been an exciting journey, and over the past few months people have been putting Tendermint to work in several applications. 

Probably the most complicated implementation of Tendermint so far is by Eris Industries. Eris is using Tendermint to power its [eris:db](https://erisindustries.com/components/erisdb/) blockchain client. Eris:db includes a fully compatible Ethereum virtual machine and other features that make it a full-fledged blockchain. 

But there are other implementations. [CloudSoft](http://www.cloudsoft.io/) published a [deployment strategy](http://www.cloudsoft.io/tendermint-and-clocker/) for Apache Brooklyn that uses Tendermint and Clocker. Martin Dyring wrote an [implementation of Tendermint TMSP in C++](https://github.com/mdyring/cpp-tmsp), and wolfposd wrote a [chatroom app in Java](https://github.com/wolfposd/TMChat) that uses Tendermint to broadcast messages from one user to another. Yes, that’s right, a chatroom. 

While it might sound crazy to run a chat application on a blockchain, this is simply an example of the flexibility of Tendermint. This sort of implementation might even come in handy in instances where you have several actors who are malicious and maintaining the total order of the system matters, for instance, in p2p gaming.

Other companies building on Tendermint include [Blockfreight](https://blockfreight.com/), [Vidroll](http://www.vidroll.com/), and [Stratumn](https://stratumn.com/) to name a few. Of course, we use Tendermint too. Our first product built on Tendermint is [Cosmos, the internet of blockchains](http://cosmos.network/).

## What’s new? 

In August 2016, we released Tendermint v0.7.0, the first stable release of our middleware. It featured a weakly-synchronous BFT consensus algorithm, which can process thousands of transactions per second with latencies on the order of a second and cluster sizes ranging from 4 to 64 nodes.

Recently we released [Tendermint v0.7.1](https://github.com/tendermint/tendermint), which includes a variety of fixes, as well as the ability for applications to determine what peers Tendermint can connect to and filtering either by IP address, or by public key.

In the next major release, Tendermint v0.8.0, which should be in October, we plan to introduce a handshake between Tendermint and whatever application is using it, ensuring the two stay synced even after crashes and restarts. 

Additionally, we’ll include some important fixes to the BFT consensus module. While testing Tendermint in adversarial conditions, we discovered a Byzantine node could potentially halt the system in some circumstances—this fix will prevent that from happening. 

This is critical because even though the Tendermint consensus algorithm guarantees your blockchain won't fork, all of the subcomponents need to work perfectly to ensure liveness.

Stay tuned for more updates. We are continuing to test Tendermint extensively in a push to provide a production ready offering in early 2017. And, if you are using Tendermint in a project, [let us know](https://docs.google.com/a/tendermint.com/forms/d/e/1FAIpQLSclH87WiZrer8aUzO5oNWoSCqcbn4mwQ3sDJJX44E9rhdVJFw/viewform?c=0&w=1)! We want to hear how you’re using it and what your feedback is. 
