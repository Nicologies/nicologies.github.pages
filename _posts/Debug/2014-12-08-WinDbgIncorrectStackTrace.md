---
layout: post
title: WinDbg Incorrect Stack Trace
category : Debug
tags : [Debug, WinDbg, Dump]
original: false
---

copied from MDA-Anthology Page288.

One of mistakes beginners make is trusting WinDbg !analyze or kv commands displaying stack trace. WinDbg is only a tool, sometimes information necessary to get correct stack trace is missing and therefore some critical thought is required to distinguish between correct and incorrect stack traces. I call this pattern `Incorrect Stack Trace`. `Incorrect Stack Traces` usually

- Have WinDbg warning: "Following frames may be wrong"
- Don’t have the correct bottom frame like kernel32!BaseThreadStart (in user-mode)
- Have function calls that don’t make any sense
- Have strange looking disassembled function code or code that doesn’t make any sense from compiler perspective
- Have ChildEBP and RetAddr addresses that don’t make any sense

<!--more-->

Consider the following stack trace:

    0:011> k
    ChildEBP RetAddr
    WARNING: Frame IP not in any known module. Following frames may be wrong.
    0184e434 7c830b10 0×184e5bf 0184e51c 7c81f832 ntdll!RtlGetFullPathName_Ustr+0×15b
    0184e5f8 7c83b1dd ntdll!RtlpLowFragHeapAlloc+0xc6a
    **00099d30 00000000** ntdll!RtlpLowFragHeapFree+0xa7

Here we have almost all attributes of the wrong stack trace. At the first glance it looks like some heap corruption happened (runtime heap alloc and free functions are present) but if we give it second thought we would see that the low fragmentation heap Free function shouldn’t call low the fragmentation heap Alloc function and the latter shoudn’t query the full path name. That doesn’t make any sense.

What we should do here? Look at raw stack and try to build the correct stack trace ourselves. In our case this is very easy. We need to traverse stack frames from BaseThreadStart+0×34 until we don’t find any function call or reach the top. When func-tions are called (no optimization, most compilers) EBP registers are linked together as explained on the following slide from my Practical Foundations of Debugging seminars:

![ESP EBP Diagram](http://1.bp.blogspot.com/-CajdqBJzLZ8/UIKoYcwFHsI/AAAAAAAAAfo/ZHYjJB2Ml4M/s1600/stackebp.png)

    0:011> !teb
    TEB at 7ffd8000
    ExceptionList: 0184ebdc
    StackBase: 01850000
    StackLimit: 01841000
    ...
    0:011> dds 01841000 01850000
    01841000 00000000
    ...
    **0184eef0 0184ef0c**
    0184eef4 7615dff2 localspl!SplDriverEvent+0×21
    0184eef8 00bc3e08
    ...
    **0184ef0c 0184ef30**
    0184ef10 7615f9d0
    localspl!PrinterDriverEvent+0×46
    0184ef14 00bc3e08
    0184ef18 00000003
    ...
    0184ef2c 00bafcc0
    **0184ef30 0184f3f8**
    0184ef34 7614a9b4 localspl!SplAddPrinter+0×5f3
    0184ef38 00c3ec58
    ...
    **0184ff30 0184ff84**
    0184ff34 77c75286 RPCRT4!LRPC_ADDRESS::ReceiveLotsaCalls+0×3a
    0184ff38 0184ff4c
    0184ff3c 77c75296 RPCRT4!LRPC_ADDRESS::ReceiveLotsaCalls+0×4a
    0184ff40 7c82f2fc ntdll!RtlLeaveCriticalSection
    ...
    **0184ff84 0184ff8c**
    0184ff88 77c5778f RPCRT4!RecvLotsaCallsWrapper+0xd
    **0184ff8c 0184ffac**
    0184ff90 77c5f7dd RPCRT4!BaseCachedThreadRoutine+0×9d
    ...
    **0184ffac 0184ffb8**
    0184ffb0 77c5de88 RPCRT4!ThreadStartRoutine+0×1b
    0184ffb4 00088258
    **0184ffb8 0184ffec**
    0184ffbc 77e6608b kernel32!BaseThreadStart+0×34

Next we need to use custom `k` command and specify the base pointer. In our case the last found stack address that links `EBP` pointers is `0184eef0`:

    0:011> k L=0184eef0
    ChildEBP RetAddr WARNING: Frame IP not in any known module. Following frames may be wrong.
    0184eef0 7615dff2 0×184e5bf
    0184ef0c 7615f9d0 localspl!SplDriverEvent+0×21
    0184ef30 7614a9b4 localspl!PrinterDriverEvent+0×46
    0184f3f8 761482de localspl!SplAddPrinter+0×5f3
    0184f424 74067c8f localspl!LocalAddPrinterEx+0×2e
    0184f874 74067b76 SPOOLSS!AddPrinterExW+0×151
    0184f890 01007e29 SPOOLSS!AddPrinterW+0×17
    0184f8ac 01006ec3 spoolsv!YAddPrinter+0×75
    0184f8d0 77c70f3b spoolsv!RpcAddPrinter+0×37
    0184f8f8 77ce23f7 RPCRT4!Invoke+0×30
    0184fcf8 77ce26ed RPCRT4!NdrStubCall2+0×299
    0184fd14 77c709be RPCRT4!NdrServerCall2+0×19
    0184fd48 77c7093f RPCRT4!DispatchToStubInCNoAvrf+0×38
    0184fd9c 77c70865 RPCRT4!RPC_INTERFACE::DispatchToStubWorker+0×117
    0184fdc0 77c734b1 RPCRT4!RPC_INTERFACE::DispatchToStub+0xa3
    0184fdfc 77c71bb3 RPCRT4!LRPC_SCALL::DealWithRequestMessage+0×42c
    0184fe20 77c75458 RPCRT4!LRPC_ADDRESS::DealWithLRPCRequest+0×127
    0184ff84 77c5778f RPCRT4!LRPC_ADDRESS::ReceiveLotsaCalls+0×430
    0184ff8c 77c5f7dd RPCRT4!RecvLotsaCallsWrapper+0xd

Stack traces make more sense now but we don’t see BaseThreadStart+0×34. By default WinDbg displays only certain amount of function calls (stack frames) so we need to specify stack frame count, for example, 100:

    0:011> k L=0184eef0 100
    ChildEBP RetAddr WARNING: Frame IP not in any known module. Following frames may be wrong.
    0184eef0 7615dff2 0×184e5bf
    0184ef0c 7615f9d0 localspl!SplDriverEvent+0×21
    0184ef30 7614a9b4 localspl!PrinterDriverEvent+0×46
    ...
    0184ffac 77c5de88 RPCRT4!BaseCachedThreadRoutine+0×9d
    0184ffb8 77e6608b RPCRT4!ThreadStartRoutine+0×1b
    0184ffec 00000000 kernel32!BaseThreadStart+0×34

Now our stack trace looks much better. For another complete example please see **Manual Stack Trace Reconstruction** , page 157.

Sometimes incorrect stack trace is reported when symbols were not applied. Non-symbol gaps in stack traces can be the sign of this pattern too:

    STACK_TEXT:
    WARNING: Stack unwind information not available. Following frames may be wrong.
    00b2f42c 091607aa mydll!foo+0×8338
    00b2f4cc 7c83ab9e mydll!foo+0×8fe3
    00b2f4ec 7c832d06 ntdll!RtlFindNextActivationContextSection+0×46
    00b2f538 001a5574 ntdll!RtlFindActivationContextSectionString+0xe1
    00b2f554 7c8302b3 0×1a5574
    00b2f560 7c82f9c1 ntdll!RtlpFreeToHeapLookaside+0×22
    00b2f640 7c832b7f ntdll!RtlFreeHeap+0×20e
    001dd000 00080040 ntdll!LdrUnlockLoaderLock+0xad
    001dd00c 0052005c 0×80040
    001dd010 00470045 0×52005c
    0052005c 00000000 0×470045
