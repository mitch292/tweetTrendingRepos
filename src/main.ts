import { buildResponse, getRepoToTweet } from "./util.ts";
import { HttpStatus, ProgrammingLanguage } from "./types.ts";
import { tweetRepo } from "./twitter.ts";
import { markRepoAsTweeted } from "./fauna.ts";
import { API_TOKEN } from "./config.ts";

export const main = async () => {
  const repo = await getRepoToTweet(ProgrammingLanguage.TypeScript);
  if (repo) {
    try {
      await tweetRepo(repo);
    } catch (error) {
      console.error("Something went wrong tweeting the repo:", error);
      throw error;
    }

    try {
      await markRepoAsTweeted(repo);
    } catch (error) {
      console.error("Something went wrong marking the repo as tweeted:", error);
      throw error;
    }
  }
};

export const handleRequest = async (request: Request) => {
  const bearerToken = request.headers.get("authorization");
  if (
    !bearerToken ||
    bearerToken.split("Bearer ").length < 2 ||
    bearerToken.split("Bearer ")[1] !== API_TOKEN
  ) {
    return buildResponse("Not Authorized!", HttpStatus.Unauthorized);
  }

  try {
    await main();
  } catch (error) {
    return buildResponse(
      "Something went wrong with the request",
      HttpStatus.InternalServerError,
      error,
    );
  }

  return buildResponse("ok");
};

addEventListener("fetch", (event) => {
  // @ts-ignore Deno deploy functionality
  event.respondWith(handleRequest(event.request));
});
