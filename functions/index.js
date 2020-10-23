const functions = require('firebase-functions');
const generateGithubSVG = require('./github');
const axiosBase = require('axios');

// const env = process.env;
const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_TOKEN = '*************';
const USER_NAME = 'marieooq';

const getStargazersCount = async (username) => {
  const result = await github.get(
    `https://api.github.com/users/${username}/repos?per_page=100`
  );
  const data = result.data;
  const stargazers = data.map((val) => val.stargazers_count);
  const stargazersCount = stargazers.reduce((accum, val) => accum + val, 0);
  return stargazersCount;
};
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
//Prepare axios for GitHub API
const github = axiosBase.create({
  baseURL: GITHUB_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `token ${GITHUB_TOKEN}`,
  },
  responseType: 'json',
});

exports.helloWorld = functions.https.onRequest(async (req, res) => {
  //  response.send("Hello Marie!");
  const stargazersCount = await getStargazersCount(USER_NAME);
  res.send(generateGithubSVG(stargazersCount));
});
