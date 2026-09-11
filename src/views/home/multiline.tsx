import { Fragment } from "react";

export interface MultilineProps {
  /** Text where `\n` renders as a `<br />`. */
  text: string;
}

/** Renders `\n`-separated copy with line breaks (server-safe). */
export const Multiline = ({ text }: MultilineProps) =>
  text.split("\n").map((line, i, lines) => (
    <Fragment key={i}>
      {line}
      {i < lines.length - 1 && <br />}
    </Fragment>
  ));
