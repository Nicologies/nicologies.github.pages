---
layout: post
title : WinDbg Commands Cheatsheet
category : Debug
tags : [WinDbg, Debug]
original: true
---
k
=

Shows the stack of the current thread.

`kb` : Displays the first three arguments passed to each stack entry.

`kp` : Displays more information including the name and type of the parameters for each stack entry.

~
=

Shows all threads, the current been debugging thread will have a `dot` ahead like the thread `2` shown below.

    0:002> ~
    0  Id: 5a0.1f8 Suspend: 1 Teb: 7ffdd000 Unfrozen
    1  Id: 5a0.158 Suspend: 1 Teb: 7ffdc000 Unfrozen
    .  2  Id: 5a0.b28 Suspend: 1 Teb: 7ffdb000 Unfrozen

We can use `~*kb`(or `~*kp`) to enumerate all threads and print their stack trace information.

<!--more-->

~xs
===

I guess `s` might be interpreted as `set current thread` or `swith to`

This command will set the `x` thread as the current thread, where `x` is the thread num such as the `0`,`1` and `2`.

Please not the `x` is not the thread id (TID). Anyway we can use `~~[TID]s` to switch by the `TID`. What should be noted is that the `[]` is indispensable.

g
=

I guess it means `go` which instructs WinDbg to continue run after a breakpoint reached.

!runaway
========

Shows the CPU time of all threads. It's useful to troubleshoot infinite loops and performance issues.

    0:004> !runaway
    User Mode Time
    Thread       Time
    2:7b0       0 days 0:00:20.203
    0:790       0 days 0:00:00.015
    4:eb8       0 days 0:00:00.000
    3:8a4       0 days 0:00:00.000
    1:648       0 days 0:00:00.000

It shows the user mode time by default with an option to display kernel time and time since creation. The parameter could be `1`,`2`,`4` or a combination of these three.

- `1` shows user mode time
- `2` shows kernel mode time
- `4` shows the time since the creation of the thread.
- We can `LogicOR` the above options to show a combined result, e.g `!runaway 7` will show all the kinds of time because `7` = `1` \| `2` \| `4`

ld
=
`ld` can be used to load symbols for modules, but usually I will use `ld *` to list all modules.

x
=

Displays symbols that match the specified pattern
Shows the address of a function, e.g the address of `printf` is `77bd27c2` (maybe different on your computer.):

    x msvcrt!printf
    77bd27c2 msvcrt!printf = <no type information>

We can use wildcard with this command to list all the function/symbol from a specific dll e.g. `x  msvcrt!*`

ln
==

`ln address` tries to display symbols around the `address`

dv
==

`dv /i/t/V` shows the variables on the current stack frame.

see the document for details about the parameters.

!for\_each\_local
=================

Enumerates all the local variables in the current stack frame.

!for\_each\_frame dv
====================

Enumerates all stack frames and print the local variables.

u
=

Dissembles from an address

usage: `u StartAddress LLength`, e.g.

    u 0040ff12 L100

dds
===

Shows the memory and tries to display the symbols.

usage: `dds StartAddress LLength` e.g.

    dds 0040ff12 L20

s -a
=

`s` with the switcher `-a` can searches a string in the memory

usage: `s -a StartAddress LLength TheStringToSearch`
    s -a 0040ff12 L999999 "the string"

.frame
======

切换栈帧, 先用 kb/knL 将栈帧都打印出来, 再用 .frame 切换之.

    .frame 5

dt
==

`dt pObject` shows the type of `pObject` and its member variables.

`dt address CMyClass` interprets the address as a pointer to an object of CMyClass and display the information of the object.

ba
==

Sets a memory breakpoint at the given address.

e.g1 break whenever the first 4 bytes of the buffer changed. `r4` means read 4 bytes.

    ba r4 MyExe!buffer

e.g2 break whenever the first 4 bytes of the buffer changed. `w4` means write 4 bytes.

    ba w4 MyExe!buffer

The `MyExe!buffer` can be an address as well.
