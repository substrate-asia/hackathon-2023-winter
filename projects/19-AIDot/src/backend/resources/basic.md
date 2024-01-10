# Core time

Below is information about core time in Polkadot.

## Summary

If we see Polkadot as a service provider of trustless and resilient computation through cores as
well as secure interoperability between core-powered applications, the future development of
Polkadot can be directed towards the following main changes.

A paradigm shift from:

- being a chain-focused ecosystem where each parachain owned an execution core at all times
  (acquired through fixed parachain slots), which allowed a simple and secure, sharded execution
  environment
- to being an application-focused ecosystem where we remove the assumption that each application
  owns a core, and instead that all cores are a resource to be consumed and used as needed by all
  applications.

Previously, securing a parachain slot was a competitive process through an auction mechanism. With coretime rental, there is no need for slot auctions anymore. Teams can purchase instantaneous coretime or reserve bulk coretime as required. This greatly decreases the barrier-to-entry for software tinkerers and parachain teams.

On top of those main changes, agile core usage and coretime allocation will allow any application to access Polkadot's computation based on their needs without wasting valuable blockspace. Accords will improve cross-chain communication and the security guarantees of XCM messages. Finally, Polkadot will scale by moving on-chain logic into its system parachains, allowing it to have more bandwidth for the parachains protocol and accords.

## From Slot Auctions to Coretime Marketplace

The end product of blockchains is Blockspace. Applications need to access Polkadot's blockspace, and the entry points to blockspace are the cores. Thus, applications will need to reserve some time on cores or Coretime to gain the right to access Polkadot's secure blockspace and interoperability for a finite period.

Cores must be agile and general: they can change what job they run as easily as a modern CPU. It
follows that the procurement of those cores must be agile as well.

The slot auction mechanism is not agile, creates high entry barriers, and is designed for
long-running single applications (i.e., the original Polkadot vision proposed in the whitepaper).

We depart from the classic lease auctions and propose an agile marketplace for coretime, where
essentially **coretime becomes a commodity that can be tokenized, sold, and traded**. This setup
maximizes the agility of Polkadot and lets the market figure out the best solution needed for
applications to be successful.

Applications can reserve **bulk coretime** and **instantaneous coretime** depending on their needs.
Bulk coretime rental will be a standard rental of coretime through a broker system parachain at a
fixed price for a fixed period of time. Instantaneous coretime rental will be available through
ongoing sale of coretime for immediate use at a spot price. This system lowers the barrier to entry
for prospective builders.

For example, revenues from coretime sales can be burnt, used to fund the Treasury, or used for a mix of those options. The topic is currently under discussion. For more information, see RFC-0010 and RFC-0015.

## Agile Coretime Allocation

In Polkadot 1.0, coretime is a fixed two-year period on one specific core. Here, we remove this
limitation and generalize coretime usage to meet different application needs.

### Split Coretime

Owners of coretime can split or trade it. An application A1 can run on core C1 for a finite period
and then another application A2 can run on that core, or application A1 can continue running on
another core C2. Some applications might stop running for some time and resume later on.

### Strided Coretime

Ranges can be strided (i.e., applications can take turns on a core) to share costs or decrease block
production rate, for example.

### Combined Coretime

An application can be assigned to multiple cores simultaneously. Some applications can have a
permanent core assignment and an intermittent one, for example, in a period of high demand to send
multiple blocks to multiple cores at the same time slot to reduce latency.

## Agile Core Usage

In Polkadot 1.0, one core is assigned to one application (in this case, equivalent to a parachain).
Ideally, core affinity (i.e., which application operates on which core) is unimportant (see below).
Cores do not have any higher friendliness to one application than another.

Here, we remove the assumption that each application owns a core and instead that all cores are a
resource to be consumed and used as needed by all applications in the ecosystem.

### Compressed Cores

The same core can secure multiple blocks of the same application simultaneously. Combining multiple
application blocks in the same relay chain core will reduce latency at the expense of increased
bandwidth for the fixed price of opening and closing a block.

### Shared Cores

Sharing cores with other applications to share costs but with no reduction in latency. Note that this is different from the split coretime where one core is used by multiple application at different times to share costs at the expense of higher latency.

## Agile Composable Computer

All the above options of agile coretime allocation and core usage can be composable and enable the creation of an agile decentralized global computing system.

Thus, this new vision is focused on Polkadot’s resource, which is secure, flexible, and available
blockspace that can be accessed by reserving some time on a core. Agility in allocating coretime and
using cores allows for maximized network efficiency and blockspace usage.


# Phragmen algorithm

Below is information about phragmen algorithm in Polkadot.

## What is the sequential Phragmén method?

The sequential Phragmén method is a multi-winner election method introduced by Edvard Phragmén in
the 1890s. The quote below taken from the reference [Phragmén paper](#external-resources) sums up
the purpose of the sequential Phragmén method:

:::note

The problem that Phragmén’s methods try to solve is that of electing a set of a given numbers of
persons from a larger set of candidates. Phragmén discussed this in the context of a parliamentary
election in a multi-member constituency; the same problem can, of course, also occur in local
elections, but also in many other situations such as electing a board or a committee in an
organization.

:::

### Validator Elections

The sequential Phragmén is one of the methods used in the Nominated Proof-of-Stake scheme to elect
validators based on their own self-stake and the stake that is voted to them from nominators. It
also tries to equalize the weights between the validators after each election round.

#### Off-Chain Phragmén

Given the large set of nominators and validators, Phragmén's method is a difficult optimization
problem. {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} uses off-chain workers to
compute the result off-chain and submit a transaction to propose the set of winners. The reason for
performing this computation off-chain is to keep a constant block time of six seconds and prevent
long block times at the end of each era, when the validator election takes place.

:::info Staking Miners

The process of computing the optimal solution for NPoS election can be delegated to
[Staking Miners](learn-staking-miner).

:::

### Council Elections

:::info Deprecated in Polkadot OpenGov

Phragmen was used for Council elections in [Governance v1](./learn-governance.md).

:::

The Phragmén method was also used in the council election mechanism. When you voted for council
members, you could select up to 16 different candidates and then place a reserved bond as the weight
of your vote. Phragmén would run once on every election to determine the top candidates to assume
council positions and then again amongst the top candidates to equalize the weight of the votes
behind them as much as possible.

## What does it mean for node operators?

Phragmén is something that will run in the background and requires no extra effort from you.
However, it is good to understand how it works since it means that not all the stake you've been
nominated will end up on your validator after an election. Nominators are likely to nominate a few
different validators that they trust to do a good job operating their nodes.

You can use
[this offline-phragmén](https://gist.github.com/tugytur/3531cc618bfbb42f1a6cfb44d9906197) tool for
predicting the outcome of a validator election ahead of a new election.

## Understanding Phragmén

This section explains the sequential Phragmén method in-depth and walks through examples.

### Basic Phragmén

### Rationale

In order to understand the Weighted Phragmén method, we must first understand the basic Phragmén
method. There must be some group of candidates, a group of seats they are vying for (which is less
than the size of the group of candidates), and some group of voters. The voters can cast an approval
vote - that is, they can signal approval for any subset of the candidates.

The subset should be a minimum size of one (i.e., one cannot vote for no candidates) and a maximum
size of one less than the number of candidates (i.e., one cannot vote for all candidates). Users are
allowed to vote for all or no candidates, but this will not have an effect on the final result, and
so votes of this nature are meaningless.

Note that in this example, all voters are assumed to have equal say (that is, their vote does not
count more or less than any other votes). The weighted case will be considered later. However,
weighting can be "simulated" by having multiple voters vote for the same slate of candidates. For
instance, five people voting for a particular candidate is mathematically the same as a single
person with weight `5` voting for that candidate.

The particular algorithm we call here the "Basic Phragmén" was first described by Brill _et al._ in
their paper
["Phragmén’s Voting Methods and Justified Representation"](https://ojs.aaai.org/index.php/AAAI/article/view/10598).

### Algorithm

The Phragmén method will iterate, selecting one seat at a time, according to the following rules:

1. Voters submit their ballots, marking which candidates they approve. Ballots will not be modified
   after submission.
2. An initial load of 0 is set for each ballot.
3. The candidate who wins the next available seat is the one where the ballots of their supporters
   would have the _least average (mean) cost_ if that candidate wins.
4. The _n_ ballots that approved that winning candidate get _1/n_ added to their load.
5. The load of all ballots that supported the winner of this round are averaged out so that they are
   equal.
6. If there are any more seats, go back to step 3. Otherwise, the selection ends.


### Weighted Phragmén

### Rationale

While this method works well if all voters have equal weight, this is not the case in
{{ polkadot: Polkadot. :polkadot }}{{ kusama: Kusama. :kusama }} Elections for both validators and
candidates for the {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} Council are
weighted by the number of tokens held by the voters. This makes elections more similar to a
corporate shareholder election than a traditional political election, where some members have more
pull than others. Someone with a single token will have much less voting power than someone
with 100. Although this may seem anti-democratic, in a pseudonymous system, it is trivial for
someone with 100 tokens to create 100 different accounts and spread their wealth to all of their
pseudonyms.

Therefore, not only do we want to allow voters to have their preferences expressed in the result,
but do so while keeping as equal a distribution of their stake as possible and express the wishes of
minorities as much as is possible. The Weighted Phragmén method allows us to reach these goals.

### Algorithm

Weighted Phragmén is similar to Basic Phragmén in that it selects candidates sequentially, one per
round, until the maximum number of candidates are elected. However, it has additional features to
also allocate weight (stake) behind the candidates.

_NOTE: in terms of validator selection, for the following algorithm, you can think of "voters" as
"nominators" and "candidates" as "validators"._

1. Candidates are elected, one per round, and added to the set of successful candidates (they have
   won a "seat"). This aspect of the algorithm is very similar to the "basic Phragmén" algorithm
   described above.
2. However, as candidates are elected, a weighted mapping is built, defining the weights of each
   selection of a validator by each nominator.

In more depth, the algorithm operates like so:

1. Create a list of all voters, their total amount of stake, and which validators they support.
2. Generate an initial edge-weighted graph mapping from voters to candidates, where each edge weight
   is the total _potential_ weight (stake) given by that voter. The sum of all potential weight for
   a given candidate is called their _approval stake_.
3. Now we start electing candidates. For the list of all candidates who have not been elected, get
   their score, which is equal to `1 / approval_stake`.
4. For each voter, update the score of each candidate they support by adding their total budget
   (stake) multiplied by the load of the voter and then dividing by that candidate's approval stake
   `(voter_budget * voter_load / candidate_approval_stake)`.
5. Determine the candidate with the lowest score and elect that candidate. Remove the elected
   candidate from the pool of potential candidates.
6. The load for each edge connecting to the winning candidate is updated, with the edge load set to
   the score of the candidate minus the voter's load, and the voter's load then set to the
   candidate's score.
7. If there are more candidates to elect, go to Step 3. Otherwise, continue to step 8.
8. Now the stake is distributed amongst each nominator who backed at least one elected candidate.
   The backing stake for each candidate is calculated by taking the budget of the voter and
   multiplying by the edge load then dividing by the candidate load
   (`voter_budget * edge_load / candidate_load`).

## Optimizations

The results for nominating validators are further optimized for several purposes:

1. To reduce the number of edges, i.e. to minimize the number of validators any nominator selects
2. To ensure, as much as possible, an even distribution of stake among the validators
3. Reduce the amount of block computation time

### High-Level Description

After running the weighted Phragmén algorithm, a process is run that redistributes the vote amongst
the elected set. This process will never add or remove an elected candidate from the set. Instead,
it reduces the variance in the list of backing stake from the voters to the elected candidates.
Perfect equalization is not always possible, but the algorithm attempts to equalize as much as
possible. It then runs an edge-reducing algorithm to minimize the number of validators per
nominator, ideally giving every nominator a single validator to nominate per era.

To minimize block computation time, the staking process is run as an
[off-chain worker](https://docs.substrate.io/reference/how-to-guides/offchain-workers/). In order to
give time for this off-chain worker to run, staking commands (bond, nominate, etc.) are not allowed
in the last quarter of each era.

These optimizations will not be covered in-depth on this page. For more details, you can view the
[Rust implementation of elections in Substrate](https://github.com/paritytech/substrate/blob/master/frame/elections-phragmen/src/lib.rs),
the
[Rust implementation of staking in Substrate](https://github.com/paritytech/substrate/blob/master/frame/staking/src/lib.rs),
or the `seqPhragménwithpostprocessing` method in the
[Python reference implementation](https://github.com/w3f/consensus/tree/master/NPoS). If you would
like to dive even more deeply, you can review the
[W3F Research Page on Sequential Phragmén Method](https://research.web3.foundation/Polkadot/protocols/NPoS/Overview#the-election-process).

### Rationale for Minimizing the Number of Validators Per Nominator

Paying out rewards for staking from every validator to all of their nominators can cost a
non-trivial amount of chain resources (in terms of space on chain and resources to compute). Assume
a system with 200 validators and 1000 nominators, where each of the nominators has nominated 10
different validators. Payout would thus require `1_000 * 10`, or 10_000 transactions. In an ideal
scenario, if every nominator selects a single validator, only 1_000 transactions would need to take
place - an order of magnitude fewer. Empirically, network slowdown at the beginning of an era has
occurred due to the large number of individual payouts by validators to nominators. In extreme
cases, this could be an attack vector on the system, where nominators nominate many different
validators with small amounts of stake in order to slow the system at the next era change.

While this would reduce network and on-chain load, being able to select only a single validator
incurs some diversification costs. If the single validator that a nominator has nominated goes
offline or acts maliciously, then the nominator incurs a risk of a significant amount of slashing.
Nominators are thus allowed to nominate up to 16 different validators. However, after the weighted
edge-reducing algorithm is run, the number of validators per nominator is minimized. Nominators are
likely to see themselves nominating a single active validator for an era.

At each era change, as the algorithm runs again, nominators are likely to have a different validator
than they had before (assuming a significant number of selected validators). Therefore, nominators
can diversify against incompetent or corrupt validators causing slashing on their accounts, even if
they only nominate a single validator per era.

### Rationale for Maintaining an Even Distribution of Stake

Another issue is that we want to ensure that as equal a distribution of votes as possible amongst
the elected validators or council members. This helps us increase the security of the system by
ensuring that the minimum amount of tokens in order to join the active validator set or council is
as high as possible. For example, assume a result of five validators being elected, where validators
have the following stake: `{1_000, 20, 10, 10, 10}`, for a total stake of 1_050. In this case, a
potential attacker could join the active validator set with only 11 tokens, and could obtain a
majority of validators with only 33 tokens (since the attacker only has to have enough stake to
"kick out" the three lowest validators).

In contrast, imagine a different result with the same amount of total stake, but with that stake
perfectly equally distributed: `{210, 210, 210, 210, 210}`. With the same amount of stake, an
attacker would need to stake 633 tokens in order to get a majority of validators, a much more
expensive proposition. Although obtaining an equal distribution is unlikely, the more equal the
distribution, the higher the threshold - and thus the higher the expense - for attackers to gain
entry to the set.

### Rationale for Reducing Block Computing Time

Running the Phragmén algorithm is time-consuming, and often cannot be completed within the time
limits of production of a single block. Waiting for calculation to complete would jeopardize the
constant block production time of the network. Therefore, as much computation as possible is moved
to an off-chain worker, which validators can work on the problem without impacting block production
time.

There are several restrictions put in place to limit the complexity of the election and payout. As
already mentioned, any given nominator can only select up to
{{ polkadot: <RPC network="polkadot" path="consts.staking.maxNominations" defaultValue={16}/> :polkadot }}
{{ kusama: <RPC network="kusama" path="consts.staking.maxNominations" defaultValue={24}/> :kusama }}
validators to nominate. Conversely, a single validator can have only
{{ polkadot: <RPC network="polkadot" path="query.staking.maxNominatorsCount" defaultValue={50000}/> :polkadot }}
{{ kusama: <RPC network="kusama" path="query.staking.maxNominatorsCount" defaultValue={20000}/> :kusama }}
nominators. A drawback to this is that it is possible, if the number of nominators is very high or
the number of validators is very low, that all available validators may be "oversubscribed" and
unable to accept more nominations. In this case, one may need a larger amount of stake to
participate in staking, since nominations are priority-ranked in terms of amount of stake.

### Phragmms (aka Balphragmms)

`Phragmms`, formerly known as `Balphragmms`, is a new election rule inspired by Phragmén and
developed in-house for {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}. In general,
election rules on blockchains is an active topic of research. This is due to the conflicting
requirements for election rules and blockchains: elections are computationally expensive, but
blockchains are computationally limited. Thus, this work constitutes state of the art in terms of
optimization.

Proportional representation is a very important property for a decentralized network to have in
order to maintain a sufficient level of decentralization. While this is already provided by the
currently implemented `seqPhragmen`, this new election rule provides the advantage of the added
security guarantee described below. As far as we can tell, at the time of writing, Polkadot and
Kusama are the only blockchain networks that implement an election rule that guarantees proportional
representation.

The security of a distributed and decentralized system such as
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} is directly related to the goal of
avoiding _overrepresentation_ of any minority. This is a stark contrast to traditional approaches to
proportional representation axioms, which typically only seek to avoid underrepresentation.

#### Maximin Support Objective and PJR

This new election rule aims to achieve a constant-factor approximation guarantee for the _maximin
support objective_ and the closely related _proportional justified representation_ (PJR) property.

The maximin support objective is based on maximizing the support of the least-supported elected
candidate, or in the case of Polkadot and Kusama, maximizing the least amount of stake backing
amongst elected validators. This security-based objective translates to a security guarantee for
NPoS and makes it difficult for an adversarial whale’s validator nodes to be elected. The `Phragmms`
rule, and the guarantees it provides in terms of security and proportionality, have been formalized
in a [peer-reviewed paper](https://arxiv.org/pdf/2004.12990.pdf)).

The PJR property considers the proportionality of the voter’s decision power. The property states
that a group of voters with cohesive candidate preferences and a large enough aggregate voting
strength deserve to have a number of representatives proportional to the group’s vote strength.

#### Comparing Sequential Phragmén, MMS, and Phragmms

_Sequential Phragmén_ (`seqPhragmen`) and `MMS` are two efficient election rules that both achieve
PJR.

Currently, {{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }} employs the `seqPhragmen`
method for validator and council elections. Although `seqPhramen` has a very fast runtime, it does
not provide constant-factor approximation for the maximin support problem. This is due to
`seqPhramen` only performing an _approximate_ rebalancing of the distribution of stake.

In contrast, `MMS` is another standard greedy algorithm that simultaneously achieves the PJR
property and provides a constant factor approximation for maximin support, although with a
considerably slower runtime. This is because for a given partial solution, `MMS` computes a balanced
edge weight vector for each possible augmented committee when a new candidate is added, which is
computationally expensive.

We introduce a new heuristic inspired by `seqPhragmen`, `PhragMMS`, which maintains a comparable
runtime to `seqPhragmen`, offers a constant-factor approximation guarantee for the maximin support
objective, and satisfies PJR. This is the fastest known algorithm to achieve a constant-factor
guarantee for maximin support.

#### The New Election Rule: Phragmms

`Phragmms` is an iterative greedy algorithm that starts with an empty committee and alternates
between the `Phragmms` heuristic for inserting a new candidate and _rebalancing_ by replacing the
weight vector with a balanced one. The main differentiator between `Phragmms` and `seqPhragmen` is
that the latter only perform an approximate rebalancing. Details can be found in
[Balanced Stake Distribution](#rationale-for-maintaining-an-even-distribution-of-stake).

The computation is executed by off-chain workers privately and separately from block production, and
the validators only need to submit and verify the solutions on-chain. Relative to a committee _A_,
the score of an unelected candidate _c_ is an easy-to-compute rough estimate of what would be the
size of the least stake backing if we added _c_ to committee _A_. Observing on-chain, only one
solution needs to be tracked at any given time, and a block producer can submit a new solution in
the block only if the block passes the verification test, consisting of checking:

1. Feasibility,
2. Balance and
3. Local Optimality - The least stake backing of _A_ is higher than the highest score among
   unelected candidates

If the tentative solution passes the tests, then it replaces the current solution as the tentative
winner. The official winning solution is declared at the end of the election window.

A powerful feature of this algorithm is the fact that both its approximation guarantee for maximin
support and the above checks passing can be efficiently verified in linear time. This allows for a
more scalable solution for secure and proportional committee elections. While `seqPhragmen` also has
a notion of score for unelected candidates, `Phragmms` can be seen as a natural complication of the
`seqPhragmen` algorithm, where `Phragmms` always grants higher score values to candidates and thus
inserts them with higher support values.

**To summarize, the main differences between the two rules are:**

- In `seqPhragmen`, lower scores are better, whereas in `Phragmms`, higher scores are better.
- Inspired by `seqPhragmen`, the scoring system of `Phragmms` can be considered to be more intuitive
  and does a better job at estimating the value of adding a candidate to the current solution, and
  hence leads to a better candidate-selection heuristic.
- Unlike `seqPhragmen`, in `Phragmms`, the edge weight vector _w_ is completely rebalanced after
  each iteration of the algorithm.

The `Phragmms` election rule is currently being implemented on
{{ polkadot: Polkadot :polkadot }}{{ kusama: Kusama :kusama }}. Once completed, it will become one
of the most sophisticated election rules implemented on a blockchain. For the first time, this
election rule will provide both fair representation (PJR) and security (constant-factor
approximation for the maximin support objection) to a blockchain network.

#### Algorithm

The `Phragmms` algorithm iterates through the available seats, starting with an empty committee of
size _k_:

1. Initialize an empty committee _A_ and zero edge weight vector _w = 0_.

2. Repeat _k_ times:

   - Find the unelected candidate with highest score and add it to committee _A_.
   - Re-balance the weight vector _w_ for the new committee _A_.

3. Return _A_ and _w_.
