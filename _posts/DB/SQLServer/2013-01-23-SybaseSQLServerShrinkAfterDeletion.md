---
layout: post
title: Release reserved space after massive deletion in Sybase
category : Database
tags : [Database,]
original: true
---

删除大量数据后表的 space reserved 会比较大.

可使用 reorg 来减少之.

reorg rebuild YourTableName

速度很慢的.
