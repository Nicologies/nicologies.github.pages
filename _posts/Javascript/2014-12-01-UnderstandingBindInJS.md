---
layout: post
title: Understanding Bind in JavaScript
category : JavaScript
tags : [JavaScript, Bind]
---

你（`son`）和你爸（`papa`）在一块的时候，大家都会知道你爸爸的名字（不知道可以直接问啊！），用代码来说就是：

    var papa = {
        name: "li gang",
        son: function() {
            return this.name;
        }
    };
    alert( papa.son() );

但是你不和你爸在一块的时候呢？就成了这样：

    var son = papa.son;
    alert( son() );

你会发现你大家没办法知道你爸的名字了，<del>然后你就不能为非作歹了</del>。好在你还记得你爸的电话号码，打个电话就<del>又可以兴风作浪</del>又知道了：

    alert( son.call(papa) );

然后你想了想，不行啊，不能我每次<del>兴风作浪</del>的时候都得打我爸电话吧，我爸还不得弄死我。诶！这么笨，我随身带着我爸的身份证复印件不就好了嘛，所以你就成了这样：

    son = son.bind( papa );
    alert( son() );

哈哈，爸爸再也不用担心我<del>出门被打</del>叻(๑´ㅂ`๑)！

就这样又过了半年你爸爸大人作死收了一个养子！<del>什么！遗产全部都是我的！</del>养子的中文名叫 二狗子，英文名叫 er~Gou~Zi：

    function erGouZi() {
        return this.name;
    }

这个<del>二狗子</del>养子也想知道你爸的名字好出去<del>泡妞把妹</del>歌功颂德，哀求了半天之后，老爸也给了他一份复印件：

    erGouZi = erGouZi.bind( papa );
    alert( erGouZi() );

二狗子这货啊表示非常高兴，决定每次报出爸爸的大名的时候都要加上`敬爱的`三个字，就像我们经常说`敬爱的 x 总理` 一样，于是他机智的做了一次小手术：

    erGouZi = function() {
        var prefix = arguments[0] || "";
        return prefix + this.name;
    }
    erGouZi = erGouZi.bind( papa, "great " );
    alert( erGouZi() );

又没过多久，这事被老爸知道了。老爸对于二狗子这种舔脚后跟的行为表示非常满意，对他越来越<del>恩爱</del>亲切，对你越来越冷板凳。最后终于老爸把所有的遗产都给了二狗子而你因为平常只会坑蒙拐骗啥技能也不会只能上街乞讨最后被城管暴打而死。

终！

Copied from [here](http://segmentfault.com/q/1010000002508005/a-1020000002508116)
