---
layout: post
title: Dump Analysis via WinDbg
category : Debug
tags : [Debug, WinDbg]
original : true
---

In computing, a core dump (in Unix parlance), memory dump, or system dump consists of the recorded state of the working memory of a computer program at a specific time, generally when the program has terminated abnormally (crashed). In practice, other key pieces of program state are usually dumped at the same time, including the processor registers, which may include the program counter and stack pointer, memory management information, and other processor and operating system flags and information. Core dumps are often used to assist in diagnosing and debugging errors in computer programs. -- from Wikipedia's [Core Dump](http://en.wikipedia.org/wiki/Core_dump) page.

This article figures out the steps to investigate a dump file for exception information and stack trace via WinDbg.

<!--more-->

## Config the Symbol Path

Press `Ctrl+S` or `File->Symbols` to setup the symbol(PDB) path, so WinDbg can translate the instructions(assemble) into meaningful function names.

e.g. In the popup dialog we can have the following two symbol paths separated by semicolon:

    symsrv*symsrv.dll*d:\localsymbols*http://msdl.microsoft.com/download/symbols;
    D:\workspace\myapplication\debug\

The first path is the Microsoft symbol server, where WinDbg can download symbol files for Microsoft's dlls to d:\localsymbols(you can change to wherever you like). It helps to display symbol information of system(Microsoft) modules. This path is optional, and may slow down the debugger.

The second path is where the crashed application's PDB located, please be sure the PDB in the folder was generated at the time when the application been debugging was built, because symbol file is just the map between you binary and code. So whenever the application is released, we should keep a copy of the symbol files for future debugging.

## Analyze the Dump File.

Press `Ctrl+D` or `File->Open Dump File` to load the dump file.

Call the `analyze` command once the dump file loaded.

    !analyze -v

Then WinDbg will show the exception information and stack trace(most recently on the top) like:

    ......
    EXCEPTION_RECORD: ffffffff -- (.exr ffffffffffffffff)
    ExceptionAddress: 77b92f4a (msvcrt!_mbsnbcpy+0x0000004f)
    ExceptionCode: c0000005 (Access violation)
    ExceptionFlags: 00000000
    NumberParameters: 2
    Parameter[0]: 00000001
    Parameter[1]: 00000000
    Attempt to write to address 00000000
    LAST_CONTROL_TRANSFER: from 0040155f to 77b92f4a
    STACK_TEXT
    0013f7c4 00401c55 00000000 00404080 00000003 msvcrt!mbsnbcpy+0x4f
    0013f7d8 00401b47 00000000 00404080 00000003 CrashRptTest!_tcsncpy+0x15 [tchar.h @ 786]
    0013f848 0040161b 0000000c 0013fe8c 0013f868 CrashRptTest!TestUnHandledException+0x11c
    [......testhelper.cpp @ 151]
    0013f858 7552e938 00000000 754e650c 0013f89c CrashRptTest!CCrashRptTestDlg::OnOK+0xe
    [......CrashRptTestDlg.cpp @ 178]

From the first few lines above the `STACK TEXT`, we can see the program crashed at address 0x77b92f4a because of c0000005 (Access violation) when attempting to write to address 00000000.

From the STACK TEXT we can see `OnOK` called `TestUnHandledException`, `TestUnHandledException` called `_tcsncpy`, and finally crashed at `msvcrt::mbsnbcpy`. Additionally, WinDbg also tells us the file name is CrashRptTestDlg.cpp and line number is 178 (the line number is approximate, as optimization of release version).

Note: The first column of the stack text is the address the function was placed in the stack, the second columns is the function's address, the rests are the first 3 arguments passed to the function.

## Recover from UnHandledExceptionFilter

Sometimes it's not able to get the correct stack, but instead can see an UnHandledExceptionFilter in the stack trace. In this case we need to switch context and find out the real stack.

- Use `~*kb` to print stack trace for all threads and try to find UnHandledExceptionFilter.

<!-- hack for code after list item -->

    ChildEBP RetAddr Args to Child
    0012f74c 7c821b74 77e99ea d0000144 00000004 ntdll!KiFastSystemCallRet
    0012f750 77e999ea d0000144 00000004 00000000 ntdll!ZwRaiseHardError+0xc
    0012f9bc 004339be 0012fa08 7ffdd000 0044c4d8 kernel32!UnHandledExceptionFilter+0x4b4


The first argument of UnHandledExceptionFilter `0012fa08` stores the exception information and context.

- Use `dd` to inspect `0x0012fa08`

<!-- hack for code after list item -->

    0:000> dd 0x0012fa08
    0012fa08 0012faf4 0012fb10 0012fa37 7c82eeb2

The second column `0012faf4` stores the exception information. We can use .exr to inspect it as described later.

The third column `0012fb10` stores the exception context. We can use .cxr to switch to the context and inspect the stack track.

- Use `.exr` to Inspect the Exception Information

<!-- hack for code after list item -->

    0:000> .exr 0012faf4
    ExceptionAddress: 0041a5a8 (release_crash!main+0x00000028)
    ExceptionCode: c0000005(Access violation)
    ExceptionFlags: 0000000
    NumberParameters: 2
    Pararmeter[0]: 00000001
    Pararmeter[1]: 00000000
    Attempt to write to address 00000000

- Use `.cxr` to Switch to the Context and Inspect the Stack Trace

<!-- hack for code after list item -->

    0:000 .cxr 0012fb10
    eax=00000000 ebx=7ffde000 ecx=00000000 ......
    release_crash!main+0x28:
    0041a5a8 c60000 mov byte ptr [eax],0x0 ds:0023:00000000=??

After switched, we can use `kb` to print the stack track

<!-- hack for code after list item -->

    *** Stack trace for last set context - .thread/.cxr resets it
    ChildEBP RetAddr Args to Child
    0012fedc 00427c90 00000001 00361748 003617d0 release_crash!main+0x28[c:\src\release_crash.cpp@51]
    0012ffc0 77e523cd 00000000 00000000 7ffde000 release_crash!mainCRTStartup+0x170
    0012fff0 00000000 00418b18 00000000 78746340 kernel32!BaseProcessStart+0x23

## Incorrect Stack Trace

One of mistakes beginners make is trusting WinDbg `!analyze` or `kv` commands displaying stack trace. WinDbg is only a tool, sometimes information necessary to get correct stack trace is missing and therefore some critical thought is required to distinguish between correct and incorrect stack traces. I call this pattern Incorrect Stack Trace. Incorrect Stack Traces usually

- Have WinDbg warning: "Following frames may be wrong"
- Don’t have the correct bottom frame like kernel32!BaseThreadStart (in user-mode)
- Have function calls that don’t make any sense
- Have strange looking disassembled function code or code that doesn’t make any sense from compiler perspective
- Have ChildEBP and RetAddr addresses that don’t make any sense

See [here]({% post_url /Debug/2014-12-08-WinDbgIncorrectStackTrace %}) for more.
