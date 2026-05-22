export interface PDFTheme {
  id: string;
  name: string;
  description: string;
  fontFamily: string;
  headingFont: string;
  bgClass: string;
  textClass: string;
  containerClass: string;
}

export const PDF_THEMES: PDFTheme[] = [
  {
    id: "modern",
    name: "Modern Tech",
    description: "Sleek Outfit typography and blue accents.",
    fontFamily: "'Inter', sans-serif",
    headingFont: "'Outfit', sans-serif",
    bgClass: "bg-white",
    textClass: "text-slate-800",
    containerClass: "theme-modern max-w-none"
  },
  {
    id: "academic",
    name: "Classic Academic",
    description: "Traditional paper style using elegant EB Garamond.",
    fontFamily: "'EB Garamond', serif",
    headingFont: "'EB Garamond', serif",
    bgClass: "bg-white",
    textClass: "text-neutral-900",
    containerClass: "theme-academic max-w-none"
  },
  {
    id: "editorial",
    name: "Editorial / Resume",
    description: "Playfair Display headings with sleek margins.",
    fontFamily: "'Inter', sans-serif",
    headingFont: "'Playfair Display', serif",
    bgClass: "bg-white",
    textClass: "text-zinc-800",
    containerClass: "theme-editorial max-w-none"
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    description: "Compact grayscale layout for reports.",
    fontFamily: "'Inter', sans-serif",
    headingFont: "'Inter', sans-serif",
    bgClass: "bg-white",
    textClass: "text-neutral-800",
    containerClass: "theme-minimal max-w-none"
  }
];

export interface PageSetup {
  pageSize: "A4" | "Letter" | "Legal";
  marginSize: "none" | "thin" | "normal" | "thick";
}

export const PAGE_SIZES = {
  A4: { width: "210mm", height: "297mm" },
  Letter: { width: "8.5in", height: "11in" },
  Legal: { width: "8.5in", height: "14in" }
};

export const MARGIN_SIZES = {
  none: "0mm",
  thin: "10mm",
  normal: "20mm",
  thick: "30mm"
};
