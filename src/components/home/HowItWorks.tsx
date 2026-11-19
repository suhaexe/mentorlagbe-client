import { Search, FileText, GraduationCap } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      title: "Search & Filter",
      description: "Browse through verified tuition batches by subject, class level, and budget.",
      icon: Search,
    },
    {
      title: "Apply for Tuition",
      description: "Submit your application with your preferred schedule and a short note to the tutor.",
      icon: FileText,
    },
    {
      title: "Start Learning",
      description: "Once the tutor accepts your application, start your personalized learning journey.",
      icon: GraduationCap,
    },
  ];

  return (
    <section className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold md:text-4xl">How MentorLagbe Works</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Finding the right tutor or student has never been easier. Follow these three simple steps.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative rounded-xl border bg-background p-6 text-center shadow-sm transition-transform hover:-translate-y-1">
                <div className="absolute -top-5 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  {index + 1}
                </div>
                <div className="mx-auto mt-6 mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};