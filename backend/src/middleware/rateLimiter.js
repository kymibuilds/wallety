import { ratelimit } from "../config/upstash.js";

const ratelimiter = async (req, res, next) => {
  try {
    //identifier, user id or ip address for production ready apps, this is just for the hardcoded identifier
    const { success } = await ratelimit.limit("my-rate-limit");
    if (!success) {
      return res.status(429).json({
        message: "too many requests please try again later",
      });
    }
    next();
  } catch (error) {
    console.log("rate limit error", error);
  }
};

export default ratelimiter;
