# url-shortener

[ ![Codeship Status for jyonker/url-shortener](https://codeship.com/projects/9737aed0-478c-0133-a898-6e659308a88a/status?branch=master)](https://codeship.com/projects/105049)

**Work Items:**

* Add more testing to drive better error handling

    * some edge cases produce 500

* Improve Mobile UI

* Return uniform error objects and abstract error creation

* Pull out validation logic as service and use it on front end as well

    * include better messaging to user

* Better 404 and 500 pages

* Bootstrap Theme

* Frontend testing (karma and mocha/chai or jasmine)

* Security

    * user input sanitization

        * trim leading and trailing symbols from all input

        * better handling of reserved short urls (like ‘api’)

* Authentication

    * Probably google oauth to allow viewing, changing, and deleting your created urls.

* Analytics

    * Google Analytics, Mixpanel, …?

**Deploy:** 

Heroku

**Backend:**

Node.js with Express (considered loopback for more opinionated option)

**Storage**:

Store short url/long url as key/value. key/value pairs in redis.

In the future use redis persistence or postgres (with hstore for key/value pairs) for to back redis.

Possibly just cache top hits and recently created URLs (rather than all urls)

**Frontend**:

Simple jquery/bootstrap frontend served by express. Allow users to pick their own short url or generate one for them. In the future, add user authentication and possibly use Angular.

**Automatic short url generation**:  

Ambiguous chars removed from pool: 1, 0, capital or lower I, L, S, and O

**CI/CD:**

Codeship: run backend tests (and eventually frontend tests), then deploy automagically to heroku

**SCM**:

github

**CDN/SSL/DDoS Protection**:

Cloudflare for free SSL, CDN for the frontend (maybe shortened urls too?), and basic DDoS protection

**Monitoring**:

New Relic with Deployment MonitoringPushing

**Caching**:

Using Google PageSpeed approach via grunt-filerev

**User-Facing API:**

	GET / 

        takes you to the webapp

	GET /:shortUrl

		looks up the given short url and sends back the long url as a redirect

**API**: at /api/v1/

    PUT /url/:shortUrl  body: {longUrl: "string", shortUrl: “string”}

        create a new url resource

    returns

        201 with the new key/value resource in json

        400 if the requested url is fails validation

        403 if the key already exists and you don’t have permissions to change it (not   implemented yet)

        500 if we fail to store it

    GET /url/:shortUrl 

        retrieve url resource by shortUrl
    
        returns 
    
            200 if found
    
            404 if not found

    POST /url body: {longUrl: "string"}

	    returns new url resource with generated shortUrl and requested longUrl

Upcoming API:

    DELETE /url/:shortUrl

	    remove url resource by short url

