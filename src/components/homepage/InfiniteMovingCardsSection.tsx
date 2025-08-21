import React from "react";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

export function InfiniteMovingCardsSection() {
  return (
    <section className="py-8 md:py-16 bg-background w-full overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground text-center mb-6 md:mb-10">
          What Our Community Says
        </h2>
        <div className="w-full overflow-x-hidden">
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="normal"
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  {
    quote:
      "Saem's Tunes has completely transformed how I approach music production. The tools and resources available are incredible!",
    name: "Alex Johnson",
    title: "Music Producer",
  },
  {
    quote:
      "As a beginner, I found the learning materials incredibly helpful. The step-by-step tutorials made complex concepts easy to understand.",
    name: "Maria Rodriguez",
    title: "Beginner Musician",
  },
  {
    quote:
      "The community here is so supportive. I've connected with amazing musicians and learned so much from their experiences.",
    name: "James Wilson",
    title: "Guitarist",
  },
  {
    quote:
      "The audio quality and production value of the tracks on this platform are professional grade. It's inspiring to listen to such great work.",
    name: "Sarah Chen",
    title: "Audio Engineer",
  },
  {
    quote:
      "I've been able to book regular sessions with talented instructors who've helped me improve my skills dramatically.",
    name: "Michael Thompson",
    title: "Piano Student",
  },
];
