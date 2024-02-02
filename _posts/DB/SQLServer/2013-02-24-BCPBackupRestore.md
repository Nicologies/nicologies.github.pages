---
layout: post
title: Use BCP to Backup/Restore Table
category : Database
tags : [Database]
original: true
---

## Backup/Export

    bcp YourDBName.dbo.YourTableName out YourOutputFilePath -U YourUserName -P YourPassword -S HostNameOfYourServer -c

## Restore/Import

    bcp YourDBName.dbo.YourTableName in YourDatabaseTableFilePath -U YourUserName -P YourPassword -S HostNameOfYourServer -c

详细参数参考 [这里](https://msdn.microsoft.com/en-au/library/ms162802.aspx)
