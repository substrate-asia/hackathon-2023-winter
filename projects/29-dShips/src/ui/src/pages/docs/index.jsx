import React from "react";

import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const index = () => {
  return (
    <main className={`${inter.className} bg-schemes-light-surfaceContainer`}>
      <div className="flex flex-col gap-4 w-11/12 mx-auto bg-schemes-light-surfaceContainerLowest p-4 rounded-3xl">
        <div className="flex flex-col w-6/12 gap-8">
          <p className="text-xl font-bold">dShips</p>
          <div className="flex flex-col gap-4">
            <p className="text-lg font-semibold">
              Project Background/Origin/Problem to be solved
            </p>
            <p>
              In the current process of receiving shopping packages, a
              significant challenge is faced with the need to provide personal
              data to verify the identity of the recipient. This practice raises
              concerns about the privacy of the individual, as it involves
              sharing sensitive information on a frequent basis and could expose
              the user to potential security risks.
            </p>
            <p>
              The proposed solution is to implement Zero-Knowledge Proofs (zk
              proofs) as an innovative mechanism to preserve the recipient's
              privacy during the packet ownership verification process. The zk
              proofs allow proving the authenticity of the information without
              revealing the specific details of that information, ensuring that
              the recipient's identity can be verified without compromising the
              confidentiality of his or her personal data.
            </p>
            <p>
              By adopting this solution, the aim is to improve the user
              experience when receiving packages, eliminating the need to
              provide sensitive information in each transaction. In addition,
              the implementation of zk proofs will contribute to strengthen
              security and protect users' privacy, creating a more reliable and
              efficient environment in the process of receiving packages in the
              context of online shopping.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-lg font-semibold">Project Description</p>
            <p>
              dShips is presented as a solution designed to address the existing
              problem in the process of receiving packages in online shopping.
              This innovative add-on for marketplaces aims to provide anonymous
              package deliveries, eliminating the need to disclose sensitive
              personal information during ownership verification.
            </p>
            <p>
              Instead of relying on traditional disclosure of personal data,
              dShips incorporates Zero-Knowledge Proofs (zk proofs) technology
              to enable verification of the recipient's authenticity without
              compromising their privacy. This advanced technology makes it
              possible to prove that the user is the rightful owner of the
              package without revealing specific details of his or her identity,
              thus ensuring a completely anonymous delivery process.
            </p>
            <p>
              The integration of dShips into marketplaces offers users a more
              secure and convenient package receiving experience. By using zk
              proofs, dShips ensures that the recipient's personal information
              remains confidential, thus mitigating the risks associated with
              exposing sensitive data.
            </p>
            <p>
              With dShips, marketplaces can differentiate themselves by offering
              a delivery service that prioritizes user privacy, creating a
              trusted and secure environment for online transactions. This
              addition not only simplifies the process of receiving packages,
              but also sets a new standard in privacy protection in the online
              shopping arena. In addition to addressing privacy concerns in the
              parcel delivery process, dShips also has a positive impact on
              employment generation by introducing a novel and secure approach
              to hiring anonymous delivery drivers.
            </p>
            <p>
              The dShips system operates by verifying delivery drivers
              anonymously, allowing individuals interested in working as
              deliverers to apply and be selected without having to reveal their
              full identity. The verification of the authenticity of the
              deliverers is carried out through the deposit of an amount of
              money equivalent to the value of the package to be transported
              (this is an idea to be analyzed).
            </p>
            <p>
              This verification process not only ensures the legitimacy of the
              delivery person, but also acts as a preventative measure against
              potential theft or fraud. The repository provides an additional
              layer of security for both the delivery person and the customer,
              establishing a foundation of trust in the delivery system.
            </p>
            <p>
              By providing anonymous employment opportunities, dShips
              contributes to economic growth while preserving the privacy of
              those seeking employment opportunities. This innovative approach
              not only redefines the rules in package delivery, but also creates
              an ecosystem in which trust and privacy coexist, offering benefits
              for both the users and the delivery drivers involved in the
              process.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-lg font-semibold">Technical Architecture</p>
            <p>
              The idea is that dShips is designed as a pallet within the
              Polkadot framework, meaning that it is a modular and interoperable
              component that can be integrated and used on any parachain within
              the Polkadot ecosystem. This architectural decision offers a
              number of key benefits:
            </p>
            <p>
              <spam className="font-semibold mr-1">Interoperability:</spam>
              As a pallet, dShips follows the Polkadot standard for
              interoperability between parachains. It can communicate and share
              information efficiently with other chains within the Polkadot
              network, enabling seamless integration with different services and
              applications in the ecosystem.
            </p>
            <p>
              <spam className="font-semibold mr-1">
                Reusability across Parachains:
              </spam>
              The modular nature of dShips allows it to be reused in different
              parachains. Each parachain can leverage dShips functionality to
              enable anonymous packet delivery in its own context, thus
              contributing to the creation of a standardized set of services for
              the Polkadot ecosystem. <br /> With dShips, marketplaces can
              differentiate themselves by offering a delivery service that
              prioritizes user privacy, creating a trusted and secure
              environment for online transactions. This addition not only
              simplifies the process of receiving packages, but also sets a new
              standard in privacy protection in the online shopping arena. In
              addition to addressing privacy concerns in the parcel delivery
              process, dShips also has a positive impact on employment
              generation by introducing a novel and secure approach to hiring
              anonymous delivery drivers.
            </p>
            <p>
              <spam className="font-semibold mr-1">
                Polkadot Security and Consensus:
              </spam>
              Being part of the Polkadot network, dShips benefits from the
              security and consensus provided by the chain of relevance.
              Network-level validation and consensus provide an additional layer
              of trust and security to transactions conducted through dShips.
            </p>
            <p>
              <spam className="font-semibold mr-1">
                Flexibility for Developers:
              </spam>
              As a pallet, dShips provides developers with the flexibility to
              customize and tailor the anonymous delivery functionality to the
              specific requirements of each parachain. Developers can leverage
              the capabilities of dShips and customize it to meet the particular
              needs of their applications.
            </p>
            <p>
              In summary, dShips as a Polkadot pallet integrates seamlessly into
              the broader Polkadot ecosystem, providing a standardized and
              secure service for anonymous package delivery that can be
              leveraged by a variety of parachains. This contributes to the
              creation of a broader, collaborative ecosystem, where services can
              be shared and used efficiently between different chains.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-lg font-semibold">Step by step</p>
            <p>
              1. The idea is to be another tool for a marketplace environment,
              so when making a purchase, the customer can choose to receive the
              package anonymously.
            </p>
            <Image alt="1" src={"/docs/1.png"} width={500} height={500} />
            <p>
              2. At the time of purchase, a new "ship" is created within the
              dShips environment, with the basic data needed by the delivery
              person.
            </p>
            <Image alt="2" src={"/docs/2.png"} width={500} height={500} />
            <p>
              3. This new "ship" is stored in a pool of "ships" where the
              deliverer by convenience or choice chooses which packages to
              search for and deliver, assigning them to himself.
            </p>
            <Image alt="3" src={"/docs/3.png"} width={500} height={500} />
            <Image
              alt="carrier zk"
              src={"/docs/carrier zk.png"}
              width={500}
              height={500}
            />
            <p>
              4. Once you have the package assigned to you, the delivery person
              must pick it up at the seller's premises/depot, who will deliver
              the package only if he is the delivery person assigned to the
              seller. The package is marked as "picked".
            </p>
            <Image alt="4" src={"/docs/4.png"} width={500} height={500} />
            <p>
              5. The delivery person goes to the final address, where the buyer
              generates a proof of ownership in order to receive it. Once the
              package is delivered, the corresponding shipping amount is
              released to the delivery person.
            </p>
            <Image alt="5" src={"/docs/5.png"} width={500} height={500} />
            <Image
              alt="buyer zk"
              src={"/docs/buyer zk.png"}
              width={500}
              height={500}
            />
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-lg font-semibold">Plans</p>
            <div className="flex flex-col gap-4">
              <p className=" text-base font-semibold">
                Things planned to be accomplished during the hackathon
              </p>
              <p>
                Perform a proof of concept of how the environment would work,
                through an interface that allows interaction between the three
                main users: admin/seller, carrier and receiver, by means of a
                simple smart contract in order to explain the idea.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <p className=" text-base font-semibold">
                Things accomplished during the Hackathon
              </p>
              <p>
                A smart contract was made in solidity deployed in Moonbase Alpha
                together with a front-end in NextJs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default index;
