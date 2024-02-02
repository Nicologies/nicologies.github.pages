---
layout: post
title: Investigate High CPU usage or Infinite Loop via WinDbg
tags : [Debug, WinDbg]
category : Debug
original : true
---
# Confirm the Issue

We can investigate it using TaskMgr, if the CPU is around 25%, 50% or 100% (depends on how many cores you have, e.g. for 4 cores, 25% mean the program used up 1 core.)

If the CPU rate is not high but the program hangs, it probably indicates a deadlock.

# Find the Thread

Note: WinDbg will suspend all thread, so we need to run the `g` command frequently if the program has something needs to run continuously, for example the program may disconnect from the server if suspended too long.

## Preparation

Open WinDbg and the Command window(alt+1)

- Attach to the process that you want to inspect using `File-->Attach to a process(F6)``. And run `g` in Command window immediately.
- See the instructions [here]({% post_url Debug/2015-01-31-DumpAnalysisViaWinDbg %}) to setup the Symbol File Path and don't forget to tick the `reload` check box. If you process cannot be suspended to long, then I would suggest just include the minimal necessary symbol files, especially you should exclude the Microsoft Symbol Server.

<!--more-->

## Find out the Thread

We can use `!runaway` to inspect the time each thread consumes. Now break the program (It may take a while to reload the symbol files after symbol file paths changed) and run the following command:

    !runaway;g

The `;g` above is to resume the program immediately after the `!runaway` command been executed.

    0:004> .reload //reloads the symbol files as the symbol file paths changed.
    Reloading current modules
    ......................................
    0:004> !runaway;g
    User Mode Time
    Thread       Time
    2:7b0       0 days 0:00:20.203
    0:790       0 days 0:00:00.015
    4:eb8       0 days 0:00:00.000
    3:8a4       0 days 0:00:00.000
    1:648       0 days 0:00:00.000

As shown above, we have 5 threads.

In the first column, the `2` in `2:7b0` is the index of the thread (depends on when it was created), and `7b0` is the ThreadId.

The second column shows the CPU time each thread consumes.

wait for a while and break the program again and run the `!runaway;g` command again.

0:004> !runaway;g
User Mode Time
Thread       Time
2:7b0       0 days 0:00:25.484
0:790       0 days 0:00:00.015
4:d80       0 days 0:00:00.000
3:8a4       0 days 0:00:00.000
1:648       0 days 0:00:00.000

Compare the two results, we can see the thread `2` consumes all the CPU time.

## Inspect the Stack Track

Break the program and run the `~2s;kb;g` command. `~2s` is to set the thread `2` as current thread, `kb` is to print the stack trace of the current thread, `g` is to resume the program.

And then we can get the stack trace:

0:004> ~2s
eax=00401480 ebx=0013f7fc ecx=00000000 edx=7c9585ec esi=000379b8 edi=000006d8
eip=00401480 esp=0111ff18 ebp=0111ff84 iopl=0         nv up ei pl nz na po nc
cs=001b  ss=0023  ds=0023  es=0023  fs=003b  gs=0000             efl=00000202
testwhile!ThreadFun:
00401480 ebfe            jmp     testwhile!ThreadFun (00401480)
0:002> kb
ChildEBP RetAddr  Args to Child
0111ff14 755422cb 00000000 00000000 00038b40 testwhile!ThreadFun [E:\testwhile\testwhileDlg.cpp @ 173]
0111ff84 77b9b530 0013f7fc 00000000 00000000 MFC42!Ordinal1184+0x15b
0111ffb8 7c82482f 00038aa8 00000000 00000000 msvcrt!endthreadex+0xa3
0111ffec 00000000 77b9b4bc 00038aa8 00000000 kernel32!GetModuleHandleA+0xdf
0:002> g

Usually, I will wait for a while and repeat the `~2s;kb;g` to see if the function is still doing the same thing. And then repeat again and again so I can confirm the problem or get an idea of what's wrong.
