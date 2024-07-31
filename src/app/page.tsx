"use client";

import { useEffect, useState } from "react";

import Recommendations from "./components/Recommendations";
import SearchBar from "./components/SearchBar";
import SubmitButton from "./components/SubmitButton";
import { Product } from "./types";
import { algoliaSearchIndex } from "./libs/algolia";
import { analytics } from "./libs/segment";

const DEFAULT_USER_ID = process.env.NEXT_PUBLIC_DEFAULT_USER_ID!;

export default function Home() {
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [queryID, setQueryID] = useState<string | null>();
  const [userToken, setUserToken] = useState(DEFAULT_USER_ID);

  async function searchItems(query?: string | null, userToken?: string | null) {
    console.debug("Searching for items", { query, userToken });
    const searchResults = await algoliaSearchIndex.search<Product>(
      query ?? "",
      {
        userToken: userToken ?? DEFAULT_USER_ID,
        explain: ["personalization"],
        enablePersonalization: true,
        clickAnalytics: true,
        hitsPerPage: 8,
        analytics: true,
      }
    );

    console.dir({ searchResults }, { depth: null });
    setSearchResults(
      searchResults.hits.map(({ _rankingInfo, ...product }) => ({
        ...product,
        rankingScore: _rankingInfo?.personalization?.score,
      }))
    );
    setQueryID(searchResults.queryID);
    setUserToken(userToken ?? DEFAULT_USER_ID);
  }

  async function identifyUser(userToken: string) {
    console.debug("Identifying user", { userToken });
    await analytics.identify(userToken);
  }

  async function trackProductClicked(product: Product, position: number) {
    console.debug("Product clicked", { product, position, queryID, userToken });

    await analytics.track("Product Clicked", {
      eventType: "click",
      apiKey: process.env.NEXT_PUBLIC_ALGOLIA_API_KEY,
      appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
      objectID: product.objectID,
      position,
      index: "market_products_staging",
      queryID,
      userToken,
    });
  }

  useEffect(() => {
    searchItems();
  }, []);

  useEffect(() => {
    identifyUser(userToken);
  }, [userToken]);

  async function formAction(data: FormData) {
    const search = data.get("search");
    const userToken = data.get("userToken");

    if (
      search != null &&
      (typeof search !== "string" || search.trim() === "")
    ) {
      console.debug("No search query provided", { search });
      return;
    }
    if (
      userToken != null &&
      (typeof userToken !== "string" || userToken.trim() === "")
    ) {
      console.debug("No user token provided", { userToken });
      return;
    }

    await searchItems(search, userToken);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <form action={formAction}>
        <SearchBar
          title="Switch User ID:"
          inputProps={{
            name: "userToken",
            defaultValue: DEFAULT_USER_ID,
          }}
        />
        <SearchBar
          title="Search for an Item:"
          inputProps={{ name: "search" }}
        />
        <SubmitButton />
      </form>

      <Recommendations
        recommendations={searchResults}
        onClick={trackProductClicked}
      />
    </main>
  );
}
