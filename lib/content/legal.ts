import { site } from "@/lib/site";
import type { Block } from "./blocks";

export type LegalSection = { id: string; title: string; blocks: Block[] };

export type LegalDocument = {
  title: string;
  /** Used for the meta description and the page introduction. */
  description: string;
  path: "/privacy" | "/terms";
  /** ISO date (YYYY-MM-DD). */
  updated: string;
  intro: string;
  sections: LegalSection[];
};

const email = site.supportEmail;

export const terms: LegalDocument = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of KufCad desktop software, licenses and the kufcad.com website.",
  path: "/terms",
  updated: "2026-01-15",
  intro: `These Terms of Service ("Terms") govern your use of the ${site.name} desktop application, its updates and documentation (the "Software"), the license you obtain for it, and the ${site.name} website (together, the "Services"). Please read them carefully. They form a binding agreement between you and ${site.name}.`,
  sections: [
    {
      id: "acceptance",
      title: "Acceptance of terms",
      blocks: [
        {
          type: "p",
          text: "By downloading, installing or using the Software, or by accessing the website, you agree to these Terms. If you use the Services on behalf of an organisation, you confirm that you are authorised to accept these Terms for that organisation, and \"you\" refers to both you and the organisation.",
        },
        {
          type: "p",
          text: "If you do not agree to these Terms, do not install or use the Services.",
        },
      ],
    },
    {
      id: "accounts-and-licenses",
      title: "Accounts and licenses",
      blocks: [
        {
          type: "p",
          text: `Some features, including Professional licenses, require an account. You are responsible for keeping your credentials confidential and for all activity under your account. Notify us at ${email} if you suspect unauthorised use.`,
        },
        {
          type: "p",
          text: "Subject to these Terms and payment of any applicable fees, we grant you a limited, non-exclusive, non-transferable, revocable license to install and use the Software:",
        },
        {
          type: "ul",
          items: [
            "**Personal license**: free of charge, for non-commercial purposes only, such as personal projects, education and evaluation.",
            "**Professional license**: per seat, for the license term you purchased, including commercial use. Each seat may be used by one named person at a time and may be transferred between that person's devices.",
          ],
        },
        {
          type: "p",
          text: "Professional licenses renew at the end of each term unless cancelled before the renewal date. Fees are non-refundable except where required by law or stated otherwise at purchase.",
        },
      ],
    },
    {
      id: "permitted-use",
      title: "Permitted use",
      blocks: [
        {
          type: "p",
          text: "You agree to use the Services only as permitted by these Terms and applicable law. Unless the law expressly permits it, you will not:",
        },
        {
          type: "ul",
          items: [
            "copy, modify, or create derivative works of the Software, except as needed to use it in accordance with its documentation;",
            "reverse engineer, decompile or disassemble the Software, or attempt to derive its source code;",
            "remove, bypass or interfere with license checks, copy protection or security features;",
            "rent, lease, sell, sublicense or otherwise provide the Software to third parties;",
            "use a Personal license for commercial work;",
            "use the Services to infringe the rights of others or to violate export control or sanctions laws.",
          ],
        },
      ],
    },
    {
      id: "user-content",
      title: "User content",
      blocks: [
        {
          type: "p",
          text: "You own the drawings, models and other files you create with the Software (\"User Content\"). The Software stores your files on your device or in storage you choose. We do not claim any ownership of User Content and do not access it.",
        },
        {
          type: "p",
          text: "If you send us files, for example with a support request or a bug report, you grant us a limited license to store, reproduce and analyse them solely to provide support and improve the Software. We delete such files when they are no longer needed for that purpose, and you may ask us to delete them sooner.",
        },
      ],
    },
    {
      id: "intellectual-property",
      title: "Intellectual property",
      blocks: [
        {
          type: "p",
          text: `The Services, including the Software, documentation, designs, text, graphics and trademarks, are owned by ${site.name} or its licensors and are protected by intellectual property laws. These Terms do not grant you any rights to our trademarks or brand features. All rights not expressly granted are reserved.`,
        },
        {
          type: "p",
          text: "If you send us feedback or suggestions, we may use them without restriction or obligation to you.",
        },
      ],
    },
    {
      id: "third-party-components",
      title: "Third-party components",
      blocks: [
        {
          type: "p",
          text: "The Software includes components licensed by third parties, including open-source software. Those components are governed by their own license terms, which are listed in the Software under Help → About → Licenses. Where a third-party license grants you broader rights than these Terms, that license applies to the relevant component.",
        },
        {
          type: "p",
          text: "The Services may link to third-party websites or services. We are not responsible for their content or practices.",
        },
      ],
    },
    {
      id: "warranties-and-disclaimers",
      title: "Warranties and disclaimers",
      blocks: [
        {
          type: "p",
          text: "The Services are provided \"as is\" and \"as available\". To the fullest extent permitted by law, we disclaim all warranties, express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement.",
        },
        {
          type: "p",
          text: "The Software is a design tool. You remain responsible for verifying the accuracy, suitability and safety of any design, calculation, drawing or manufactured item produced with it, and for complying with the engineering standards and regulations that apply to your work.",
        },
      ],
    },
    {
      id: "limitation-of-liability",
      title: "Limitation of liability",
      blocks: [
        {
          type: "p",
          text: "To the maximum extent permitted by law, we will not be liable for any indirect, incidental, special, consequential or punitive damages, or for any loss of profits, revenue, data or goodwill, arising out of or related to these Terms or your use of the Services.",
        },
        {
          type: "p",
          text: "Our total liability for any claim relating to the Services is limited to the amount you paid us for the Services in the twelve months before the event giving rise to the claim, or USD 100 if you have not paid us anything. Some jurisdictions do not allow these limitations, so they may not apply to you.",
        },
      ],
    },
    {
      id: "termination",
      title: "Termination",
      blocks: [
        {
          type: "p",
          text: "You may stop using the Services at any time. We may suspend or terminate your license or access if you materially breach these Terms and do not cure the breach within 30 days of notice, or immediately where the breach cannot be cured or where required by law.",
        },
        {
          type: "p",
          text: "On termination, your right to use the Software ends and you must uninstall it. Your User Content remains yours. Sections that by their nature should survive termination — including intellectual property, disclaimers and limitation of liability — will survive.",
        },
      ],
    },
    {
      id: "changes",
      title: "Changes to these terms",
      blocks: [
        {
          type: "p",
          text: "We may update these Terms from time to time. We will post the updated Terms on this page and change the \"Last updated\" date. If a change materially affects your rights, we will notify you through the Software or by email at least 30 days before it takes effect. Continued use of the Services after the effective date constitutes acceptance of the revised Terms.",
        },
      ],
    },
    {
      id: "contact",
      title: "Contact",
      blocks: [
        {
          type: "p",
          text: `Questions about these Terms can be sent to [${email}](mailto:${email}) or through the [support page](/support#contact).`,
        },
      ],
    },
  ],
};

export const privacy: LegalDocument = {
  title: "Privacy Policy",
  description:
    "How KufCad collects, uses and protects information when you use the desktop application and the kufcad.com website.",
  path: "/privacy",
  updated: "2026-01-15",
  intro: `This Privacy Policy explains what information ${site.name} collects when you use the ${site.name} desktop application and website, how we use it, and the choices you have. The short version: your drawings and models stay on your device, and we collect only what we need to license, update and support the Software.`,
  sections: [
    {
      id: "information-we-collect",
      title: "Information we collect",
      blocks: [
        { type: "h3", text: "Information you provide", id: "information-you-provide" },
        {
          type: "ul",
          items: [
            "**Account details** such as your name, email address and organisation, when you create an account or buy a license.",
            "**Billing information**, processed by our payment provider. We receive the transaction record and the last four digits of the card, never the full card number.",
            "**Support communications**, including messages and any files you choose to attach.",
          ],
        },
        { type: "h3", text: "Information collected by the Software", id: "information-collected-by-the-software" },
        {
          type: "ul",
          items: [
            "**License activation data**: license key, a hashed device identifier, operating system and application version.",
            "**Update checks**: application version, platform and update channel.",
            "**Crash reports**, only if you enable them: stack traces, system configuration and the command that was running. Crash reports do not include your files.",
            "**Usage statistics**, only if you enable them: anonymous counts of which commands and features are used.",
          ],
        },
        { type: "h3", text: "Information collected by the website", id: "information-collected-by-the-website" },
        {
          type: "p",
          text: "Our servers record standard request data such as IP address, browser type and pages visited. We use strictly necessary cookies only and do not use advertising or cross-site tracking cookies.",
        },
        {
          type: "note",
          title: "Your files",
          text: "The Software does not upload your drawings, models or project files. They remain on your device or in storage you choose, unless you send them to us yourself.",
        },
      ],
    },
    {
      id: "how-we-use-information",
      title: "How we use information",
      blocks: [
        { type: "p", text: "We use the information we collect to:" },
        {
          type: "ul",
          items: [
            "activate and validate licenses and manage seats;",
            "deliver updates and security fixes;",
            "provide support and respond to requests;",
            "diagnose crashes and improve reliability and performance;",
            "process payments and meet tax and accounting obligations;",
            "send service messages, such as license renewal notices. We send product news only if you opt in.",
          ],
        },
        {
          type: "p",
          text: "We do not sell personal information and do not use it for advertising.",
        },
      ],
    },
    {
      id: "data-retention",
      title: "Data retention",
      blocks: [
        {
          type: "p",
          text: "We keep account and license information while your account is active and for up to 24 months afterwards, unless you ask us to delete it sooner. Billing records are kept as long as required by tax law. Crash reports and server logs are deleted after 90 days. Files sent with support requests are deleted once the request is resolved.",
        },
      ],
    },
    {
      id: "security",
      title: "Security",
      blocks: [
        {
          type: "p",
          text: "We protect information with encryption in transit and at rest, access controls limited to staff who need it, and regular review of our systems and suppliers. Installers and updates are code-signed so you can verify they come from us. No system is completely secure; if we become aware of a breach that affects your information, we will notify you as required by law.",
        },
      ],
    },
    {
      id: "your-choices",
      title: "Your choices and rights",
      blocks: [
        {
          type: "ul",
          items: [
            "Turn crash reports and usage statistics on or off at any time under **Preferences → Privacy** in the Software.",
            "Unsubscribe from product news using the link in any message.",
            "Request access to, correction of, or deletion of your personal information.",
            "Object to or restrict certain processing, and request a portable copy of your data, where applicable law gives you these rights.",
          ],
        },
        {
          type: "p",
          text: `To exercise these rights, contact us at [${email}](mailto:${email}). You may also lodge a complaint with your local data protection authority.`,
        },
      ],
    },
    {
      id: "international-transfers",
      title: "International transfers",
      blocks: [
        {
          type: "p",
          text: "We and our service providers may process information in countries other than your own. Where we transfer personal information internationally, we use appropriate safeguards, such as standard contractual clauses, to protect it.",
        },
      ],
    },
    {
      id: "childrens-privacy",
      title: "Children's privacy",
      blocks: [
        {
          type: "p",
          text: "The Services are not directed to children under 13, or the minimum age required in your country, and we do not knowingly collect their personal information. If you believe a child has provided us with information, contact us and we will delete it.",
        },
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      blocks: [
        {
          type: "p",
          text: "We may update this policy as the Services change. We will post the updated version on this page and change the \"Last updated\" date. If a change materially affects how we use your information, we will notify you in the Software or by email before it takes effect.",
        },
      ],
    },
    {
      id: "contact",
      title: "Contact",
      blocks: [
        {
          type: "p",
          text: `Questions about this policy or our data practices can be sent to [${email}](mailto:${email}) or through the [support page](/support#contact).`,
        },
      ],
    },
  ],
};
