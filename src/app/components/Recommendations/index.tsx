"use client";

import { Product } from "@/app/types";
import RecommendationCard from "../RecommendationCard";

interface RecommendationsProps {
  recommendations: Product[];
  onClick: (product: Product, position: number) => void;
}

function Recommendations({ recommendations, onClick }: RecommendationsProps) {
  return (
    <div className="grid grid-cols-2 gap-6 mt-10 lg:mt-16 lg:gap-4 lg:grid-cols-4">
      {recommendations.length === 0 && (
        <p className="text-lg text-gray-500">No recommendations found</p>
      )}

      {recommendations.map((product, index) => (
        <RecommendationCard
          key={`product-${product.objectID}`}
          onClick={() => onClick(product, index + 1)}
          product={product}
        />
      ))}
    </div>
  );
}

export default Recommendations;
