const express = require('express');
const cors = require('cors');
const axiosBase = require('axios');
const githubSVG = require('./github');
require('dotenv').config();

console.log(githubSVG);

const app = express();
app.use(cors());

const env = process.env;

const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_TOKEN = env.GITHUB_TOKEN;

//Prepare axios for GitHub API
const github = axiosBase.create({
    baseURL: GITHUB_API_URL,
    headers: {
        'Content-Type' : 'application/json',
        'Authorization' : `token ${GITHUB_TOKEN}`,
    },
    responseType: 'json',
});

/**
 * Gets a list of repos in GitHub.
 * @param{String} ownerType Resource type of owner (orgs | users)
 * @param{String} owner Owner name
 */

 const getGithubRepos = async(ownerType, owner) => {
     console.log('inside getGithubRepos')
     let url = `${ownerType}/${owner}/repos?sort=full_name`;
     const array = [];
     while(url){
         const {next , data} = await getGithubReposPage(url);
         if(data) array.push(data);
         url = next;
     }
     return array.flat();
 }

 const getGithubReposPage = async(url) => {
    const result = await github.get(url);
    let next = null;
    if (result.headers && result.headers.link) {
      // extract next url from "link" header
      const matches = /\<([^<>]+)\>; rel\="next"/.exec(result.headers.link);
      if (matches) {
        next = matches[1];
      }
    }
    const data = result.data || null;
    return {
      next,
      data,
    };
  }


//demo
// (async () => {
//     const marieooqRepos = await getGithubRepos('users', 'marieooq');
//     console.log(marieooqRepos);
// })();





app.get('/', (req, res) => {
    res.send(githubSVG)
})


app.listen(4000, () => {
    console.log(`Products server listening on port 4000`)
});