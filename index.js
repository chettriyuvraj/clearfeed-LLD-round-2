const express = require("express");
const RateLimiter = require("./rateLimiter.js");
const { rateLimiterMiddlewareWrapper } = require("./middleware.js");

const PORT = 6000;
const app = express();

const rateLimiter = new RateLimiter(15, 5);
const rateLimiterMiddleware = rateLimiterMiddlewareWrapper(rateLimiter);

app.use(rateLimiterMiddleware);

app.get("/route1", (req, res) => {
  res.status(200).send("This is route 1: GET!");
});

app.post("/route1", (req, res) => {
  res.status(200).send("This is route 1: POST!");
});

app.get("/route2", (req, res) => {
  res.status(200).send("This is route 2: GET!");
});

app.post("/route2", (req, res) => {
  res.status(200).send("This is route 2: POST!");
});

app.listen(PORT, () => {
  console.log("The server is listening...");
});
