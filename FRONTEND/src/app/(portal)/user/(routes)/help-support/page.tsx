"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Mail, MessageSquare, Phone, Search } from "lucide-react";

import { PageHeader } from "@/components/layouts/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FaqItem = {
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    question: "How do I book an appointment?",
    answer:
      "Go to Appointments, click Book Appointment, choose a date and time, then submit. We will confirm via email or SMS.",
  },
  {
    question: "Which IDs are accepted during pickup?",
    answer:
      "Any valid government-issued ID (e.g., PhilID, Driver's License, Passport, UMID, Postal ID, PRC ID).",
  },
  {
    question: "How long do document requests take?",
    answer:
      "Most requests are reviewed within 1–2 business days. Complex requests may take up to 5 business days.",
  },
  {
    question: "Where do I see my request status?",
    answer:
      "Open My Requests from the sidebar to view statuses, pickup details, and download approved PDFs.",
  },
  {
    question: "Can I reschedule my appointment?",
    answer:
      "Yes. Open Appointments, select your booking, and submit a reschedule note. We will confirm the new slot.",
  },
  {
    question: "What should I bring on appointment day?",
    answer:
      "Bring a valid ID and any supporting documents listed in your appointment notes or confirmation email.",
  },
  {
    question: "How do I update my contact details?",
    answer:
      "Go to Profile and update your mobile number and email so we can reach you for approvals or clarifications.",
  },
  {
    question: "Is there a fee for barangay clearance?",
    answer:
      "Fees depend on the service. The cashier will advise the amount when your request is approved for payment.",
  },
  {
    question: "Can someone else claim my document?",
    answer:
      "Yes, with an authorization letter, photocopy of your ID, and the representative's valid ID.",
  },
];

type ContactForm = {
  name: string;
  email: string;
  message: string;
};

const defaultForm: ContactForm = { name: "", email: "", message: "" };

export default function Page() {
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<ContactForm>(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredFaqs = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return faqItems;
    return faqItems.filter(
      (faq) =>
        faq.question.toLowerCase().includes(term) ||
        faq.answer.toLowerCase().includes(term)
    );
  }, [search]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      // TODO: Wire this to a backend endpoint or Supabase table for real submissions.
      await new Promise((resolve) => setTimeout(resolve, 800));
      setFeedback(
        "Thank you for reaching out. We received your message and will reply soon."
      );
      setForm(defaultForm);
    } catch (err) {
      setFeedback("Something went wrong. Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Help & Support"
        description="Find answers fast or contact the barangay team."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader className="gap-3">
            <CardTitle>FAQs</CardTitle>
            <CardDescription>
              Answers to the most common questions from residents.
            </CardDescription>
            <div className="flex items-center gap-3 rounded-md border bg-background/60 px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by keyword (e.g. appointment, ID, fees)"
                className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No results for “{search}”. Try another keyword.
              </p>
            ) : (
              <div className="space-y-3">
                {filteredFaqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="group rounded-lg border bg-background/60 p-4 transition hover:border-primary/60"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-foreground">
                      <span>{faq.question}</span>
                      <span className="text-sm text-muted-foreground">
                        {/** keeps layout tidy */}
                      </span>
                    </summary>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact options</CardTitle>
              <CardDescription>
                Pick the channel that works best for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg border bg-background/60 p-4">
                <div className="rounded-md bg-primary/10 p-2 text-primary">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Call hotline</p>
                  <p className="text-sm text-muted-foreground">
                    Monday–Friday, 8:00 AM – 5:00 PM
                  </p>
                  <Button variant="link" asChild className="p-0 text-primary">
                    <a href="tel:+631234567890">+63 123 456 7890</a>
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border bg-background/60 p-4">
                <div className="rounded-md bg-primary/10 p-2 text-primary">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Email support</p>
                  <p className="text-sm text-muted-foreground">
                    We reply within one business day.
                  </p>
                  <Button variant="link" asChild className="p-0 text-primary">
                    <a href="mailto:support@barangay.gov.ph">
                      support@barangay.gov.ph
                    </a>
                  </Button>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <div className="flex cursor-pointer items-start gap-3 rounded-lg border bg-background/60 p-4 transition hover:border-primary hover:shadow-sm">
                    <div className="rounded-md bg-primary/10 p-2 text-primary">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">Message the barangay</p>
                      <p className="text-sm text-muted-foreground">
                        Send a quick message and we will get back to you.
                      </p>
                      <Button variant="outline" size="sm">
                        Open message form
                      </Button>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Message the barangay</DialogTitle>
                    <DialogDescription>
                      Share your concern and contact details. We will reach out
                      with an update.
                    </DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full name</Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        required
                        placeholder="Juan Dela Cruz"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        required
                        placeholder="you@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        rows={4}
                        value={form.message}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            message: e.target.value,
                          }))
                        }
                        required
                        placeholder="How can we help?"
                      />
                    </div>
                    {feedback && (
                      <p className="text-sm text-muted-foreground">
                        {feedback}
                      </p>
                    )}
                    <DialogFooter className="gap-2 sm:gap-3">
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send message"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
