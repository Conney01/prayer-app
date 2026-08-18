import type { LucideProps } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Heart } from "lucide-react";

interface CategoryIconProps extends Omit<LucideProps, "name"> {
  name?: string | null;
}

export function CategoryIcon({ name, ...props }: CategoryIconProps) {
  if (!name) {
    return <Heart {...props} />;
  }

  const Component = (LucideIcons as Record<string, unknown>)[name] as
    | React.ComponentType<LucideProps>
    | undefined;

  if (Component) {
    return <Component {...props} />;
  }

  return <Heart {...props} />;
}