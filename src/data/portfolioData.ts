import renderKitchen from "@/assets/portfolio/render-kitchen.jpg";
import renderCloset from "@/assets/portfolio/render-closet.jpg";
import renderOffice from "@/assets/portfolio/render-office.jpg";
import renderVanity from "@/assets/portfolio/render-vanity.jpg";
import renderPantry from "@/assets/portfolio/render-pantry.jpg";
import docKitchen from "@/assets/portfolio/doc-kitchen.jpg";

export interface PortfolioItem {
  id: string;
  src: string;
  category: "render" | "document";
  spaceType: string;
  description?: string;
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: "r1",
    src: renderKitchen,
    category: "render",
    spaceType: "Kitchen",
    description: "White oak cabinetry with marble countertops",
  },
  {
    id: "r2",
    src: renderCloset,
    category: "render",
    spaceType: "Closet",
    description: "Walk-in closet with dark walnut built-ins",
  },
  {
    id: "r3",
    src: renderOffice,
    category: "render",
    spaceType: "Home Office",
    description: "Built-in desk and wall shelving unit",
  },
  {
    id: "r4",
    src: renderVanity,
    category: "render",
     spaceType: "Bathroom",
     description: "Floating double vanity with marble backsplash",
  },
  {
    id: "r5",
    src: renderPantry,
    category: "render",
    spaceType: "Pantry",
    description: "Floor-to-ceiling custom pantry with pull-out drawers",
  },
  {
    id: "d1",
    src: docKitchen,
    category: "document",
    spaceType: "Kitchen",
    description: "Elevation and floor plan — construction sheet",
  },
  {
    id: "d2",
    src: docKitchen,
    category: "document",
    spaceType: "Closet",
    description: "Section detail and cabinet elevations",
  },
  {
    id: "d3",
    src: docKitchen,
    category: "document",
     spaceType: "Bathroom",
     description: "Vanity elevation with plumbing rough-in details",
  },
];
