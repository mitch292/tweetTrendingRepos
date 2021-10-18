import { Repo } from "./types.ts";
import {
  API_TOKEN,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET,
  TWITTER_CONSUMER_API_KEY,
  TWITTER_CONSUMER_API_SECRET,
  TWITTER_PROXY_URL,
} from "./config.ts";
export const tweetRepo = async (repo: Repo): Promise<void> => {
  if (
    !TWITTER_CONSUMER_API_KEY || !TWITTER_CONSUMER_API_SECRET ||
    !TWITTER_ACCESS_TOKEN || !TWITTER_ACCESS_TOKEN_SECRET
  ) {
    throw new Error(
      "environment variable TWITTER_API_KEY or TWITTER_API_KEY not set",
    );
  }

  let description = repo.description;
  if (description && description.length > 100) {
    description = `${description.slice(0, 97)}...`;
  }

  const hashTags = repo.hashtags.length ? `${repo.hashtags.join(" ")}\n\n` : "";
  const twitterHandle = repo.twitterHandle ? `${repo.twitterHandle}\n\n` : "";

  const res = await fetch(TWITTER_PROXY_URL, {
    method: "POST",
    headers: {
      authorization: API_TOKEN as string,
      accept: "application/json",
      contentType: "application/json",
    },
    body: JSON.stringify({
      status:
        `🚀 ${repo.author} / ${repo.name} \n\n⭐ ${repo.stars}\n\n🔎 ${description}\n\n${hashTags}${twitterHandle}${repo.repoUrl}`,
    }),
  });

  if (res.status !== 200) {
    throw Error(res.statusText);
  }
};
