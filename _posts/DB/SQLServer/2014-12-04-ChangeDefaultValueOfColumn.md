---
layout: post
title: How to change the DEFAULT value for a column
tags : [SQL, Database]
category : Database
original: true
---

###First, drop the existing default constraint if necessary
If the column already has a default value, we can get the existing default constraint name from the Table Designer or DDL.

And then we need to drop the constraint using the command shown below:

    ALTER TABLE dbo.YouTableName DROP CONSTRAINT TheExistingConstrainName;

###Add a new default constraint

    ALTER TABLE dbo.YouTableName ADD CONSTRAINT YourNewConstraintName
    DEFAULT YourNameDefaultValue FOR YourColumnName;


Alternatively, you can reuse the `TheExistingConstraintName` instead of `YourNewConstrainName`
> Written with [StackEdit](https://stackedit.io/).
