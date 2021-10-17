import { FAUNA_GRAPHQL_API, FAUNA_SECRET } from "./config.ts";
import { ProgrammingLanguage, Repo } from "./types.ts";

export const markRepoAsTweeted = async (repo: Repo): Promise<void> => {
  const query = `
    mutation updateRepo($id: ID!, $data: RepoInput!) {
      updateRepo(id: $id, data: $data) {
        _id
      }
    }
  `;
  // remove the fauna _id to conform to RepoInput gql type.
  const faunaId = repo._id;
  delete repo._id;

  const res = await makeFaunaRequest(query, {
    id: faunaId,
    data: { ...repo, lastTweetDate: new Date().toISOString() },
  });
};

export const getAllReposForLanguange = async (
  language: ProgrammingLanguage,
): Promise<Repo[]> => {
  const query = `
		query fetchAllReposForLanguage($programmingLanguage: String!) {
			reposByLanguage(programmingLanguage: $programmingLanguage) {
				data {
					_id
					internalId
					author
					name
					repoUrl
					stars
					spokenLanguage
					description
					twitterHandle
					programmingLanguage
					hashtags
					lastTrendingDate
					lastTweetDate
					optedOut
				}
			}
		}
  `;

  try {
    const { data, error } = await makeFaunaRequest(query, {
      programmingLanguage: language,
    });
    if (error) {
      throw error;
    }

    return data.reposByLanguage.data;
  } catch (error) {
    throw error;
  }
};

const makeFaunaRequest = async (
  query: string,
  variables: { [key: string]: unknown },
  // @ts-ignore dont know the types that will be returned by fauna
  // deno-lint-ignore no-explicit-any
): Promise<{ data?: any; error?: any }> => {
  if (!FAUNA_SECRET) {
    throw new Error("environment variable FAUNA_SECRET not set");
  }

  try {
    // Make a POST request to fauna's graphql endpoint
    const res = await fetch(FAUNA_GRAPHQL_API, {
      method: "POST",
      headers: {
        authorization: `Bearer ${FAUNA_SECRET}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const { data, errors } = await res.json();

    if (errors) {
      // Return the first error if there are any.
      return { data, error: errors[0] };
    }

    return { data };
  } catch (error) {
    return { error };
  }
};
