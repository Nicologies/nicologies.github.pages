---
layout : post
title : Implement JavaScript Curry Function and Invoke it
tags : [Curry, JavaScript, Functional]
category : JavaScript
---
* auto-gen TOC:
{:toc}

copied from [here](http://alichchiu.blogspot.com.au/2014/03/javascript-currying.html)

**JavaScript : 實作柯里化(Currying)與部份調用**
----------

如果稍微有接觸functional programming的經驗的話，應該對柯里化與部份調用這兩個名詞不會太陌生。

所為柯里化是指：

    將多參數函數轉換為一系列單參數函數。它描述了轉換過程，而不是轉換函數的調用。
    調用方可以確定應用了多少參數，從而創建一個參數更少的導出函數。

而部份調用是指：

    將多參數函數轉換為一個參數更少的多參數函數，其值為提前提供的省略參數的值。
    本技術的名稱非常恰當：它將一些參數部分應用到函數，並返回一個具有簽名（由剩餘參數組成）的函數

這樣的解釋可能還是太過抽象了，舉例來說的話，就是例如我有一個一般化的線性方程式：

    var linearFunction = function(a, b, x) {
        return a * x + b;
    }

這個方程式現在需要3個參數`(a、b、x)`來決定一個輸出值，每次調用它都需要3個參數，若是在某段程式中不斷調用這個方程式，且`a、b`的值都是一樣的，我們還是必須一再的把`a、b`的值代入方程式。但若我們的語言有柯里化的能力，就可以先把`a、b`值代入方程式，生成一個新的方程式，這個新方程式的`a、b`值變成固定的，調用這個新方程式時只需傳入`x`值：

值得注意的是，我們要"生成一個新的方程式"，也就是某個函數會"回傳一個新的函數"，如果我們使用的語言中函數不是一級物件(first-class)，就無法把函數當做物件來傳遞，實作柯里化的過程就會稍嫌複雜了(但不是說無法辦到，我們在 之後的文章會用Java的匿名類別來達成這件事)。

<!--more-->

在支持functional programming的語言中實作柯里化倒是易如反掌，以下這段JavaScript程式碼只使用了不到10行就達成了這個功能：


    var curry = function() {
      /*
       * curry這個function沒有signature，表示它是接受任意數量的參數
       * arguments是JavaScript的function特殊內定物件，
       * 可以用來取得實際傳入的變數，但詭譎的是arguments取得的東西不是"陣列"，
       * 需要使用Array.prototype.slice.call(arguments)來取得實際傳入的變數"陣列"，
       * 以利後續使用這些傳入的變數。
       */
      var args = Array.prototype.slice.call(arguments);
      /*
       * curry這個function回傳一個匿名function
       */
      return function() {
        /*
         * 這個匿名function也是用Array.prototype.slice.call(arguments)
         * 來取得實際傳入的變數陣列。
         */
        var args2 = Array.prototype.slice.call(arguments);
        /*
         * 我們自己定義了curry這個function傳入的第一個變數是"要被柯里化的function"，
         * 接在第一個變數之後的所有變數是"要被預先傳入的變數們"。
         * 以上面的linearFunction為例，使用上可能會長這樣：
         * curry(linearFunction, 1, 2);
         * 這樣會回傳一個新的function，它的長相類似：
         * function(x) {
         *   return 1 * x + 2;
         * }
         *
         * 我們再回到程式碼的部分，
         * args[0]是指curry這個function傳入的第一個變數，
         * (記得，第一個變數是要被柯里化的function)
         * 用apply來呼叫這個function，apply必須用array來表達它的傳入參數列表，
         * args.slice(1)是curry這個function傳入的變數陣列剔除第一個元素，
         * 所以它代表的是"要被預先傳入的變數們"，
         * 接下來，使用concat在這個陣列尾端接上args2，
         * args2是回傳的匿名function的變數陣列，
         * args.slice(1)與args2接在一起，就表達了(未被柯里化)的原function所需的所有參數了。
         */
        return args[0].apply(this, args.slice(1).concat(args2));
      };
    };


現在我們來實際把之前定義的linearFunction柯里化試試看：

    var f1 = curry(linearFunction, 1, 2);  // 預先指定a = 1、b = 2

    f1(0);  // 印出 2  ( 1 * 0 + 2 )
    f1(40); // 印出 42 ( 1 * 40 + 2 )

    var f2 = curry(linearFunction, 100);   // 預先指定a = 100

    f2(-1,1);  // 印出 99  ( 100 * 1 - 1 )
    f2(44, 0); // 印出 44  ( 100 * 0 + 44 )

    var f3 = curry(f2, 3);  // 使用function f2再一次柯里化，指定b = 3

    f3(5);  // 印出 503  ( 100 * 5 + 3 )

    var f4 = curry(f3, 5);  // 使用function f3再一次柯里化，指定x = 5

    f4();  // 印出 503  ( 100 * 5 + 3 )


> Written with [StackEdit](https://stackedit.io/).
