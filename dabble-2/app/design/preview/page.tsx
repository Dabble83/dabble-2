import {
  BrandReferenceHero,
  ButtonStateShowcase,
  CardVariantShowcase,
  CategoryIconPlaceholderRow,
  FormControlsShowcase,
  MapPinColorSamples,
  PaletteSwatchGrid,
  TagShowcase,
  TypeSpecimen,
  VoiceDoDont,
} from "@/app/components/ui";

export const metadata = {
  title: "Brand reference — Dabble 2.0",
};

export default function DesignPreviewPage() {
  return (
    <div className="py-16">
      <main className="ui-container flex flex-col gap-20">
        <BrandReferenceHero />
        <PaletteSwatchGrid />
        <TypeSpecimen />
        <ButtonStateShowcase />
        <CardVariantShowcase />
        <FormControlsShowcase />
        <TagShowcase />
        <CategoryIconPlaceholderRow />
        <MapPinColorSamples />
        <VoiceDoDont />
      </main>
    </div>
  );
}
