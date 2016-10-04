Cache-based chromium information leak
=====================================

Quick and dirty PoC of a potential information leak I discovered in Chromium.

How it works:

- Start the node server (node index.js)
- Navigate to http://localhost:8888/ (victim site) and perform AJAX requests by
  clicking the "request" button.
- Navigate to http://localhost:8877/ (attacker site) and perform unauthenticated
  ajax requests against victim site using the "attack" button.
  Victim's data appears in the attacker window.

What goes wrong:
When the victim requests the resource, she uses the actual basic auth
credentials and the response is cached.
When the attacker performs the request, chrome serves the response from cache
even though the basic auth credentials are different and the origin is different.

Additional info:
- It seems that the victim needs to perform a HEAD request which returns 204 on
  the target endpoint.
- Access-Control headers returned by the server must allow cross site requests
  and allow the Authorization header.
