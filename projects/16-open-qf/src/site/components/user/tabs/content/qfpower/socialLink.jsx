import React from "react";
import TwitterConnect from "./twitterConnect";
import GitHubConnect from "./githubConnct";

export default function UserTabQFpowerSocialLink() {
  return (
    <div>
      <h3 className="mb-5 text18semibold text-text-primary">Social Link</h3>

      <ul className="space-y-3">
        <TwitterConnect />
        <GitHubConnect />
      </ul>
    </div>
  );
}
