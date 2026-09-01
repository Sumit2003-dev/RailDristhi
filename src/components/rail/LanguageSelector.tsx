import { Globe, Check, Languages } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, SUPPORTED_LANGUAGES, Language, LanguageInfo } from "@/lib/i18n";

interface LanguageSelectorProps {
  variant?: "header" | "mobile" | "compact";
  className?: string;
}

export function LanguageSelector({ variant = "header", className = "" }: LanguageSelectorProps) {
  const { language, setLanguage, currentLanguageInfo, t } = useLanguage();

  const handleSelectLanguage = (lang: LanguageInfo) => {
    if (lang.code === language) return;
    setLanguage(lang.code);
    toast.success(t("common.languageChanged", { lang: `${lang.name} (${lang.nativeName})` }), {
      duration: 2500,
    });
  };

  if (variant === "mobile") {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center gap-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Languages className="size-3.5 text-primary" />
          <span>{t("nav.selectLanguage")}</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 p-1">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isActive = lang.code === language;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelectLanguage(lang)}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "bg-secondary/60 text-foreground hover:bg-secondary"
                }`}
              >
                <div>
                  <span className="block font-medium">{lang.nativeName}</span>
                  <span
                    className={`block text-[10px] ${
                      isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                    }`}
                  >
                    {lang.name}
                  </span>
                </div>
                {isActive && <Check className="size-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-9 gap-2 rounded-full border-border/70 bg-card/60 px-3 text-xs font-semibold transition-all hover:bg-secondary hover:border-primary/40 ${className}`}
          aria-label={t("nav.selectLanguage")}
        >
          <Globe className="size-3.5 text-primary" />
          <span className="hidden sm:inline-block">{currentLanguageInfo.nativeName}</span>
          <span className="inline-block sm:hidden">{currentLanguageInfo.badge}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 rounded-2xl p-1.5 shadow-float border-border bg-card/95 backdrop-blur-md animate-in fade-in-80 zoom-in-95 duration-150"
      >
        <DropdownMenuLabel className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Languages className="size-3.5 text-primary" />
            {t("nav.languages")}
          </span>
          <span className="text-[10px] rounded-full bg-secondary px-2 py-0.5 font-mono text-muted-foreground">
            {SUPPORTED_LANGUAGES.length}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/60" />
        <div className="max-h-[320px] overflow-y-auto space-y-0.5 p-0.5">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isActive = lang.code === language;
            return (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => handleSelectLanguage(lang)}
                className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "hover:bg-secondary text-foreground"
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{lang.nativeName}</span>
                  <span
                    className={`text-[11px] ${
                      isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                    }`}
                  >
                    {lang.name}
                  </span>
                </div>
                {isActive && <Check className="size-4 shrink-0" />}
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
