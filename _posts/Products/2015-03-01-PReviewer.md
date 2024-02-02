---
layout : post
title: "PReviewer"
description: "Detail Page For PReviewer"
tags : [Products, Git, GitHub]
Category : Products
---

{% capture previewer_excerpt %}{% include PReviewer_excerpt.md %}{% endcapture %}
{{ previewer_excerpt | markdownify }}


# Features

In this release **PReviewer** provides the ability  to

 * Display the title and description of the pull request.
 * List changed files in a pull request.
 * open the changed files in external difftool, for example beyond compare.
 * Show the differences inside the application itself.
 * comment on individual files, and submit a general comment. However inline comment on specific commit hasn't been supported yet.
 * Compare commits in the pull request.

<!--more-->
# Install

Navigate to [here](https://raw.github.com/EbenZhang/PReviewer/master/dist/setup.exe) to download the setup.exe and install it following the instructions.

For Windows8 users: if your system complains `Windows protected your PC blahblah...`, then just click the `More info` on the screen, and press the `Run anyway` button.

# License

PReview is a free tool and its [source code](https://github.com/ebenzhang/previewer) is published under [Microsoft Public License (MS-PL)](http://opensource.org/licenses/ms-pl.html)

All rights reserved [Nicologies](http://www.nicologies.net) since 2015

# Donate

{% include donate.md %}

# Feedback

If you have any suggestion, find any bug, or just want to contribute, please submit to the [issues page](https://github.com/EbenZhang/PReviewer/issues/new).

# Coming Features

Here are the features may be added in the future but with no guarantee. I would be appreciated if you can [help](https://github.com/EbenZhang/PReviewer).

 * Inline comment on specific commit
 * Integrated markdown editor, probably a WYSIWYG editor, but this is low priority .
 * Replace the diffviewer With the wpf version of ICsharpcode.editor.
