import type { ReactElement } from "react";
import { Construction } from "lucide-react";

interface ComingSoonPlaceholderProps {
  title: string;
  description: string;
}

export function ComingSoonPlaceholder({
  title,
  description,
}: ComingSoonPlaceholderProps): ReactElement {
  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <div className="flex flex-col items-center text-center gap-4 rounded-xl border bg-card p-10 shadow-sm">
        <Construction
          className="h-12 w-12 text-muted-foreground"
          aria-hidden
        />
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
