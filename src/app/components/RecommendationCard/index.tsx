import { Product } from "@/app/types";

interface RecommendationCardProps {
  product: Product;
  onClick: () => void;
}

function RecommendationCard({ product, onClick }: RecommendationCardProps) {
  return (
    <div className="relative group">
      <div className="overflow-hidden aspect-w-1 aspect-h-1">
        <img
          loading="eager"
          className="object-cover w-full h-full transition-all duration-300 group-hover:scale-125"
          src={product.photo}
          alt={product.name}
        />
      </div>
      <div className="flex items-start justify-between mt-4 space-x-4">
        <div>
          <h3 className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onClick();
              }}
            >
              {product.name.toUpperCase()}
              <span className="absolute inset-0" aria-hidden="true"></span>
            </a>
          </h3>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">
            ${product.price}
          </p>
        </div>
      </div>
      <div className="flex items-start justify-between mt-4 space-x-4">
        <p className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">
          {product.rankingScore}
        </p>
      </div>
    </div>
  );
}

export default RecommendationCard;
