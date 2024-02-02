---
layout: post
title: Get Recent SQLServer Queries from the Server Side via DMV
category : Database
tags : [Database, SQLServer, DMV]
original: true
---

This article discusses how to get the recent queries as well as the last or current running query for a specific SPID.

## Get Recent Queries from the Query Cache

The idea is to find the `sql_handle` for the recently executed queries from the `dm_exec_query_stats` table and then find the underlying SQL text from the `dm_exec_sql_text` table for the `sql_handles`. Below shows the query to achieve the goal:

    SELECT  sql_text.text, last_execution_time, creation_time
    FROM    sys.dm_exec_query_stats AS stats
            CROSS APPLY sys.dm_exec_sql_text(stats.sql_handle) AS sql_text
    order by last_execution_time DESC

<!--more-->

## Get Last Query for a specific SPID

Get last or current running query is useful when troubleshooting dead lock problems.

E.g. when a query is been blocking by another process, we can use `exec sp_who2` to find out the `spid` of that process and then get its current running query.

To get the last query, we can use `DBCC INPUTBUFFER` or via DMV.

### DBCC INPUTBUFFER

It's quite simple and straightforward, all we need is just pass the spid to it.

    DBCC INPUTBUFFER(55) -- replace 55 with your real spid.

The limitation of this method is that the size by default is char(255), as a result the text will be truncated if exceeds 255.

Fortunately, Microsoft introduced(since SQLServer 2005) a new `DMV` way to get the full query text as described below.

### DMV

The idea is to find the sql_handle for the spid and then transform the `sql_handle` to query text via `DMV`.

    select query_text.text  from sys.sysprocesses as spids

    cross apply sys.dm_exec_sql_text(spids.sql_handle) as query_text

    where spids.spid = 55 -- replace with your concrete predicator.
