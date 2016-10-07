Cache-based chromium information leak
=====================================

**update:** It turns out this is part of the HTTP spec.  
If a response is meant to be cached, one must use the `Vary` header to tell 
which request headers may affect the content returned by the server.  
**A misconfigured app server** may send out a response with `Cache-Control: 
max-age=123` and no `Vary` header which will cause the browser to cache the
response and serve it to back later without checking headers such as
`Authorization` or `Cookie`.

Although this vulnerability is by far less known than the old classics like 
**XSS** or **SQL injections**, it can have dramatic consequences.

**tl;dr:** Beware of the cache! Use [`Vary`](https://gerrit.corp.appdynamics.com/#/c/84953/).

---

How it works:

- Start the node server (node index.js)
- Navigate to http://localhost:8877/ (attacker site) and perform unauthenticated
  ajax requests against victim site using the "attack" button.
  => The request fails as expected.
- Navigate to http://localhost:8888/ (victim site) and perform AJAX requests by
  clicking the "request" button.
  The request succeeds as expected.
- Go back to the attacker site and click the "attack" button again.
  The victim's data appears.

What goes wrong:
When the victim requests the resource, she uses the actual basic auth
credentials and the response is cached.
When the attacker performs the request, chrome serves the response from cache
even though the basic auth credentials are different and the origin is different.

Additional info:
- Access-Control headers returned by the server must allow cross site requests
  and allow the Authorization header.
- This bug allows to bypass 'cookie' authorization and 'basic auth' authorization and
possibly any other HTTP-header based authorization.
