export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl text-center">
      <h1 className="text-4xl font-bold tracking-tight mb-6">About TutorConnect</h1>
      <p className="text-xl text-muted-foreground mb-8">
        We believe that everyone deserves access to high-quality education, tailored to their individual learning style.
      </p>
      <div className="prose dark:prose-invert mx-auto">
        <p>
          TutorConnect was founded in 2026 with a simple mission: to connect passionate educators with eager learners around the globe. Our platform bridges the gap between those who want to teach and those who want to learn, providing a seamless, secure, and intuitive environment for educational growth.
        </p>
      </div>
    </div>
  );
}
