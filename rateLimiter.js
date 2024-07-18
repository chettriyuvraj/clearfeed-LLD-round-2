class RateLimiter {
  constructor(globalLimit, perPathLimit) {
    this.pathToSlidingWindow = {};
    this.globalSlidingWindowMap = {};
    this.globalLimit = globalLimit;
    this.perPathLimit = perPathLimit;
  }

  rateLimit(path, clientId, httpMethod) {
    /* Create global sliding window if it doesn't exist */
    let globalSlidingWindow = this.globalSlidingWindowMap[clientId];
    if (!globalSlidingWindow) {
      this.globalSlidingWindowMap[clientId] = new SlidingWindow(
        60,
        this.globalLimit
      );
      globalSlidingWindow = this.globalSlidingWindowMap[clientId];
    }

    /* Create the path sliding window if it doesn't exist */
    const pathKey = clientId + path + httpMethod;
    let pathSlidingWindow = this.pathToSlidingWindow[pathKey];
    if (!pathSlidingWindow) {
      this.pathToSlidingWindow[pathKey] = new SlidingWindow(
        60,
        this.perPathLimit
      );
      pathSlidingWindow = this.pathToSlidingWindow[pathKey];
    }

    /* Update counts */
    globalSlidingWindow.add(); /* global window updated */
    pathSlidingWindow.add(); /* path window updated */

    /* First check the global limit  */
    const globalRequestCount = globalSlidingWindow.getRequestCountInWindow();

    if (globalRequestCount > this.globalLimit) {
      return {
        allow: false,
        message: "You have exceeded the global request limit",
      };
    }

    /* Then check the per path limit exceeded */
    const pathRequestCount = pathSlidingWindow.getRequestCountInWindow();
    if (pathRequestCount > this.perPathLimit) {
      return {
        allow: false,
        message: `You have exceeded the path request limit for path: ${path}, method: ${httpMethod}`,
      };
    }

    return {
      allow: true,
      message: "",
    };
  }
}

class SlidingWindow {
  constructor(window, limit) {
    this.epochToRequestMap =
      {}; /* epochSecond: number of requests in that second */
    this.window = window;
    this.limit = limit;
  }

  getRequestCountInWindow() {
    let totalRequestsInWindow = 0;

    const curEpoch = this.getEpochInSeconds();
    for (
      let epoch = curEpoch - this.window + 1;
      epoch <= curEpoch;
      epoch += 1
    ) {
      /* Window includes the current epoch */
      const count = this.epochToRequestMap[epoch];
      if (count) {
        totalRequestsInWindow += count;
      }
    }

    return totalRequestsInWindow;
  }

  add() {
    const currentEpochInSeconds = this.getEpochInSeconds();

    const counter = this.epochToRequestMap[currentEpochInSeconds];
    if (!counter) {
      this.epochToRequestMap[currentEpochInSeconds] = 0;
    }
    this.epochToRequestMap[currentEpochInSeconds] += 1;
  }

  getEpochInSeconds() {
    return Math.round(Date.now() / 1000);
  }
}

module.exports = RateLimiter;
