---
layout : post
title : ElementName As Source Of Content Menu Command Binding
category : WPF
tags : [WPF]
---
ElementName As Source Of Content Menu Command Binding

We can't bind using `ElementName` for a context menu command binding as `popups` are not on the visual tree, thus not able to find the element by its name. But we can workaround it using a couple of tricks though...

1. Use RoutedUICommands with a command binding on the UserControl, then no binding is needed.
2. Use the placement target binding on the context menu's DataContext. This allows you to at least get the data context of the element the context menu appears on to the context menu.

    DataContext="{Binding RelativeSource={RelativeSource Mode=Self}, Path=PlacementTarget.DataContext}".

3. Use [ElementSpy][1] to link to the window using a static resource so we can then use a defacto ElementName bindings.

Copied and modified from [here](http://stackoverflow.com/questions/2617122/wpf-menuitem-command-binding-to-elementname-results-to-system-windows-data-error)
> Written with [StackEdit](https://stackedit.io/).
