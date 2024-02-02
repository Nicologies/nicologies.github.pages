---
layout: post
title: Insert Value for Identity Column in MSSQL
tags : [SQL, Database]
category : Database
original: true
---

##Turn on IDENTITY_INSERT

Sometimes we want to copy a table that contains an identity column from another one exactly with the id column's values kept, e.g. Migration, Recovering from a backup table. In this case we need to turn on the `IDENTITY_INSERT`, which enables the ability to insert specific values into the target table. And after inserted we should turn it off to bring the behaviour back to normal.

The following commands work on MSSQLServer.

    # to turn on
    SET IDENTITY_INSERT YourTableName ON
    # to turn off
    SET IDENTITY_INSERT YourTableName OFF

> Written with [StackEdit](https://stackedit.io/).
