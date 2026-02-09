import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import mdban1 from "@/assets/mdban1.jpg";
import mdban2 from "@/assets/mdban2.jpg";
import mdban3 from "@/assets/mdban3.jpg";
import mdban4 from "@/assets/mdban4.jpg";
import mdban5 from "@/assets/mdban5.jpg";
import mdban6 from "@/assets/mdban6.jpg";
import mdban7 from "@/assets/mdban7.jpg";
import mdban8 from "@/assets/mdban8.jpg";
import mdban9 from "@/assets/mdban9.jpg";
import mdban10 from "@/assets/mdban10.jpeg";
import mdban11 from "@/assets/mdban11.jpeg";
import mdban12 from "@/assets/mdban12.jpg";
import mdban13 from "@/assets/mdban13.jpg";

const GalleryCarousel = () => {
  const images = useMemo(
    () => [
      { src: mdban1, alt: "Madhuban ambience" },
      { src: mdban2, alt: "Madhuban pizza" },
      { src: mdban3, alt: "Madhuban lawn" },
      { src: mdban4, alt: "Madhuban night lights" },
      { src: mdban5, alt: "Madhuban pizza night" },
      { src: mdban6, alt: "Madhuban lanterns" },
      { src: mdban7, alt: "Madhuban gathering" },
      { src: mdban8, alt: "Madhuban decor" },
      { src: mdban9, alt: "Madhuban evening vibe" },
      { src: mdban10, alt: "Madhuban garden view" },
      { src: mdban11, alt: "Madhuban celebration" },
      { src: mdban12, alt: "Madhuban outdoor seating" },
      { src: mdban13, alt: "Madhuban family time" },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToIndex = (next: number) => {
    const total = images.length;
    const safe = (next + total) % total;
    setIndex(safe);
    const el = itemRefs.current[safe];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  };

  useEffect(() => {
    if (paused || !inView) return;
    const id = window.setInterval(() => {
      scrollToIndex(index + 1);
    }, 4000);
    return () => window.clearInterval(id);
  }, [index, paused, inView]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-12 sm:py-16 bg-gradient-to-b from-background via-background to-secondary/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-sm font-medium text-secondary">Gallery</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary">
              Moments at Madhuban
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scrollToIndex(index - 1)}
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scrollToIndex(index + 1)}
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none" />

          <div className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4">
            {images.map((image, i) => (
              <div
                key={image.src}
                ref={(el) => (itemRefs.current[i] = el)}
                className="snap-center shrink-0 w-[80%] sm:w-[55%] lg:w-[32%]"
              >
                <div
                  className={`group relative overflow-hidden rounded-3xl border border-border/60 bg-white shadow-lg transition-all duration-500 ${
                    i === index ? "scale-[1.02] shadow-2xl" : "scale-100"
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-72 sm:h-80 lg:h-96 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-2 sm:hidden">
            {images.map((_, i) => (
              <button
                key={i}
                className={`h-2.5 w-2.5 rounded-full ${
                  i === index ? "bg-primary" : "bg-border"
                }`}
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GalleryCarousel;
