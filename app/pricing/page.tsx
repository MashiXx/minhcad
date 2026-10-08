import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { MotionReveal, RevealGroup, RevealItem } from "@/components/motion/MotionReveal";
import { RevealText } from "@/components/motion/RevealText";
import { ComparisonTable } from "@/components/pricing/ComparisonTable";
import { LicensingFAQ, type FaqItem } from "@/components/pricing/LicensingFAQ";
import { PlanCard, type LicenseTerm } from "@/components/pricing/PlanCard";
import { Container, Eyebrow, SectionHeader } from "@/components/ui/primitives";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { comparison, plans, site, type Plan } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Pricing and Licensing — Personal Free, Professional $99 per Seat",
  description: `${site.name} is free for personal, non-commercial use. The Professional license adds commercial rights, scripting and automation, advanced rendering and priority support for $99 per seat per year.`,
  path: "/pricing",
});

const licenseDetails: Record<Plan["id"], { licenseType: string; terms: LicenseTerm[] }> = {
  personal: {
    licenseType: "Individual",
    terms: [
      { label: "License", value: "Personal, non-commercial" },
      { label: "Seats", value: "1 user" },
      { label: "Term", value: "No expiry" },
      { label: "Activation", value: "Online" },
    ],
  },
  professional: {
    licenseType: "Commercial",
    terms: [
      { label: "License", value: "Commercial, per seat" },
      { label: "Seats", value: "Per named user, transferable" },
      { label: "Term", value: "12 months, renewable" },
      { label: "Activation", value: "Online or offline" },
    ],
  },
};

const faq: FaqItem[] = [
  {
    question: "Can I move a Professional seat to another computer or colleague?",
    answer:
      "Yes. A seat belongs to a named user, not a machine. Deactivate KufCad on the old computer from Help → License, then activate it on the new one. When someone leaves your team, the seat can be reassigned to another user.",
  },
  {
    question: "What counts as commercial use?",
    answer:
      "Any work you are paid for or that supports a business: client projects, manufacturing drawings, consulting, and internal work at a company. Personal covers learning, hobby projects and non-commercial open-source work. Commercial work requires a Professional seat.",
  },
  {
    question: "Is there a license for students and schools?",
    answer:
      "Students and teachers can use the Personal license for coursework at no cost. Classrooms and labs that need Professional features, such as the automation API, can contact us about academic licensing.",
  },
  {
    question: "Can I activate KufCad on an offline or air-gapped workstation?",
    answer:
      "Yes, with a Professional license. KufCad generates an activation request file; upload it from any connected device, then load the returned license file on the offline workstation. Personal activates online on first launch.",
  },
  {
    question: "Do I need to reinstall when upgrading from Personal?",
    answer:
      "No. Both licenses use the same installer. Enter a Professional license key and the additional features unlock; your drawings, settings and templates stay as they are.",
  },
];

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function PricingPage() {
  const [personalPlan, professionalPlan] = plans;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqStructuredData)} />

      <section
        aria-labelledby="pricing-title"
        className="relative overflow-hidden pt-[calc(var(--nav-height)+64px)] pb-20 sm:pb-24 lg:pt-[calc(var(--nav-height)+96px)]"
      >
        <div
          aria-hidden
          className="cad-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_70%_at_50%_0%,#000,transparent)]"
        />
        <Container className="relative">
          <header className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <MotionReveal preset="fadeIn">
              <Eyebrow>Pricing</Eyebrow>
            </MotionReveal>
            <RevealText
              as="h1"
              id="pricing-title"
              onMount
              delay={0.05}
              lines={["One application.", "Two licenses."]}
              className="mt-5 text-[2.5rem] leading-[1.02] font-semibold tracking-[-0.04em] text-fg sm:text-6xl lg:text-[4.25rem]"
            />
            <MotionReveal delay={0.2}>
              <p className="text-pretty mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                Personal is free for non-commercial work. Professional adds commercial rights, automation and priority
                support — licensed per seat, renewed once a year.
              </p>
            </MotionReveal>
          </header>

          <RevealGroup className="mx-auto mt-14 grid max-w-[980px] gap-5 md:grid-cols-2 lg:mt-20">
            {plans.map((plan) => (
              <RevealItem key={plan.id} className="h-full">
                <PlanCard
                  plan={plan}
                  licenseType={licenseDetails[plan.id].licenseType}
                  terms={licenseDetails[plan.id].terms}
                />
              </RevealItem>
            ))}
          </RevealGroup>

          <MotionReveal delay={0.1}>
            <p className="mx-auto mt-8 flex max-w-[980px] items-start gap-3 text-sm leading-relaxed text-muted sm:items-center sm:justify-center">
              <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-hover sm:mt-0" strokeWidth={1.8} />
              <span>
                Prices in USD, excluding applicable taxes. Need five or more seats?{" "}
                <Link href="/support#contact" className="text-accent-hover underline-offset-4 hover:underline">
                  Contact us for volume licensing
                </Link>
                .
              </span>
            </p>
          </MotionReveal>
        </Container>
      </section>

      <section aria-labelledby="compare-title" className="border-t border-line py-24 sm:py-28">
        <Container size="narrow">
          <MotionReveal>
            <SectionHeader
              id="compare-title"
              eyebrow="Comparison"
              title="Compare licenses."
              description="Both licenses run the same application. The differences are commercial rights, automation and support."
            />
          </MotionReveal>
          <MotionReveal delay={0.08} amount={0.05} className="mt-12">
            <ComparisonTable rows={comparison} plans={[personalPlan, professionalPlan]} />
          </MotionReveal>
        </Container>
      </section>

      <section aria-labelledby="faq-title" className="border-t border-line py-24 sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
            <MotionReveal>
              <SectionHeader
                id="faq-title"
                eyebrow="Licensing FAQ"
                title="Licensing questions."
                description="Seats, commercial use, education and offline activation."
              />
              <Link
                href="/support#contact"
                className="group mt-8 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-accent-hover"
              >
                Ask about your licensing setup
                <ArrowRight aria-hidden className="size-3.5 transition-transform duration-200 group-hover:translate-x-[3px]" />
              </Link>
            </MotionReveal>
            <MotionReveal delay={0.1} amount={0.1}>
              <LicensingFAQ items={faq} />
            </MotionReveal>
          </div>
        </Container>
      </section>
    </>
  );
}
