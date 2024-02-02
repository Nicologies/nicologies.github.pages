---
layout: post
title: Principal End of One2One Map in EntityFramework
tags : [Database, EntityFramework]
category : Database
---
* auto-gen TOC:
{:toc}

##What does principal end of an association means?

In one-to-one relation one end must be principal and second end must be dependent. Principal end is the one which will be inserted first and which can exist without the dependent one. Dependent end is the one which must be inserted after the principal because it has foreign key to the principal.

##How to config in FluentAPI?
Say we have one to one User and UserProfile entities, and the User is principal, UserProfile is dependant.

    class User{
       UserProfile Profile { get;set; }
       //...
    }
    
    class UserProfile{
       User User{ get;set; }
       //...
    }

Then the fluentAPI configuration will be:

    modelBuilder.Entity<User>().HasRequired(u => u.Profile).WithRequiredPrincipal(p => p.User);

> Written with [StackEdit](https://stackedit.io/).
