/**
 * Renders trusted, build-time-generated curriculum markup.
 *
 * The HTML here comes from the content layer, which is produced by
 * scripts/migrate.mjs from files in this repository — it is authored content,
 * never user input and never fetched from a third party.
 */
export function Html({
  html,
  className,
  as: Tag = "div",
}: {
  html: string;
  className?: string;
  as?: "div" | "span" | "p" | "dd" | "li" | "td" | "th";
}) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
