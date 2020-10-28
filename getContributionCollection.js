const {
  ApolloClient,
  ApolloError,
  InMemoryCache,
  gql,
} = require('@apollo/client/core');
require('cross-fetch/polyfill');
require('dotenv').config();

const token = process.env.GITHUB_TOKEN;
console.log(token);
if (typeof token === 'undefined') {
  throw new Error('GITHUB_TOKEN cannot be found');
}

//generate a GraphQL client
const apolloClient = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  headers: { authorization: `Bearer ${token}` },
  cache: new InMemoryCache(),
});

//GraphQL query
// const searchQuery = gql`
//   query {
//     search(query: "repo:apollographql/apollo is:issue", type: ISSUE, first: 5) {
//       issueCount
//       nodes {
//         ... on Issue {
//           number
//           title
//         }
//       }
//     }
//   }
// `;

const searchQuery = gql`
  query {
    user(login: "marieooq") {
      name
      email
      contributionsCollection(
        from: "2020-01-01T00:00:00"
        to: "2020-10-25T00:00:00"
      ) {
        totalRepositoryContributions
        totalCommitContributions
        commitContributionsByRepository {
          repository {
            nameWithOwner
          }
          contributions {
            totalCount
          }
        }
      }
    }
  }
`;

// variables {
//   "name": "marieooq"
//   "from":"2019-08-01T00:00:00",
//   "to":"2019-09-01T00:00:00"
// }

//handle a response of GraphQL
const handleApolloResult = (data) => {
  const { issueCount, nodes } = data.search;
  console.log(`Num of issues: ${issueCount}`);
  for (const issue of nodes) {
    console.log(`${issue.number} : ${issue.title}`);
  }
};

//handle an error of GraphQL
const handleApolloError = (err) => {
  console.log(err.message);
};

//issue the query
// apolloClient
//   .query({ query: searchQuery })
//   .then((result) => handleApolloResult(result.data))
//   .catch(handleApolloError);

apolloClient
  .query({ query: searchQuery })
  .then((result) => {
    console.log(result.data);
  })
  .catch(handleApolloError);
