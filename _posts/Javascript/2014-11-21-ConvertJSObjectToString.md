---
layout: post
title: Convert JavaScript object To String
tags : [JSON, JavaScript]
category : JavaScript
---


    function objToString (obj) {
        var str = '';
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                str += p + '::' + obj[p] + '\n';
            }
        }
        return str;
    }


or

    JSON.stringify(obj);

> Written with [StackEdit](https://stackedit.io/).
