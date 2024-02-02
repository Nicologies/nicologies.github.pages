---
layout: post
title: Extract SQL Query From Linq Expression
tags : [SQL, Linq]
category : Database
---
* auto-gen TOC:
{:toc}

##How to Extract sql query from LINQ expressions?

###GetCommand
You can use the DataContext.GetCommand method to get the generated SQL:

    var query = dataContext.Persons.Where(p => p.Name == "Alice");
    string generatedSql = dataContext.GetCommand(query).CommandText;

###Display in VisualStudio Output Window
Redirect/set the DataContext's log to Console.Out. Then we can see the SQL statements in the VisualStudio's output window when the query gets executed.

    dataContext.Log = Console.Out;
    var query = dataContext.Persons.Where(p => p.Name == "Alice");
    var persons = query.ToList();

> Written with [StackEdit](https://stackedit.io/).