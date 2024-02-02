---
layout: post
title: Hide Console Window From Process Start
category : Utils
tags : [UI, Console]
---

Copied from [here](http://stackoverflow.com/questions/5377423/hide-console-window-from-process-start-c-sharp)

I had a similar issue when attempting to start a process without showing the console window.  I tested with several different combinations of property values until I found one that exhibited the behavior I wanted.  

[Here](http://msdn.microsoft.com/en-us/library/system.diagnostics.processstartinfo.createnowindow.aspx) is a page detailing why the `UseShellExecute` property must be set to false.

Under Remarks section on page:

> If the UseShellExecute property is true or the UserName and
> Password properties are not null, the CreateNoWindow property
> value is ignored and a new window is created.

    ProcessStartInfo startInfo = new ProcessStartInfo();
    startInfo.FileName = fullPath;
    startInfo.Arguments = args;
    startInfo.RedirectStandardOutput = true;
    startInfo.RedirectStandardError = true;
    startInfo.UseShellExecute = false;
    startInfo.CreateNoWindow = true;

    Process processTemp = new Process();
    processTemp.StartInfo = startInfo;
    processTemp.EnableRaisingEvents = true;
    try
    {
        processTemp.Start();
    }
    catch (Exception e)
    {
        throw;
    }

> Written with [StackEdit](https://stackedit.io/).
