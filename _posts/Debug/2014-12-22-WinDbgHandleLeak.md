---
layout: post
title: Handle Leak Analysis via WinDbg
category : Debug
tags : [Debug, WinDbg]
original : true
---

This article illustrates how to investigate the handle leak via WinDbg.

The idea is to take two snapshots and compare them to find out the code where handle was allocated during the period.

<!--more-->

## Prerequisite

- We have the symbol file (usually PDB) of the application and modules.
- The handle leaking is reproducible, you know how to trigger the leaking, but don't know exactly the reason or the code where causes the bug.

## Steps

### Enable Handle Trace

Break the application in WinDbg (Use Ctrl+Break) and then enable the handle trace using the following command.

    !htrace -enable
    g


### Take a Snapshot of the Current Handles

Break the application again and take a snapshot using the following command

    !htrace -snapshot
    g

### Trigger the Leaking

Run the operation which caused the handle leaking problem.

Monitor the application in TaskMgr, and find the number of handles is increasing.

### Compare the Snapshots

Now, break the application again and use `-diff` to compare the current value with the snapshot we took before and WinDbg will show the code where handles were allocated.

    !htrace -diff
