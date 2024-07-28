import { useDocumentTitle } from "../utils/use-document-title";

import { Container } from "../components/container";

const About = () => {
  useDocumentTitle("About | Blogify");
  return (
    <Container>
      <div className="mx-auto max-w-4xl">
        <div className="prose dark:prose-invert">
          <h1 className="font-playfair">About</h1>
          <p className="font-medium">Welcome to Blogify!</p>
          <p className="text-muted-foreground">
            I’m Redoy, a passionate{" "}
            <span className="text-foreground">Frontend</span> web developer. I
            am currently learning{" "}
            <span className="text-foreground">Backend</span> development. This
            blog is a space where I document my journey, share what I learn, and
            occasionally write about topics that inspire me.
          </p>
          <h1 className="font-playfair">Why I Started This Blog</h1>
          <p className="text-muted-foreground">
            As I'm learning <span className="text-foreground">Backend</span>{" "}
            development, I created this blog as a personal project to experiment
            with backend technologies and further enhance my{" "}
            <span className="text-foreground">Frontend</span> skills. Here I
            might occasionally write and share my insights about web development
            trends, technologies.
          </p>
          <h1 className="font-playfair">Join The Journey</h1>
          <p className="text-muted-foreground">
            I’d love for you to join me on this journey. Let’s learn, grow, and
            build something amazing together. If you have any type of inquiries
            or just want to say hi, my inbox is always open. So feel free to
            reach out and I will get back to you as soon as possible.
          </p>
          <p className="font-medium">
            Thank you for visiting, and happy reading!
          </p>
        </div>
      </div>
    </Container>
  );
};

export default About;
