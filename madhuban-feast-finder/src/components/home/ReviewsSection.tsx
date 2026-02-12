import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import { Star } from "lucide-react";

type Review = {
  rating: number;
  comment?: string;
  images?: string[];
  createdAt: string;
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

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-secondary/5 via-background to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-sm font-medium text-secondary">Reviews</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary">
              What Customers Say
            </h2>
          </div>
        </div>

        {loading && (
          <div className="text-sm text-muted-foreground">Loading reviews...</div>
        )}
        {!loading && reviews.length === 0 && (
          <div className="text-sm text-muted-foreground">
            No reviews yet.
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, idx) => (
            <div
              key={`${review.createdAt}-${idx}`}
              className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm"
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
              {review.comment && (
                <p className="mt-3 text-sm text-muted-foreground">
                  {review.comment}
                </p>
              )}
              {review.images && review.images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {review.images.slice(0, 3).map((src, imgIdx) => (
                    <img
                      key={`${idx}-${imgIdx}`}
                      src={src}
                      alt="Review"
                      className="h-20 w-full rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}
              <div className="mt-4 text-xs text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
