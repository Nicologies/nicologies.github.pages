---
layout : post
title : Understanding Git is a Distributed Version Control System
tags : [Git]
category : Git
---
* auto-gen TOC:
{:toc}

In a DVCS (such as Git, Mercurial, Bazaar or Darcs), you don’t just check out the latest snapshot of the files, instead, your local repository has the full mirror of the remote repository. This article helps you better understand how it works.

<!--more-->

Let's say that Alice is the developer, she can pull branches from multiple remotes such as GitHub, GitLab, and even another developer Bob. Our first remote will be, but not necessarily, named as origin by default, in fact, we can name it whatever we like.

![Distributed Git](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LS-Lr-k8ca7XeqESs7Z%2F-LS-N6aBXZ2ixdpWl-kd%2F-LS-NIKYWnigMfpr-28b%2Fimage.png?alt=media&token=1337459a-dc6f-44bb-8533-2c3ad58e4440)

In above image, the green branches in Alice's repository are the local copy of remote branches, they are not necessarily have extactly the same commits as the branch on the remote computer and therefore fetching from remote is needed.

The red ones are Alice's local branches, she very likely has some more commits during development. Once she feels happy with the commits, she can push it to one or more remotes (github, origin, or bob).

For GitExtensions users, the remote branches are often colored green as well as prefixed with the remote name, for example `origin/master` in below image is the snapshot of the master branch we got from the remote origin

![GitExtensionsRemoteBranch](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LS-Lr-k8ca7XeqESs7Z%2F-LS-N6aBXZ2ixdpWl-kd%2F-LS-Nundm7aZ79DIVrmN%2Fimage.png?alt=media&token=cf4a7817-2130-4821-9fd8-d62182edcae5)

## GitHub's Fork Workflow

GitHub has a fork and pull request mode to encourage developers to contribute even when they don't have permission to commit to the original repository. For example Alice forked GitExtensions on GitHub to her own GitHub account as `Alice/GitExtensions`, she may set `Alice/GitExtensions` as the `origin` and the official `GitExtensions/GitExtensions` as `upstream`. Since she doesn't have permission to push to the official repository, she will only push commits to her own `Alice/GitExtensions`, and then create a pull request from `Alice/GitExtensions` to `GitExtensions/GitExtensions` so that the upstream owner can review and merge it.

If Alice wants some changes from Bob who also forked the repository, she can add Bob as another remote and fetch and merge Bob's change.

When we have permission of the original repository
We can push our branch and create pull request to the original repository directly without creating a fork.