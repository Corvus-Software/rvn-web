"use client";

import { useState, useEffect, useRef } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarTrigger,
  SidebarProvider,
} from "@/registry/new-york-v4/ui/sidebar";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/new-york-v4/ui/accordion";
import { Card } from "@/registry/new-york-v4/ui/card";
import { Button } from "@/registry/new-york-v4/ui/button";
import { Input } from "@/registry/new-york-v4/ui/input";
import { Textarea } from "@/registry/new-york-v4/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york-v4/ui/dialog";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/registry/new-york-v4/ui/select";
import { supabase } from "@/lib/supabase";
import { UserAuth } from "@/context/AuthContext";

export default function HelpPage() {
  const { session, signOut } = UserAuth();
  if (!session) {
    return <p>Loading</p>;
  }

  const [ticket, setTicket] = useState({ subject: "", message: "" });
  const [category, setCategory] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [touched, setTouched] = useState({
    subject: false,
    message: false,
    category: false,
  });

  const [errors, setErrors] = useState<{
    subject?: string;
    message?: string;
    category?: string;
  }>({});

  const glowRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Validation
  useEffect(() => {
    const newErrors: typeof errors = {};
    if (!ticket.subject.trim()) newErrors.subject = "Subject is required";
    if (!ticket.message.trim()) newErrors.message = "Message is required";
    if (!category) newErrors.category = "Please select a category";
    setErrors(newErrors);
  }, [ticket, category]);

  const handleSubmit = async () => {
    const { error } = await supabase.from("support-tickets").insert({
      user_id: session.user.id,
      email: session.user.email,
      subject: ticket.subject,
      message: ticket.message,
      category: category,
      status: "open",
    });

    if (!error) {
      setSubmitted(true);
      setTicket({ subject: "", message: "" });
      setCategory("");
      setTouched({ subject: false, message: false, category: false });
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSubmitted(false);
      setTicket({ subject: "", message: "" });
      setCategory("");
      setErrors({});
      setTouched({ subject: false, message: false, category: false });
    }
  };

  const handleBlur = (field: "subject" | "message" | "category") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 73)",
          "--header-height": "calc(var(--spacing) * 11)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        {/* Hero Section with Glow */}
        <section
          ref={bannerRef}
          className="relative text-white text-center py-20 rounded-b-xl shadow-md overflow-hidden"
          style={{
            background: "linear-gradient(90deg, #4f46e5, #8b5cf6, #ec4899)",
          }}
        >
          {/* Glowing circle */}
          <div
            ref={glowRef}
            className="pointer-events-none absolute w-64 h-64 rounded-full bg-white opacity-0 transition-opacity duration-300 blur-3xl"
            style={{ zIndex: 1 }}
          />

          {/* Content */}
          <div className="relative z-10">
            <SidebarTrigger className="absolute top-6 left-6" />
            <h1 className="text-5xl font-bold">Support Center</h1>
            <p className="text-lg mt-3 opacity-80">
              Hi, how can we assist you today?
            </p>
          </div>
        </section>

        <main className="px-6 md:px-12 max-w-screen-xl mx-auto py-12 space-y-20">
          {/* FAQ Section */}
          <section>
            <h2 className="text-3xl font-semibold mb-6">
              Frequently Asked Questions
            </h2>
            <div className="flex flex-col gap-4">
              {[
                [
                  "How do I view lap feedback?",
                  "Go to the session overview, then click on a lap to view detailed feedback.",
                ],
                [
                  "Why isn’t the map loading?",
                  "Refresh the page or check your internet connection. If it persists, contact support.",
                ],
                [
                  "How do I use Live Race?",
                  "Go to a session, open the Live Race tab, and watch your lap replay.",
                ],
                [
                  "Can I export my session data?",
                  "No, please read our Terms of Service",
                ],
                [
                  "What devices are supported?",
                  "RVN has a web-app for desktops, Mobile app for Android and IOS",
                ],
                [
                  "How do I delete my account?",
                  "Go to settings > account > delete. Or contact support for help.",
                ],
                [
                  "Why is my data missing?",
                  "Check your internet connection or refresh the session.",
                ],
                [
                  "Is mobile supported?",
                  "This app is optimized for desktop. We have a seperate app for mobile",
                ],
              ].map(([question, answer], i) => (
                <Card
                  key={i}
                  className="border border-muted-foreground/10 shadow-sm"
                >
                  <Accordion type="single" collapsible>
                    <AccordionItem value={`faq-${i}`} className="w-lg">
                      <AccordionTrigger className="text-left px-4 py-3 text-base font-medium">
                        {question}
                      </AccordionTrigger>
                      <AccordionContent className="px-4 py-2 text-sm text-muted-foreground transition-all duration-300 ease-in-out overflow-hidden data-[state=open]:max-h-[500px] data-[state=closed]:max-h-0">
                        {answer}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>
              ))}
            </div>
          </section>

          {/* Ticket Submission */}
          <section className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Problem Not Solved?</h2>
            <p className="text-muted-foreground mb-6">
              Submit a ticket and our support team will respond shortly.
            </p>

            <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
              <DialogTrigger asChild>
                <Button className="text-base px-6 py-3">Create a Ticket</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Support Ticket</DialogTitle>
                </DialogHeader>
                {submitted ? (
                  <div className="text-green-600 font-medium py-6 text-center">
                    ✅ Ticket submitted successfully! We'll respond soon.
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }}
                    className="space-y-4 py-2"
                    noValidate
                  >
                    <div>
                      <label
                        htmlFor="subject"
                        className="block mb-1 font-medium"
                      >
                        Subject<span className="text-red-600">*</span>
                      </label>
                      <Input
                        id="subject"
                        placeholder="Subject"
                        value={ticket.subject}
                        onChange={(e) =>
                          setTicket((prev) => ({
                            ...prev,
                            subject: e.target.value,
                          }))
                        }
                        onBlur={() => handleBlur("subject")}
                        aria-invalid={!!errors.subject}
                        aria-describedby="subject-error"
                      />
                      {(touched.subject || submitted) && errors.subject && (
                        <p
                          id="subject-error"
                          className="text-xs text-red-600 mt-1"
                        >
                          {errors.subject}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="category"
                        className="block mb-1 font-medium"
                      >
                        Category<span className="text-red-600">*</span>
                      </label>
                      <Select
                        value={category}
                        onValueChange={setCategory}
                        name="category"
                        aria-invalid={!!errors.category}
                        aria-describedby="category-error"
                      >
                        <SelectTrigger
                          id="category"
                          className="w-full"
                          onBlur={() => handleBlur("category")}
                        >
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BugReport">Bug Report</SelectItem>
                          <SelectItem value="FeatureRequest">
                            Feature Request
                          </SelectItem>
                          <SelectItem value="Account">Account Issue</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {(touched.category || submitted) && errors.category && (
                        <p
                          id="category-error"
                          className="text-xs text-red-600 mt-1"
                        >
                          {errors.category}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block mb-1 font-medium"
                      >
                        Description<span className="text-red-600">*</span>
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Describe your issue..."
                        rows={5}
                        value={ticket.message}
                        onChange={(e) =>
                          setTicket((prev) => ({
                            ...prev,
                            message: e.target.value,
                          }))
                        }
                        onBlur={() => handleBlur("message")}
                        aria-invalid={!!errors.message}
                        aria-describedby="message-error"
                      />
                      {(touched.message || submitted) && errors.message && (
                        <p
                          id="message-error"
                          className="text-xs text-red-600 mt-1"
                        >
                          {errors.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={Object.keys(errors).length > 0}
                      className="w-full"
                    >
                      Submit Ticket
                    </Button>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
