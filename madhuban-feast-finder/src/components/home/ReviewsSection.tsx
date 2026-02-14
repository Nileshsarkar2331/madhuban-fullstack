import React, { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import { Star } from "lucide-react";

type Review = {
  rating: number;
  comment?: string;
  images?: string[];
  createdAt: string;
  username?: string;
};

const ReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/reviews/public`);
        if (!res.ok) {
          setReviews([]);
          return;
        }
        const data = await res.json();
        setReviews(Array.isArray(data.reviews) ? data.reviews : []);
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const splitReviews = useMemo(() => {
    if (reviews.length === 0) {
      return { upper: [], lower: [] };
    }
    const mid = Math.ceil(reviews.length / 2);
    return {
      upper: reviews.slice(0, mid),
      lower: reviews.slice(mid),
    };
  }, [reviews]);

  const loopItems = (items: Review[], min = 6) => {
    if (items.length === 0) return [];
    const out = [...items];
    while (out.length < min) {
      out.push(...items);
    }
    return out;
  };

  const upperLoop = loopItems(splitReviews.upper, 6);
  const lowerLoop = loopItems(splitReviews.lower.length ? splitReviews.lower : splitReviews.upper, 6);

  return (
    <section className="relative py-14 sm:py-20 overflow-hidden bg-gradient-to-b from-[#f9f5ef] via-[#fdfbf7] to-white">
      <style>{`
        @keyframes reviews-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes reviews-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-10 h-48 w-48 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-10 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium text-secondary">Reviews</p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-primary">
            Hear From Our Customers
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Real feedback from our community, shared with love.
          </p>
        </div>

        {loading && (
          <div className="mt-6 text-sm text-muted-foreground text-center">
            Loading reviews...
          </div>
        )}
        {!loading && reviews.length === 0 && (
          <div className="mt-6 text-sm text-muted-foreground text-center">
            No reviews yet.
          </div>
        )}

        {reviews.length > 0 && (
          <div className="mt-10 space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#fdfbf7] to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#fdfbf7] to-transparent pointer-events-none" />
              <div className="overflow-hidden">
                <div
                  className="flex w-max gap-4 pr-4"
                  style={{ animation: "reviews-left 45s linear infinite" }}
                >
                  {[...upperLoop, ...upperLoop].map((review, idx) => (
                    <div
                      key={`upper-${idx}`}
                      className="w-[260px] sm:w-[320px] rounded-2xl border border-border/60 bg-white/90 p-4 shadow-sm backdrop-blur"
                    >
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              review.rating >= star
                                ? "text-secondary"
                                : "text-muted-foreground/40"
                            }`}
                            fill={review.rating >= star ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                      {review.username && (
                        <div className="mt-2 text-sm font-semibold text-foreground">
                          {review.username}
                        </div>
                      )}
                      {review.comment && (
                        <p className="mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-3">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#fdfbf7] to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#fdfbf7] to-transparent pointer-events-none" />
              <div className="overflow-hidden">
                <div
                  className="flex w-max gap-4 pr-4"
                  style={{ animation: "reviews-right 55s linear infinite" }}
                >
                  {[...lowerLoop, ...lowerLoop].map((review, idx) => (
                    <div
                      key={`lower-${idx}`}
                      className="w-[260px] sm:w-[320px] rounded-2xl border border-border/60 bg-white/90 p-4 shadow-sm backdrop-blur"
                    >
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              review.rating >= star
                                ? "text-secondary"
                                : "text-muted-foreground/40"
                            }`}
                            fill={review.rating >= star ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                      {review.username && (
                        <div className="mt-2 text-sm font-semibold text-foreground">
                          {review.username}
                        </div>
                      )}
                      {review.comment && (
                        <p className="mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-3">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
