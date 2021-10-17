import { buildResponse, getRepoToTweet } from "./util.ts";
import { HttpStatus, ProgrammingLanguage } from "./types.ts";
import { tweetRepo } from "./twitter.ts";
import { markRepoAsTweeted } from "./fauna.ts";

export const main = async () => {
  const repo = await getRepoToTweet(ProgrammingLanguage.TypeScript);
  if (repo) {
    await tweetRepo(repo);
    await markRepoAsTweeted(repo);
  }
};

if (import.meta.main) {
  await main();
}

export const handleRequest = async (request: Request) => {
  const bearerToken = request.headers.get("authorization");
  if (
    !bearerToken ||
    bearerToken.split("Bearer ").length < 2 ||
    bearerToken.split("Bearer ")[1] !== Deno.env.get("API_TOKEN")
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
