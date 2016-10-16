*Invariable* information leak PoC
===============================

This proof of concept demonstrates how an attacker can take advantage of a missing `Vary` header to leak information protected by `Auth basic`, `Cookie` or any other header actually.  
For instance, **a misconfigured app server** may send out a response with `Cache-Control: 
max-age=123` and no `Vary` header which will cause the browser to cache the
response. Later, a malicious web page can perform an XHR request to that same resource and the browser will return the cached response regardless of authentication headers.

Although this vulnerability is by far less known than the old classics like 
**XSS** or **SQL injections**, it can have dramatic consequences.

**tl;dr:** Beware of the cache! Use [`Vary`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary).

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
When the attacker performs the request, the browser serves the response from cache
even though the basic auth credentials are different and the origin is different.

Additional info:  
- Access-Control headers returned by the server must allow cross site requests
  and allow the Authorization header. Otherwise the attack cannot be performed cross-domain.
