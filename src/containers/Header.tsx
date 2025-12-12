import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";


export const Header = () => {
  return (
    <header className="container px-3 flex items-center justify-between py-3 md:p-6 gap-2">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-primary tracking-tight">LegTrans</h1>
        <p className="text-xs text-muted-foreground font-medium">La précision qui fait loi</p>
      </div>
      <ThemeToggle />
    </header>
  );
};
