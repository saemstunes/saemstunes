import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function AppleCardsCarouselSection() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <section className="w-full h-full py-20 bg-background">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-foreground font-sans mb-8">
        Discover Musical Excellence
      </h2>
      <Carousel items={cards} />
    </section>
  );
}

const DummyContent = () => {
  return (
    <>
      {[...new Array(3).fill(1)].map((_, index) => {
        return (
          <div
            key={"dummy-content" + index}
            className="bg-muted p-8 md:p-14 rounded-3xl mb-4"
          >
            <p className="text-muted-foreground text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-foreground">
                The first rule of music is passion and dedication.
              </span>{" "}
              Keep practicing, explore different genres, and find your unique sound. 
              Want to improve your skills? No problem. Our platform is ready to support 
              every step of your musical journey.
            </p>
            <img
              src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
              alt="Music production"
              height="500"
              width="500"
              className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain mt-6 rounded-lg"
            />
          </div>
        );
      })}
    </>
  );
};

const data = [
  {
    category: "Music Production",
    title: "Create professional quality music.",
    src: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    content: <DummyContent />,
  },
  {
    category: "Instrument Mastery",
    title: "Master your instrument of choice.",
    src: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
    content: <DummyContent />,
  },
  {
    category: "Music Theory",
    title: "Understand the language of music.",
    src: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    content: <DummyContent />,
  },
  {
    category: "Collaboration",
    title: "Connect with other musicians.",
    src: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    content: <DummyContent />,
  },
  {
    category: "Live Performance",
    title: "Excel on stage with confidence.",
    src: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    content: <DummyContent />,
  },
  {
    category: "Music Business",
    title: "Navigate the music industry.",
    src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    content: <DummyContent />,
  },
];
