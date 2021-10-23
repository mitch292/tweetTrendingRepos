import { difference } from "../deps.ts";
import { HttpStatus, ProgrammingLanguage, Repo } from "./types.ts";
import { getAllReposForLanguange } from "./fauna.ts";
import { RECENT_REPO_THRESHOLD } from "./config.ts";

export const filterForRecentRepos = (repos: Repo[]): Repo[] => {
  return repos.filter((repo) => {
    if (!repo.lastTrendingDate) {
      return false;
    }
    const repoTrendingDate = new Date(repo.lastTrendingDate);
    const today = new Date();
    const diff = difference(repoTrendingDate, today, { units: ["days"] });

    return diff.days || 0 < RECENT_REPO_THRESHOLD;
  });
};

export const filterForReposNotRecentlyPosted = (repos: Repo[]): Repo[] => {
  return repos.filter((repo) => {
    if (!repo.lastTweetDate) {
      return true;
    }
    const lastTweetDate = new Date(repo.lastTrendingDate);
    const today = new Date();
    const diff = difference(lastTweetDate, today, { units: ["weeks"] });

    return (diff.weeks || 0) > 3;
  });
};

export const getRepoToTweet = async (
  language: ProgrammingLanguage,
): Promise<Repo | null> => {
  const repos = await getAllReposForLanguange(language);

  const validRepos = filterForReposNotRecentlyPosted(
    filterForRecentRepos(repos),
  );

  if (validRepos.length) {
    return validRepos[0];
  }

  return null;
};

export const buildResponse = (
  message: string,
  code: HttpStatus = HttpStatus.OK,
  data: Record<string, unknown> = {},
): Response => {
  return new Response(
    JSON.stringify({ message, ...data }),
    {
      status: code,
      headers: {
        "content-type": "application/json; charset=UTF-8",
      },
    },
  );
};
