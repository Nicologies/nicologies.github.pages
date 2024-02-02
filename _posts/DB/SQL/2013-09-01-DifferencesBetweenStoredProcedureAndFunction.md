---
layout: post
title: Differences between StoredProcedure and UDF
tags : [SQL, StoredProcedure, Database]
category : Database
---

The differences between Stored Procedure (SP) and User Defined Functions (UDF) in MSSQL

|Ability| SP		| UDF		|
| ------------- |---------------|-----------------|
|Return Values| Can return zero, single or multiple values     | Mandatory to return one and only one value|
|Can use transaction | Yes| No|
|Can have input/output parameters| Both  | Input parameters only|
|Interop|Can call functions from SP| Cannot call SP from function|
|Can be used in `SELECT` `WHERE` `HAVING` statement|No|Yes|
|Exception Handling|Yes, can Try-Catch|NO|


> Written with [StackEdit](https://stackedit.io/).
