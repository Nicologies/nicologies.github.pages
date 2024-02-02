---
layout: post
title: Get Website URLs via JavaScript
tag : [JavaScript, URL]
category : JavaScript
---
* auto-gen TOC:
{:toc}

Copied from [here](http://stackoverflow.com/questions/19550136/javascript-get-website-url)

> **There are several ways you can do this, but one way might be best for certain situations (e.g. within an iFrame).**

**Protocol + Domain + Page**

    document.URL
    > "http://example.com/page1.html"

    document.location.href
    > "http://example.com/page1.html"

----------

**Protocol + Domain**

    document.location.origin
    > "http://example.com"

----------

**Domain**

    document.location.host
    > "example.com"

----------
**Page**

    document.location.pathname
    > "/page1.html"


> Written with [StackEdit](https://stackedit.io/).
