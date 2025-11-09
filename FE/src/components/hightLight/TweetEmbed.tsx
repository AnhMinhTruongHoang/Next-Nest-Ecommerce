"use client";
import { TwitterTweetEmbed } from "react-twitter-embed";

export default function TweetEmbed() {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", margin: "40px 0" }}
    >
      <TwitterTweetEmbed
        tweetId="1688264055989874688"
        options={{ width: 560, align: "center", theme: "dark" }}
      />
    </div>
  );
}
