# README

## Requirements

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

## Endpoints

- PORT: 6000

- /route1
    - POST and GET

- /route2
    - POST and GET

## Setup

Assumption: node.js is installed in your machine.


- Install modules

```
npm i
```

- Run server

```
node index.js
```

- Hit the API with requests - you will eceive a _200 success_ or a _429 error_

```
curl -i -X GET -H "Client-ID: 123" localhost:6000/route1
```

## Approach

- The sliding window class maintains a count for the number of requests received per second. It decides allow/disallow based on the totalCount of requests received in the last 60 seconds (the window).

- Each client has a global sliding window of their own (using clientId) for global limit.

- Each client has (path+clientId+method) sliding windows each.

- Query the appropriate sliding window to find out if the limit has been exceeded.



