import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Atom, Code, Languages } from "lucide-react";

export const StatsAndTestimonials = () => {
  const subjects = [
    { name: "Mathematics", icon: Calculator },
    { name: "Physics", icon: Atom },
    { name: "Programming", icon: Code },
    { name: "IELTS", icon: Languages },
  ];

  const testimonials = [
    {
      name: "Rahim Ahmed",
      role: "HSC Student",
      text: "I found an amazing Physics tutor within a day. The application process was so smooth!",
    },
    {
      name: "Sara Khan",
      role: "University Student",
      text: "As a tutor, MentorLagbe helped me manage my batches effortlessly. The Pro plan is totally worth it.",
    },
    {
      name: "Tanvir Hossain",
      role: "Parent",
      text: "The verified tutor badges gave me peace of mind. Highly recommended platform for parents.",
    },
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* Top Subjects */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Explore Top Subjects</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {subjects.map((sub) => {
              const Icon = sub.icon;
              return (
                <div key={sub.name} className="flex flex-col items-center justify-center rounded-xl border bg-card p-6 transition-colors hover:border-primary cursor-pointer">
                  <Icon className="mb-3 h-8 w-8 text-primary" />
                  <span className="font-medium">{sub.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-20 grid grid-cols-2 gap-4 rounded-2xl bg-primary/5 p-8 text-center md:grid-cols-4 border border-primary/10">
          <div>
            <p className="text-4xl font-extrabold text-primary">500+</p>
            <p className="text-sm font-medium text-muted-foreground">Verified Tutors</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-primary">2000+</p>
            <p className="text-sm font-medium text-muted-foreground">Happy Students</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-primary">120+</p>
            <p className="text-sm font-medium text-muted-foreground">Subjects Covered</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-primary">98%</p>
            <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-8">What Our Users Say</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Card key={i} className="bg-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">{t.name}</CardTitle>
                  <Badge variant="secondary" className="w-fit">{t.role}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">{t.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};