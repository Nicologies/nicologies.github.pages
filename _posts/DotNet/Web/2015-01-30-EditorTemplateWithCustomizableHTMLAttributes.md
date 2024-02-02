---
layout: post
title: EditorTemplate with Customizable HTML Attributes
original : true
category : Web
tag : [ASP.NETMVC, Web]
---

When using EditorTemplate, we wouldn't set some attributes (e.g. the Bootstrap grid width col-md-\* ) of the widget in the template, so they can be customized via the second parameter of HtmlHelper.EditorFor for different contexts/pages. On the other hand, to avoid duplication, it's the widget's responsibility to set the attributes that the widget always has or belong to the widget rather than its container.

This article illustrates how to pass the HTML attributes to the EditorTemplate and merge with the attributes reside in the EditorTemplate itself.

<!--more-->

Let's say we want to display a Markdown editor for the content of a blog post.

## The model

The model of the blog post has a `Content` property and the `UIHint` instructs the framework to use the `Markdown` EditorTemplate defined in Views/Shared/EditorTemplates/Markdown.cshtml as the editor for `Content`.

    public class BlogPost{
        public int PostId {get;set;}

        [AllowHtml]
        [UIHint("Markdown")]
        public string Content{get;set;}

        public string Title {get;set;}
    }


## The EditBlogPost.cshtml

In the EditBlogPost.cshtml, we call the `@Html.EditorFor` against the `Content` to render the Markdown editor. Here we set the `rows` to 10, assuming that the `rows` might be 15 in another page, which means we cannot always set it to 10 in the EditorTemplate.

    @model BlogPost

    @using(Html.BeginForm(...))
    {
        ...
        @Html.EditorFor(m => m.Content, new { htmlAttributes = new { @class = "form-control", rows = "10" } })
    }

Note: don't worry about the `@class = "form-control"` attribute, it is for Bootstrap to display the editor as a form control.

## Implement the EditorTemplate

Now, we create the Markdown.cshtml in the Views/Shared/EditorTemplates/ folder to display the editor. Let's say we have a JavaScript to convert all `TextArea`s that have the `js-markdown-area` `class` into real markdown editors(How to integrate a markdown editor is out of the scope of this article), the best place to put the `class` is the template. So we want to write the Markdown.cshtml like this:

    @model String
    @{
        RouteValueDictionary attributes = Html.MergeHtmlAttributes(ViewData["htmlAttributes"]
            , new { @class = "js-markdown-area" });
    }
    @Html.TextAreaFor(m => m, htmlAttributes: attributes)

The MergeHtmlAttributes (will be described later) will merge the `rows=10` and `@class='form-control'` attributes from EditBlogPost.cshtml with the local `@class='js-markdown-area'`.


## Implment the MergeHtmlAttributes Extension Method

The implementation is straightforward, it just enumerates and merges all the parameters.

    public static class HtmlHelperExtension{
        public static RouteValueDictionary MergeHtmlAttributes(
            this HtmlHelper helper,
            params object[] htmlAttributes){
            var mergedRouteValue = new RouteValueDictionary();
            foreach (var htmlAttribute in htmlAttributes)
            {
                if (htmlAttribute != null)
                {
                    var routeValue = new RouteValueDictionary(htmlAttribute);
                    mergedRouteValue = mergedRouteValue.Extend(routeValue);
                }
            }
            return mergedRouteValue;
        }
    }

Note: the `if (htmlAttribute != null)` statement is for the case that the htmlAttributes is not in the ViewData.

### The Extend Extension Method to Merge RouteValueDictionary

    public static class RouteValueDictionaryExtension{
        /// <summary>
        /// The extend method takes values from the source and add them into the destination.
        /// You do not need to use the return value because the destination object 
        /// will already have the element of the source.
        /// </summary>
        /// <param name="destination"></param>
        /// <param name="source"></param>
        /// <returns></returns>
        public static RouteValueDictionary Extend(this RouteValueDictionary destination,
            IEnumerable<KeyValuePair<string, object>> source){

            foreach (var srcElement in source.ToList()){
                if (destination.ContainsKey(srcElement.Key)){
                    destination[srcElement.Key] += " " + srcElement.Value;
                }
                else{
                    destination[srcElement.Key] = srcElement.Value;
                }
            }
            return destination;
        }
    }
