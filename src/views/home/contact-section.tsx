/**
 * Contact section (index.html .contact-section) — the GET IN TOUCH glass
 * panel blur-reveals on scroll and scrambles its title; below it, phone /
 * email and social links.
 */

import { HoverEl } from "@/components/ui/hover-el";
import { ContactSectionContent } from "@/data/mocks/home";

import { BlurReveal } from "./blur-reveal";
import { ScrambleHeading } from "./scramble-heading";

export interface ContactSectionProps {
  content: ContactSectionContent;
}

const FooterLink = ({ label, href }: { label: string; href: string }) => (
  <HoverEl
    tag="a"
    href={href}
    className="text-contact-link font-normal tracking-[-0.05rem] text-foreground underline decoration-2 underline-offset-[0.375rem]"
    from={{ opacity: 1 }}
    to={{ opacity: 0.7 }}
  >
    {label}
  </HoverEl>
);

export const ContactSection = ({ content }: ContactSectionProps) => (
  <section
    id="contact"
    aria-labelledby="cs-heading"
    className="relative flex w-full flex-col px-4 pb-40 pt-20 text-foreground md:px-10"
  >
    <div className="mb-10 flex flex-col md:mb-20">
      <BlurReveal
        variant="panel"
        className="mb-15 flex w-full items-center justify-center rounded-3xl bg-foreground px-10 pb-10 pt-20 text-background mix-blend-screen"
      >
        <ScrambleHeading
          id="cs-heading"
          className="text-contact font-display font-[250] uppercase"
          parts={[{ text: content.title }]}
        />
      </BlurReveal>
    </div>

    <footer className="flex flex-col flex-wrap items-start justify-between gap-10 md:flex-row">
      <address className="flex flex-col gap-5 not-italic">
        <FooterLink label={content.phone.label} href={content.phone.href} />
        <FooterLink label={content.email.label} href={content.email.href} />
      </address>
      <div className="flex flex-col gap-5 md:text-right">
        <p className="text-contact-link font-normal tracking-[-0.05rem]">
          {content.socialsLabel}
        </p>
        <ul className="flex flex-wrap gap-8 md:justify-end">
          {content.socials.map((social) => (
            <li key={social.label}>
              <FooterLink label={social.label} href={social.href} />
            </li>
          ))}
        </ul>
      </div>
    </footer>
  </section>
);
