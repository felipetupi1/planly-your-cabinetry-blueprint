import { Star } from "lucide-react";

interface Review {
  id: string;
  text: string;
  clientName: string;
  spaceType: string;
  rating: number;
}

const mockReviews: Review[] = [
  {
    id: "1",
    text: "The documents were incredibly detailed. My cabinetmaker said he'd never received such clear instructions from a client. Worth every penny.",
    clientName: "Maria S.",
    spaceType: "Kitchen",
    rating: 5,
  },
  {
    id: "2",
    text: "I was skeptical about doing this online, but the process was seamless. The 3D render helped me visualize everything before committing.",
    clientName: "John D.",
    spaceType: "Closet",
    rating: 5,
  },
  {
    id: "3",
    text: "Got three quotes from different cabinetmakers using the same set of documents. Saved me thousands by being able to compare apples to apples.",
    clientName: "Ana L.",
    spaceType: "Home Office",
    rating: 5,
  },
  {
    id: "4",
    text: "Fast delivery, professional communication, and the final product exceeded expectations. Already planning my next project with them.",
    clientName: "Carlos M.",
    spaceType: "Pantry",
    rating: 5,
  },
];

export function Reviews() {
  return (
    <section id="reviews" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-medium text-center text-foreground tracking-wide">
          What our clients say
        </h2>
        <div className="mt-12 grid sm:grid-cols-2 gap-5">
          {mockReviews.map((review) => (
            <div
              key={review.id}
              className="border border-border rounded-lg p-6 bg-background"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground leading-relaxed font-light">{review.text}</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{review.clientName}</span>
                <span className="text-xs text-muted-foreground">· {review.spaceType}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
