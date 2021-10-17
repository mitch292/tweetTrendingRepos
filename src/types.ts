export type Repo = {
  _id?: string; // id in faunadb, make it optional so we can remove and conform to RepoInput on mutations
  author: string | null;
  name: string | null;
  repoUrl: string | null;
  description: string | null;
  programmingLanguage: ProgrammingLanguage;
  spokenLanguage: SpokenLanguage;
  stars: number | null;
  internalId: string;
  twitterHandle: string | null;
  hashtags: string[];
  lastTrendingDate: string; // iso format string
  lastTweetDate?: string; // iso format string
  optedOut?: boolean;
};

export enum ProgrammingLanguage {
  TypeScript = "typescript",
}

// only english is supported to start
export enum SpokenLanguage {
  ENGLISH = "en",
}

export enum HttpStatus {
  OK = 200,
  Unauthorized = 401,
  InternalServerError = 500,
}
