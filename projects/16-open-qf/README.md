## Basic information

project name: OpenQF

Project establishment date: 11/2023

## Overall introduction to the project

### Problem statement

Under Polkadot OpenGov model, ecosystem builders submit treasury funding proposals, and the community vote with their
balances. There are problems in this model:

- Whales play too important roles.
- Voters who have great contributions to the ecosystem but with less balance will have low or no influence to the vote.
- The vote result is Yes/No which means proposers can only get all the requested fund or 0.
- The cost to a voter is token lock. Relatively speaking, it's too low that voters may not take it very seriously.
- Voters maybe irrational to vote on a treasury proposal, and the community are becoming conservative that we may miss
  some constructive contributions.

### What is OpenQF?

OpenQF is a child project of [OpenSquare](https://github.com/opensquare-network). It aims to introduce a quadratic
funding model to the current polkadot governance mechanism. Generally speaking, more fund from more donators a
project received in a donation round, the more fund will be matched from a public fund pool to this project.

The most important innovation OpenQF will bring is a donation matching augmentation algorithm based on on-chain
activities and off-chain real world information bindings. History on chain activities and information will be indexed
and used to calculated as users' contribution to the polkadot ecosystem. Off-chain information will be used to prove
donators are real world person. The final goal will be a project receive more fund from more real world person who have
more contributions to the polkadot ecosystem will receive more fund from a public fund pool.

### Demo

TBD

### Architecture

- Matching power calculation package.
    - Packages which scan polkadot history blocks and extract address activities and information which are used for
      ecosystem contribution calculation.
    - A package for users to bind real world information like github account.
    - A package to calculate a polkadot address' matching power and serve the final data.
- Quadratic funding workflow server.
    - Funding round management, project info submission and maintenance.
    - Scan and track donations from the community, and do donation statistics.
    - Serve various data including round, project, donations and address matching power information, etc.
- Fronted pages. It interacts with the server and provide whole UIs to facilitate the whole workflow in a quadratic
  funding round.

### Logo

TBD

## Tasks Planned for the Hackathon

- A user can see his/her matching power in a quadratic funding round.
    - Index polkadot history blocks and calculate an address' matching power based on this with predefined rules.
    - Bind real world info to a polkadot address.
- A user can submit his/her project to a round. Currently, projects will only be reviewed by one admin.
- A user can see all the projects in a funding round, and do donations.
- Funding pool matching will be calculated

Fronted pages:

- Quadratic funding round list page.
- A funding round detail page. We can see the round detail, projects and the final matching result on this page.
- A project submission page where we can submit project to one round.
- Project detail page where we can see a project detail and the donations.
- User page on which we can see an address' matching power, donation history.

## Things accomplished during the hackathon (submitted before preliminary review at 11:59 am on December 22, 2023)

TBD

## Team information

- Yongfeng Li, Full Stack Engineer, [Github](https://github.com/wliyongfeng).
- Chaojun Huange, Full Stack Engineer, [Github](https://github.com/hyifeng).
- Jiehao Hu, Fronted Engineer, [Github](https://github.com/2nthony).
- Yihan Fan, Designer, [Github](https://github.com/Popoulosss).
