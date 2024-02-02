---
layout: post
title: Events in the ASP.NET Request Life Cycle
tags : [Web, ASP.NET]
category : Web
---
copied from the [Programming Microsoft ASP.NET 4 book](http://blogs.msdn.com/b/microsoft_press/archive/2011/03/07/new-book-programming-microsoft-asp-net-4.aspx), Page 32, Charpter 2, Part 1.

Events are fired in the following sequence:

* auto-gen TOC:
{:toc}

## BeginRequest

The ASP.NET HTTP pipeline begins to work on the request. For the first request ever in the lifetime of the application instance, this event reaches the application after Application_Start.

## AuthenticateRequest

The request is being authenticated. ASP.NET and IIS integrated authentication modules subscribe to this event and attempt to produce an identity.

If no authentication module produced an authenticated user, an internal default authentication module is invoked to produce an identity for the unauthenticated user. This is done for the sake of consistency so that code doesn’t need to worry about null
identities.

<!--more-->

## PostAuthenticateRequest

The request has been authenticated. All the information available is stored in the HttpContext’s User property at this time.

## AuthorizeRequest

The request authorization is about to occur. This event is commonly handled by application code to perform custom authorization based on business logic or other application requirements.

## PostAuthorizeRequest

The request has been authorized.

## ResolveRequestCache

The runtime environment verifies whether returning a
previously cached page can resolve the request. If a valid cached representation is
found, the request is served from the cache and the request is short-circuited, calling
only any registered EndRequest handlers. ASP.NET Output Cache and the new IIS 7.0
Output Cache both feature “execute now” capabilities.

## PostResolveRequestCache

The request can’t be served from the cache, and the procedure continues. An HTTP handler corresponding to the requested URL is created at this point. If the requested resource is an .aspx page, an instance of a page class is created.

## MapRequestHandler

The event is fired to determine the request handler.

## PostMapRequestHandler

The event fires when the HTTP handler corresponding to the requested URL has been successfully created.

## AcquireRequestState

The module that hooks up this event is willing to retrieve any state information for the request. A number of factors are relevant here: the handler must support session state in some form, and there must be a valid session ID.

## PostAcquireRequestState

The state information (such as Application or Session) has
been acquired. The state information is stored in the HttpContext’s related properties
at this time.

## PreRequestHandlerExecute

This event is fired immediately prior to executing the handler for a given request.

## ExecuteRequestHandler

At this point, the handler does its job and generates the output for the client.

## PostRequestHandlerExecute
When this event fires, the selected HTTP handler has completed and generated the response text.

## ReleaseRequestState

This event is raised when the handler releases its state information and prepares to shut down. This event is used by the session state module to update the dirty session state if necessary.

## PostReleaseRequestState

 The state, as modified by the page execution, has been persisted.

## UpdateRequestCache

 The runtime environment determines whether the generated output, now also properly filtered by registered modules, should be cached to be reused with upcoming identical requests.

## PostUpdateRequestCache

 The page has been saved to the output cache if it was configured
to do so.

## LogRequest

 The event indicates that the runtime is ready to log the results of the request. Logging is guaranteed to execute even if errors occur.

## PostLogRequest

The request has been logged.

## EndRequest

 This event fires as the final step of the pipeline. At this point, the
response is known and made available to other modules that might add compression
or encryption, or perform any other manipulation.


Another pair of events can occur during the request, but in a nondeterministic order. They
are PreSendRequestHeaders and PreSendRequestContent. The PreSendRequestHeaders event informs the HttpApplication object in charge of the request that HTTP headers are about to be sent. The PreSendRequestContent event tells the HttpApplication object in charge of the request that the response body is about to be sent. Both these events normally fire after EndRequest, but not always. For example, if buffering is turned off, the event gets fired as soon as some content is going to be sent to the client.

Speaking of nondeterministic application events, it must be said that a third nondeterministic
event is, of course, Error.
