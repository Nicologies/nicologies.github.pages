---
layout : post
title : Using CSS Properties to Create a Cool Button
tags : [CSS,Web]
category : CSS
original: true
---

Using CSS properties alone, recreate this button:

![enter image description here](http://cdn.css-tricks.com/wp-content/uploads/2013/10/css-button.png)

This would be a great test of the candidate's CSS3 skills. This button is loaded with that kind of stuff. Things I would look for:

 - How did they handle [multiple borders](http://css-tricks.com/snippets/css/multiple-borders/)? `box-shadow` is probably the best way here.
 - Did they use `text-transform`: uppercase; for the text? That would be best.
 - How did they handle the stars? Pseudo elements would be a good candidate there. Did they use `unicode`? Icon font?
 - Did they catch the subtle `text-shadow`?
 - How did they split the background in the main part of the button? a `linear-gradient` with no fade would be a good technique there. Or `box-shadow`.
 - Were they [careful](http://css-tricks.com/public-service-announcement-careful-with-your-nested-border-radii/) with the nested `border-radius`?


----------


My solution

    a {
      border-radius: 4px;
      border-color : aliceblue;
      background-color: gray;
      padding: 5px;  
      display:inline;
      text-decoration: none;
      text-transform:uppercase;
      box-shadow:0px 0px 1px 4px red,
        0px 0px 1px 8px #000000;
      text-shadow:1px 1px #00ffff;
      font-weight: bold;
      background: linear-gradient(180deg, lightgray, gray);
    }

    a:before, a:after{
      content:'\2605';
    }


The challenge/question was from [here](http://css-tricks.com/interview-questions-css/)
> Written with [StackEdit](https://stackedit.io/).
