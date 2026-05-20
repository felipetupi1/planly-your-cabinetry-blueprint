export interface PortfolioItem {
  id: string;
  src: string;
  category: "render" | "document";
  spaceType: string;
  description?: string;
}

const KITCHEN_1 = "https://drive.google.com/uc?export=view&id=1px5x-JRw0ngs3iJthkD0PLeUBEneODd2";
const KITCHEN_2 = "https://drive.google.com/uc?export=view&id=1UkpQJXKvWkRDQ1XQF-n0OHBaG8gquwFN";
const KITCHEN_3 = "https://drive.google.com/uc?export=view&id=1SeHKoKUrvjwfrECWDIRdDz5HaSWKKCPp";

const CLOSET_1 = "https://drive.google.com/uc?export=view&id=1jTmSuIC6geuBO8F0OSMZse6p86PDs0ZB";
const CLOSET_2 = "https://drive.google.com/uc?export=view&id=1u6C4PQ_TGj5qoHC3mOdTOW8hK8XC5wII";
const CLOSET_3 = "https://drive.google.com/uc?export=view&id=1r0PB-IetKQCN-sU9z9wFHwDkJX0Vko_b";

export const portfolioItems: PortfolioItem[] = [
  {
    id: "r1",
    src: KITCHEN_1,
    category: "render",
    spaceType: "Kitchen",
    description: "White oak cabinetry with marble countertops",
  },
  {
    id: "r2",
    src: CLOSET_1,
    category: "render",
    spaceType: "Closet",
    description: "Walk-in closet with dark walnut built-ins",
  },
  {
    id: "r3",
    src: KITCHEN_2,
    category: "render",
    spaceType: "Home Office",
    description: "Built-in desk and wall shelving unit",
  },
  {
    id: "r4",
    src: KITCHEN_3,
    category: "render",
    spaceType: "Bathroom",
    description: "Floating double vanity with marble backsplash",
  },
  {
    id: "r5",
    src: CLOSET_2,
    category: "render",
    spaceType: "Pantry",
    description: "Floor-to-ceiling custom pantry with pull-out drawers",
  },
  {
    id: "d1",
    src: CLOSET_3,
    category: "document",
    spaceType: "Kitchen",
    description: "Elevation and floor plan — construction sheet",
  },
  {
    id: "d2",
    src: "https://drive.google.com/uc?export=view&id=1px5x-JRw0ngs3iJthkD0PLeUBEneODd2",
    category: "document",
    spaceType: "Closet",
    description: "Section detail and cabinet elevations",
  },
  {
    id: "d3",
    src: "https://drive.google.com/uc?export=view&id=1UkpQJXKvWkRDQ1XQF-n0OHBaG8gquwFN",
    category: "document",
    spaceType: "Bathroom",
    description: "Vanity elevation with plumbing rough-in details",
  },
];
