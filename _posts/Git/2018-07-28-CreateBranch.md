---
layout : post
title : You do not know how to create a git branch
tags : [Git]
category : Git
---
* auto-gen TOC:
{:toc}

You are probably using the "wrong" way to create a git branch in a team using pull request to merge commits, though it can achieve the goal, I'd say you don't know how Git works.

The typical wrong approach is branching out from a local master branch

```
git checkout -b MyBranch master
```

or a better one

```
git pull origin master
git checkout -b MyBranch master
```

<!--more-->

# What is the Problem?

The first command above will very likely create branch based on an out of date master branch.

The second is better as it achieves the goal to create a branch based on the latest commit of a remote branch, but if you understand how Git works, you will know that a local master branch is unnecessary and error-prone as you may push commits to remote master branch inadvertently. It's only need when you want to push something to remote master branch directly.

# The Right Way

Git is a distributed version control system, when you fetch from a remote, you get a copy of the remote branches in your local Git repository. Yes, the remote master branch is on your hard disk already.

The right way includes two parts as well. First, we fetch before creating branch so as to get the latest commit from the remote. Second, we create on top of remote branch instead of a local one. In this way we eliminated the need of the local master branch.

```
git fetch origin master # or git fetch if you want all remote branches
git checkout -b MyBranch origin/master
```

Wait, 2 steps vs 2 steps, seems not much improved. Right, in this case, but imagine that your team have a lot of branches: releases, features, hot fixes. In this way you don't need to create the local branches for any of them. And you can use `git fetch` to fetch all the remote branches, and even having a background task to fetch them automatically.

