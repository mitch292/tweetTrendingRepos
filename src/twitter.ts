import { Repo } from "./types.ts";
import { TwitterApi } from "../deps.ts";
import {
  GITHUB_BASE_URL,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET,
  TWITTER_CONSUMER_API_KEY,
  TWITTER_CONSUMER_API_SECRET,
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

  const twitter = new TwitterApi({
    consumerApiKey: TWITTER_CONSUMER_API_KEY,
    consumerApiSecret: TWITTER_CONSUMER_API_SECRET,
    accessToken: TWITTER_ACCESS_TOKEN,
    accessTokenSecret: TWITTER_ACCESS_TOKEN_SECRET,
  });

  const repoUrl = `${GITHUB_BASE_URL}/${repo.author}/${repo.name}`;

  let description = repo.description;
  if (description && description.length > 100) {
    description = `${description.slice(0, 97)}...`;
  }

  const res = await twitter.post("statuses/update.json", {
    status:
      `🚀 ${repo.author} /  ${repo.name} \n\n⭐ ${repo.stars}\n\n🔎 ${description}\n\n#typescript\n\n${repoUrl}`,
  });
};
