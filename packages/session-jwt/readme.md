# Express-Knex project, Session-jwt

JWT-based tokens as sessions for auth

User modules:

* app.models.User
* app.models.Session
* app.errors
    * app.errors.ServerNotAllowed
    
User env vars:

* env.JWT_SECRET

Mounted methods:

* app.auth.encode (sessionId): encode sessionId into JWT payload and return signed JWT
* app.auth.getTokenFromReq (req): return schema/token from req's header (authorization header, bearer schema expected)
* app.auth.check (req,res,next): middleware to check auth header, decode it from JWT, check session and load req.user with values:
    * req.user will be populated by user profile, 
    * user.session will be current session
    * user.jwt will be JWT payload 





