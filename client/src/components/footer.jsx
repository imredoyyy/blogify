import React from "react";
import { footerLinks, socialLinks } from "../data/data";
import { Container } from "./container";
import { Separator } from "./ui/separator";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { Copyright } from "lucide-react";

export const Footer = () => {
  return (
    <>
      <Separator />
      <Container className={cn("bg-primary-foreground")}>
        <div className="lg:space-y-10">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {socialLinks.map((link, i) => (
              <Button
                key={i}
                aria-label={`Follow on ${link.label}`}
                onClick={() => window.open(link.href, "_blank")}
                size="icon"
                variant="secondary"
                className={cn(
                  "border border-muted-foreground/30 [&>svg]:size-5",
                )}
              >
                {React.createElement(link.icon)}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {footerLinks.map((link, i) => (
              <Link
                key={i}
                to={link.href}
                className="transition-colors hover:text-muted-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <Separator />
          <div className="flex flex-col items-center justify-center gap-4 pt-10">
            <p className="flex items-center text-center text-sm font-normal">
              <Copyright className="mr-1 size-4" /> {new Date().getFullYear()}{" "}
              &nbsp;
              <Link
                to="/"
                className="transition-colors hover:text-muted-foreground"
              >
                Blogify
              </Link>
            </p>
            <p className="flex items-center text-center text-sm font-normal text-muted-foreground">
              Designed and developed with ❤️ by &nbsp;
              <Link
                target="_blank"
                to="https://github.com/imredoyyy"
                className="text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
              >
                Coder Redoy
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </>
  );
};
