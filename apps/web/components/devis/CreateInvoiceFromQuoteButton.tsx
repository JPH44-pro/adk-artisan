"use client";

import { useTransition, type ReactElement } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createInvoiceFromQuote } from "@/app/actions/factures";
import { cn } from "@/lib/utils";

export type CreateInvoiceFromQuoteButtonProps = {
  quoteId: string;
  /** Si défini, le clic est désactivé et ce texte apparaît en infobulle. */
  disabledReason?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  className?: string;
  /** Libellé court (« Facturer ») pour une ligne de tableau */
  compact?: boolean;
};

export function CreateInvoiceFromQuoteButton({
  quoteId,
  disabledReason,
  variant = "secondary",
  size = "sm",
  className,
  compact = false,
}: CreateInvoiceFromQuoteButtonProps): ReactElement {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const disabled = pending || Boolean(disabledReason);

  function handleClick(): void {
    startTransition(async () => {
      const result = await createInvoiceFromQuote(quoteId);
      if ("error" in result) {
        if (result.existingInvoiceId) {
          const invId = result.existingInvoiceId;
          toast.error(result.error, {
            action: {
              label: "Ouvrir",
              onClick: () => {
                router.push(`/factures/${invId}`);
              },
            },
          });
        } else {
          toast.error(result.error);
        }
        return;
      }
      toast.success("Facture créée à partir du devis.");
      router.push(`/factures/${result.id}`);
      router.refresh();
    });
  }

  const button = (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn(compact && "shrink-0", className)}
      onClick={handleClick}
      disabled={disabled}
      aria-label={
        compact ? "Créer une facture à partir de ce devis" : undefined
      }
    >
      <FileText className="h-4 w-4 mr-1" />
      {compact ? "Facturer" : "Créer une facture"}
    </Button>
  );

  if (disabledReason) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex max-w-full">{button}</span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-pretty">
          {disabledReason}
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
}
