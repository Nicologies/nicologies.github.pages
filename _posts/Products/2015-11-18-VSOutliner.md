---
layout: post
title: "Visual Basic .NET and C# Outlining Extension"
description: "An extension to add additional outlining to Visual Basic .NET and C#"
category : Products 
tags : [Outlining, Utility, Products, Outliner, Extension, VSIX]
---

{% capture vsoutliner %}{% include vsoutliner_excerpt.md %}{% endcapture %}
{{ vsoutliner | markdownify }}


<!--more-->

# Installing

You can either search `Visual Basic and C# Outliner` and install it via the Visual Studio Extension Manager or download it manually from [here](https://visualstudiogallery.msdn.microsoft.com/699ecb9d-bd8f-4f6b-b290-05c42407b43e)

Due to the dependencies of the Roslyn dlls, it only supports Visual Studio 2015, and there is no plan to port it back to ealier version of Visual Studio.

# Features

## CSharp

As you can see from the below image, there are couple of additional outliners added to the editor, so we can collapse them.

![C# collapsible scopes](/images/VSOutliner/CSharpCollapsibleScopes.png)

Below is how it looks after collapsed

![C# Collapsed](/images/VSOutliner/CSharpCollapsed.png)

Additionally, it will show the collapsed content with syntax highlighted when mouse is hovering on:

![C# Outlining Hint](/images/VSOutliner/CSharpOutliningHint.png)

## Visual Basic .NET

In addition to C#, this extension also supports Visual Basic .NET:

![Visual Basic collapsible scopes](/images/VSOutliner/VBCollapsibleScopes.png)

# Donate

{% include donate.md %}

