---
layout: post
title: Identity Gap in Sybase and SQLServer
category : Database
tags : [Database, SQLServer]
original: true
---
sybase中关于自增字段的一个概念
名字叫identity cache 更合适一点.默认值为500,000,000,000,000.

假定 `identity_gap = 100`

sybase将为你的自增字段缓存 100(identity_gap的值) 个值到内存.

比如自增字段X的当前值是1的话,sybase已经缓存1-100到内存,并将100这个数字记录到硬盘.当这100个数用完时,sybase会再分配101-200到内存,并将200这个数记录到硬盘.

如果正好意外断电了.sybase启动时就将200这个数读出来,于是分配201-300到内存.并记录300这个数到硬盘.

如果我们没有设置identity_gap的值,sybase会使用默认值500,000,000,000,000,于是断电之后就会出现500,000,000,000,001这种大数.

使用以下sql语句在创建表时设置identity_gap

    create table MyRecord (......)
    with identity_gap = 100
    go
