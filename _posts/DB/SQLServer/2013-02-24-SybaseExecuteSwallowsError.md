---
layout: post
title: Sybase Execute 不报错的问题
category : Database
tags : [Database, SQLServer]
original: true
---

仅仅sybase 的windows客户端有这个问题, isql 没有这个问题. select 的效果也是一样的.

执行以下代码, 若 MyTable 表已经存在, 执行会悄无声息. 不论 @sqlstr的值是什么(比如set @sqlstr=“asbsdf”), 都不会报错.

    declare @sqlstr varchar(1024)
    set @sqlstr =
        'create table MyTable (
            DiskId              int                 identity,
            NruId               char(32)            not null,
            DiskName            varchar(128)        null,
            LastOfflineTime     int                 null,
            constraint MyTable primary key(DiskId)
        )with identity_gap = 100'

    IF NOT EXISTS(select name from sysobjects where name = 'MyTable')
    EXECUTE (@sqlstr)
    go

经过研究发现, 只要 set/select 一出, EXECUTE 就不与争锋了. 具体原因不明.

    declare @sqlstr varchar(1024)
    set @sqlstr = 'ssdf'
    EXECUTE ("absc")
    go

解决方法 目前暂时将语句放入EXECUTE中, 不使用set语句.

    IF NOT EXISTS(select name from sysobjects where name = 'MyTable')
    EXECUTE (
        'create table MyTable (
            DiskId              int                 identity,
            NruId               char(32)            not null,
            DiskName            varchar(128)        null,
            LastOfflineTime     int                 null,
            constraint MyTable primary key(DiskId)
        )with identity_gap = 100'
    )
    go
