# Betting dapp

Note: I actually kept saving commits in a different repo (https://github.com/lousydropout/curly-bassoon).

## Introduction

Oracles are expensive but play an important role in blockchain because they provide us with outside information.

One example where this occurs is in `social betting`.
To decide the winner, the smart contract requires outside information in some manner.
However, while there are decentralized oracles that provide information about exchange rates (think, Chainlink's price feeds),
they don't exactly serve most niches cases.
So, what is a developer to do?

Avoiding centralized/dictatorial decisions, there are two choices as I see it:
1. Contact Chainlink or some other decentralized oracle service and convince them to set up a data feed for your niche case. This unfortunately is likely to be expensive since you'd essentially be asking a bunch of strangers to care about this niche event that, for the most part, only you care about. So, this is not a good option.
2. Utilize game theory and a poor man's oracle as I've done for this project and will explain below.


## A walkthrough of the betting dapp

Alice and Bob are strangers.
They have no idea who the other person really is or where the other person lives offline.
They both see themselves as trustworthy and try to see the best in others, but would rather there be a mechanism for handling issues when the other person fails to be honest.

Alice and Bob further enjoy watching chess and are excited about an upcoming chess tournament.
Further, they disagree on which chess grandmaster will win the tournament.
So, they agree to a friendly wager.

Alice creates submits the creation of the betting smart contract, entering the following information
```yaml
event: chess tournament
bettor_1: <Alice's account id>
bettor_2: <Bob's account id>
condition_for_winning: "Alice wins if Magnus Carlsen wins; Bob wins if Hikaru Nakamura wins; they draw otherise"
amount_to_wager: 10 DOTs
event_will_have_concluded_by: <A day after the tournament>
```

Further, as part of the contract's creation, Alice sent in her `fee`` as well as`10 DOTs` for the contract to hold on to until a decision on who won is made.
Alice then sends Bob the smart contract's address and the bet's ID.
Bob agrees by sending to the contract his `fee` and his `10 DOTs` as part of the wager.
The `fee`s are important for keeping Alice and Bob honest.

Now, they wait for the event to conclude.

A day after the event's conclusion, Alice and Bob will both submit what they claim to be the outcome of the wager (i.e. Alice won, Bob won, they drew, they disagree). Depending on Alice and Bob's claims, one of 3 different scenarios will occur.

### Scenario 1: Alice and Bob remain honest and their claims about the event's outcome agree
In such a case, the smart contract will simply send the winnings to the winner.
Since both parties already agree, there's no reason to complicate things further.

### Scenario 2: Alice and Bob disagree on who won, reviewer decides, and neither appeals
In this case, by disagreeing, they flag the smart contract to randomly select a `reviewer` to decide for them.
The basis of the reviewer's decision is to be what they wrote for `condition_for_winning` in the creation of the bet on the smart contract.
If neither appeals, then the bettor the reviewer decided won will receive their winnings.

Further, the loser here will forfeit the `fee`s he staked as part of creating/accepting the bet on the smart contract.
The forfeited `fee` will go to the reviewer as payment for his/her service.

### Scenario 2: Alice and Bob disagree on who won, reviewer decides, and one appeals
In this case, a person who has been granted `final decision privileges` will make the decision without anyone having further recourse for appeal.
Whoever loses the appeal will have his/her staked fees forfeited (This is true for the reviewer as well).

### Summary
In essence, the key here is that all parties have to have money on the line.
Alice and Bob risk losing their `fees` paid to host this bet if they are dishonest.
Similarly, reviewers risk losing their staked fees if they too are dishonest.
The person/group of persons with `final decision privileges` risk driving users away from utilizing the smart contract and the random oracle created as part of this.

Thus, all parties have an incentive to be honest.


## How to run this

```bash
# cd into the src/ directory
cd src/
# run Cargo test to have rust run through the various test cases in ./src/lib.rs
cargo test
```

## Business model

There are two groups of people who would interact with this smart contract in hopes of economic gains:
1. reviewers -- They act as a random oracle and profit when they are called to settle disputes. They don't get paid if their services are not requested.
2. special group with `final decision privileges` -- Unfortunately, they act as a centralized source of decision-making power. However, they are unable to make any decision unless both the users and the reviewer disagree with each other. As they each are incentivized to be honest, this group should only have any power in rare situations.