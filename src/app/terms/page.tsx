import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Terms of Service | Shikhor",
  description:
    "The rules for using Shikhor — account responsibilities, acceptable use, contest rules, intellectual property, disclaimers, and governing law.",
};

/** Bump this whenever the terms text below changes. */
const LAST_UPDATED = "10 September 2026";
const CONTACT_EMAIL = "tasin9209@gmail.com";

function MailLink({ children }: { children?: ReactNode }) {
  return (
    <a
      href={`mailto:${CONTACT_EMAIL}`}
      className="font-medium text-olympiad-500 hover:text-olympiad-800"
    >
      {children ?? CONTACT_EMAIL}
    </a>
  );
}

function InternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="font-medium text-olympiad-500 hover:text-olympiad-800">
      {children}
    </a>
  );
}

function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex list-disc flex-col gap-1.5 pl-5 marker:text-olympiad-800/40">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function Term({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-olympiad-900">{children}</strong>;
}

const SECTIONS: Array<{ id: string; title: string; content: ReactNode }> = [
  {
    id: "acceptance",
    title: "Acceptance of these terms",
    content: (
      <>
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) are an agreement between you and Shikhor. They apply whenever you
          visit or use our website (<Term>shikhor.net</Term>), our admin panel (<Term>admin.shikhor.net</Term>), our
          backend API (<Term>api.shikhor.net</Term>), or take part in any contest we run (together, the
          &ldquo;Service&rdquo;).
        </p>
        <p>
          By creating an account or using the Service, you confirm that you have read and agree to these Terms and to our{" "}
          <InternalLink href="/privacy">Privacy Policy</InternalLink>. If you do not agree, please do not use the Service.
        </p>
        <p>
          If you are using Shikhor on behalf of a school, coaching centre, or other organisation, you confirm that you
          are allowed to accept these Terms for that organisation.
        </p>
      </>
    ),
  },
  {
    id: "eligibility-minors",
    title: "Who can use Shikhor",
    content: (
      <>
        <p>
          Shikhor is built for school and college students in Bangladesh. You may use the Service if you can form a
          binding agreement with us, or if a parent or legal guardian does so on your behalf.
        </p>
        <p>
          <Term>Use by minors.</Term> Many of our users are under 18. If you are a minor, you may use Shikhor only with
          the awareness and consent of a parent or legal guardian, and they are responsible for supervising your use of
          the Service and for your compliance with these Terms. We encourage parents and guardians to review these Terms
          and our <InternalLink href="/privacy">Privacy Policy</InternalLink> with their child.
        </p>
        <p>
          Specific contests may have their own eligibility conditions (such as class or grade limits). Those conditions
          apply in addition to this section &mdash; see <InternalLink href="#contests">Contest rules and eligibility</InternalLink>.
        </p>
      </>
    ),
  },
  {
    id: "accounts",
    title: "Your account and your responsibility",
    content: (
      <>
        <p>You can register with an email address and password, or by using &ldquo;Sign in with Google&rdquo;. When you have an account, you agree to:</p>
        <Bullets
          items={[
            <>
              <Term>Give accurate information.</Term> Provide true, current, and complete details (name, email, phone,
              school or college, class or grade) and keep them up to date. Contests, certificates, and rankings rely on
              this information being correct.
            </>,
            <>
              <Term>Keep your login secure.</Term> Keep your password and access to your Google account private, and do
              not let anyone else use your account. You are responsible for everything that happens under your account.
            </>,
            <>
              <Term>Tell us about problems.</Term> Contact us at <MailLink /> if you think someone has used your account
              without permission.
            </>,
            <>
              <Term>One account per person.</Term> Do not create more than one account for yourself (see{" "}
              <InternalLink href="#acceptable-use">Acceptable use</InternalLink>).
            </>,
          ]}
        />
        <p>
          You can ask us to close your account at any time by emailing <MailLink />. We may keep and use limited
          information after closure as described in our <InternalLink href="/privacy">Privacy Policy</InternalLink>.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    content: (
      <>
        <p>Shikhor is an academic platform, and fairness matters. When you use the Service, you agree that you will not:</p>
        <Bullets
          items={[
            <>
              <Term>Cheat in any contest</Term> &mdash; for example, getting or giving unauthorised help during a timed
              contest, using banned resources or tools, or sharing questions or answers while a contest is live.
            </>,
            <>
              <Term>Plagiarise</Term> &mdash; submit work, solutions, or writing that is not your own without proper
              credit.
            </>,
            <>
              <Term>Use multiple or fake accounts</Term>, impersonate someone else, or register on behalf of another
              person without their involvement.
            </>,
            <>
              <Term>Disrupt contests or the Service</Term> &mdash; attempt to break, overload, probe, or gain
              unauthorised access to our systems, interfere with other participants, or use bots, scrapers, or automated
              tools against the Service.
            </>,
            <>Upload or share content that is unlawful, abusive, hateful, harassing, or infringes someone else&rsquo;s rights.</>,
            <>Try to reverse-engineer, copy, or resell parts of the Service, or use it for a commercial purpose we have not approved.</>,
          ]}
        />
        <p>
          If you see cheating or misuse, please report it to <MailLink />. Breaking this section can lead to
          disqualification or account suspension &mdash; see{" "}
          <InternalLink href="#enforcement">Disqualification and suspension</InternalLink>.
        </p>
      </>
    ),
  },
  {
    id: "contests",
    title: "Contest rules and eligibility",
    content: (
      <>
        <Bullets
          items={[
            <>
              Each contest may publish its own rules, schedule, syllabus, eligibility criteria, and marking scheme. By
              registering for a contest you agree to those rules as well as these Terms. If there is a conflict, the
              specific contest rules apply to that contest.
            </>,
            <>
              You are responsible for meeting a contest&rsquo;s eligibility requirements. If we find that you did not
              meet them, your registration, results, ranking, certificate, or prize for that contest may be cancelled.
            </>,
            <>
              Any registration fees are described at the time of registration. Fees are non-refundable except where we
              state otherwise or where the law requires a refund.
            </>,
            <>
              We may reschedule, pause, or cancel a contest &mdash; for example, because of a technical problem or
              circumstances beyond our control. If we cancel a paid contest entirely, we will offer a fair remedy such as
              a rescheduled sitting or a refund.
            </>,
            <>
              <Term>Certificates, rankings, and prizes</Term> are awarded based on contest performance and our review.
              Prizes cannot be exchanged for cash unless we say so, and delivery of any prize may depend on you verifying
              your identity and eligibility.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    content: (
      <>
        <p>
          <Term>Our content.</Term> The Service and its content &mdash; including the Shikhor name and logo, the website
          design, text, graphics, and all contest questions, problem sets, and other materials we create &mdash; belong
          to Shikhor or our licensors and are protected by intellectual property laws. You may use them only to take part
          in the Service as intended. You may not copy, publish, distribute, or create derivative works from our content
          (including live or past contest questions) without our written permission.
        </p>
        <p>
          <Term>Your content.</Term> You keep ownership of the answers, solutions, and other material you submit
          (&ldquo;User Content&rdquo;). By submitting it, you give Shikhor a non-exclusive, worldwide, royalty-free
          licence to store, copy, display, and use it for the purpose of running and marking contests, verifying results,
          preventing cheating, operating and improving the Service, and showing results and rankings. If we want to
          feature your work publicly as an example (for instance, a model solution), we will not identify you beyond your
          name and result unless you agree.
        </p>
        <p>You are responsible for making sure your User Content is your own work and does not break these Terms or anyone else&rsquo;s rights.</p>
      </>
    ),
  },
  {
    id: "enforcement",
    title: "Disqualification and suspension",
    content: (
      <>
        <p>
          If we reasonably believe you have broken these Terms or a contest&rsquo;s rules &mdash; for example, by
          cheating, plagiarising, using multiple accounts, or disrupting a contest &mdash; we may take one or more of the
          following steps, depending on how serious the issue is:
        </p>
        <Bullets
          items={[
            "Issue a warning.",
            "Void your submission or disqualify you from a contest.",
            "Cancel a result, ranking, certificate, or prize.",
            "Suspend or permanently close your account.",
            "Decline to let you register for future contests.",
          ]}
        />
        <p>
          Where it is practical and appropriate, we will tell you the reason and give you a chance to respond. In cases
          of suspected cheating or fraud, or where a quick decision is needed to protect a contest, we may act first and
          review afterwards. Decisions about disqualification and contest integrity are made at our reasonable
          discretion, and our decision on these matters is final.
        </p>
      </>
    ),
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    content: (
      <>
        <Bullets
          items={[
            <>
              The Service is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. We do not guarantee
              that it will always be available, uninterrupted, error-free, or secure, or that problems will be fixed
              within a particular time.
            </>,
            <>
              We do not promise that using Shikhor will lead to any particular result, score, ranking, award, or academic
              or career outcome.
            </>,
            <>
              <Term>Contest results are final at our discretion.</Term> We review scores and rankings carefully, but once
              results are declared final they will not be changed except to correct a clear error identified by us.
            </>,
            <>
              You are responsible for your own internet connection, device, and exam environment during a contest. We are
              not responsible for issues caused by your equipment or connection.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    content: (
      <>
        <p>
          To the fullest extent allowed by law, Shikhor and the people who run it will not be liable for any indirect,
          incidental, or consequential loss, or for any loss of data, reputation, opportunity, or expected awards or
          prizes, arising from your use of (or inability to use) the Service.
        </p>
        <p>
          For any claim connected with the Service, our total liability to you is limited to the amount you paid us (if
          any) for the specific contest or service the claim relates to in the 12 months before the claim.
        </p>
        <p>Nothing in these Terms limits liability that cannot be limited under the law of Bangladesh.</p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    content: (
      <p>
        We may update these Terms from time to time &mdash; for example, when we add features or change how contests
        work. When we do, we will update the &ldquo;Last updated&rdquo; date at the top of this page, and for significant
        changes we will also give notice on the site or by email. If you keep using Shikhor after an update takes effect,
        that means you accept the revised Terms. If you do not agree, you should stop using the Service and may close
        your account.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "Governing law",
    content: (
      <p>
        These Terms are governed by the laws of the People&rsquo;s Republic of Bangladesh, without regard to conflict-of-law
        rules. Any dispute relating to these Terms or the Service will be subject to the courts of Bangladesh, and you
        agree to try to resolve the matter with us informally first by contacting <MailLink /> before starting any formal
        proceedings.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    content: (
      <>
        <p>If you have any questions about these Terms, contact us at:</p>
        <p>
          Email: <MailLink />
        </p>
        <p>We will do our best to help.</p>
      </>
    ),
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-gradient-to-b from-olympiad-50 to-white">
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-olympiad-500/20 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-olympiad-500">
          Legal
        </span>

        <h1 className="mt-3 text-2xl font-bold text-olympiad-900 sm:text-3xl">Terms of Service</h1>
        <p className="mt-2 text-sm text-olympiad-800/60">Last updated: {LAST_UPDATED}</p>

        <div className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-olympiad-800/80">
          <p>
            শিখর (Shikhor) is an online Olympiad and academic contest platform for school and college students in
            Bangladesh. These Terms explain the rules for using Shikhor &mdash; what we expect from you, what you can
            expect from us, and what happens if the rules are broken. We have written them in plain language so students
            and parents can follow them.
          </p>
          <p>
            Please also read our <InternalLink href="/privacy">Privacy Policy</InternalLink>, which explains how we
            handle your personal information.
          </p>
        </div>

        <Card className="mt-8 p-6 sm:p-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-olympiad-500">On this page</h2>
          <ol className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            {SECTIONS.map((section, i) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-olympiad-800/80 transition-colors hover:text-olympiad-900 hover:underline"
                >
                  {i + 1}. {section.title}
                </a>
              </li>
            ))}
          </ol>
        </Card>

        <div className="mt-8 flex flex-col gap-5">
          {SECTIONS.map((section, i) => (
            <Card key={section.id} id={section.id} className="scroll-mt-20 p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-olympiad-900">
                {i + 1}. {section.title}
              </h2>
              <div className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-olympiad-800/80">
                {section.content}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
