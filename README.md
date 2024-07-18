# README

- n number of clients
- 1 server
- n number of APIs
- client - associated with a client id - unique
- client id - in headers
- 2 kinds of Limit
    - Global limit: 15/min for a particular client
    - Path limit: 5/min for a given path


- Approach:
    - Func (path, clientId, http method)
    - Path limit:
        - method + path
        - GET separate, post sep
        