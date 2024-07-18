const express = require("express");
const RateLimiter = require("./rateLimiter");

const rateLimiterMiddlewareWrapper = (limiter) => {
  return (req, res, next) => {
    const { path, method } = req;
    const clientId = req.get("Client-ID");

    const { allow, message } = limiter.rateLimit(path, clientId, method);
    if (allow) {
      next();
    } else {
      res.status(429).send(JSON.stringify({ message }));
    }
  };
};

module.exports = { rateLimiterMiddlewareWrapper };
