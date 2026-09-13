import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Privacy Policy | Shikhor",
  description:
    "How Shikhor collects, uses, shares, and protects the personal information of students and parents who use the platform.",
};

/** Bump this whenever the policy text below changes. */
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

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-olympiad-500 hover:text-olympiad-800"
    >
      {children}
    </a>
  );
}

function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex list-disc flex-col gap-1.5 pl-5 marker:text-text-muted">
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
    id: "information-we-collect",
    title: "Information we collect",
    content: (
      <>
        <p>Most of the information we hold is information you give us yourself when you sign up and take part in contests.</p>
        <p>
          <Term>Details you provide.</Term> When you create an account or complete your profile, we collect your:
        </p>
        <Bullets
          items={[
            "Full name",
            "Email address",
            "Phone number (mobile)",
            "School or college name",
            "Class or grade",
          ]}
        />
        <p>
          <Term>Contest data.</Term> When you register for and take part in a contest, we collect your registration
          details, your submissions and answers, and your scores and results.
        </p>
        <p>
          <Term>Sign in with Google.</Term> If you choose &ldquo;Sign in with Google&rdquo;, Google shares your name,
          email address, and profile picture with us. We never receive your Google password or any other Google account
          data.
        </p>
        <p>
          <Term>Account security data.</Term> Your password is stored only as a salted, one-way hash &mdash; never in a
          form that we or anyone else could read. Our servers also keep basic technical logs (see{" "}
          <a href="#cookies" className="font-medium text-olympiad-500 hover:text-olympiad-800">
            Cookies and logs
          </a>
          ).
        </p>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How we use your information",
    content: (
      <>
        <p>We use your information only for the purposes below:</p>
        <Bullets
          items={[
            <>
              <Term>Run your account.</Term> To create your account, sign you in, and keep it working &mdash; this is the
              core service you asked us for.
            </>,
            <>
              <Term>Run contests.</Term> To register you for contests, conduct them, grade submissions, and publish
              results.
            </>,
            <>
              <Term>Contact you.</Term> To send account and contest messages by email or SMS &mdash; for example
              verification codes (OTP), contest reminders, result announcements, and important notices.
            </>,
            <>
              <Term>Keep contests fair.</Term> To verify identity and detect duplicate, fake, or misused accounts.
            </>,
            <>
              <Term>Keep Shikhor safe and working.</Term> To secure the platform, prevent abuse, diagnose problems, and
              improve how it works.
            </>,
            <>
              <Term>Meet legal obligations.</Term> To comply with the law if we are ever required to.
            </>,
          ]}
        />
        <p>
          We do <Term>not</Term> use your information for advertising, and we do <Term>not</Term> sell it to anyone.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "When we share your information",
    content: (
      <>
        <p>
          We do not sell your personal data and we do not share it with anyone for their own marketing. We share limited
          information only in these situations:
        </p>
        <p>
          <Term>Service providers who help us run Shikhor</Term> (they act on our instructions and cannot use your data
          for their own purposes):
        </p>
        <Bullets
          items={[
            <>
              <Term>Google</Term> &mdash; if you use &ldquo;Sign in with Google&rdquo;, your login is handled by Google.
              Google&rsquo;s handling of your information is governed by the{" "}
              <ExternalLink href="https://policies.google.com/privacy">Google Privacy Policy</ExternalLink>.
            </>,
            <>
              <Term>BulkSMSBD</Term> &mdash; our SMS delivery provider in Bangladesh. When we send you a text message
              (such as a verification code or a contest reminder), we pass your phone number and the message content to
              BulkSMSBD so they can deliver it.
            </>,
          ]}
        />
        <p>
          <Term>Legal reasons</Term> &mdash; if we are required to by law, a court order, or a valid request from a
          government authority in Bangladesh, or where we need to protect the rights, safety, or property of Shikhor, our
          users, or the public.
        </p>
        <p>
          <Term>Change of operators</Term> &mdash; if Shikhor is ever transferred to new operators, your information may
          be part of that transfer, but it would stay protected by a policy at least as protective as this one.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and logs",
    content: (
      <>
        <Bullets
          items={[
            <>
              We use a small number of cookies that are <Term>necessary for Shikhor to work</Term> &mdash; mainly a
              secure login cookie that keeps you signed in. It is <Term>httpOnly</Term> (JavaScript in your browser
              cannot read it) and is shared across <Term>shikhor.net</Term> and its subdomains (such as{" "}
              <Term>admin.shikhor.net</Term>) so you don&rsquo;t have to log in separately on each.
            </>,
            <>We do not use advertising cookies or third-party tracking cookies.</>,
            <>
              Our servers keep standard logs (such as IP address, browser type, and the time of a request) to keep the
              service secure and to fix problems. These are kept for a limited time.
            </>,
            <>
              Because the login cookie is essential, Shikhor may not work properly if you block cookies for our site.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep your information",
    content: (
      <Bullets
        items={[
          <>
            We keep your account information and contest history for as long as your account is active, so you can see
            your past contests and results.
          </>,
          <>
            If you ask us to delete your account, we delete or anonymise your personal information within a reasonable
            time &mdash; except where we need to keep certain records, such as results that have already been published
            or information we must keep to comply with the law or to resolve a dispute.
          </>,
          <>Backups are kept for a limited period and then overwritten.</>,
          <>SMS delivery records and server logs are kept only for a short period.</>,
        ]}
      />
    ),
  },
  {
    id: "your-rights",
    title: "Your rights and choices",
    content: (
      <>
        <p>You can ask us to:</p>
        <Bullets
          items={[
            <>
              <Term>Access</Term> &mdash; give you a copy of the personal information we hold about you.
            </>,
            <>
              <Term>Correct</Term> &mdash; fix information that is wrong. You can edit most of your profile yourself in
              your account settings.
            </>,
            <>
              <Term>Delete</Term> &mdash; delete your account and personal information (subject to the exceptions in{" "}
              <a href="#retention" className="font-medium text-olympiad-500 hover:text-olympiad-800">
                How long we keep your information
              </a>
              ).
            </>,
            <>
              <Term>Stop non-essential messages</Term> &mdash; opt out of reminders and announcements that aren&rsquo;t
              required for your account to function.
            </>,
          ]}
        />
        <p>
          To make any of these requests, email us at <MailLink /> from the email address on your account (a parent or
          guardian may contact us on your behalf). We may ask you to confirm your identity first, to protect your
          account, and we aim to respond within 30 days.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children's and students' privacy",
    content: (
      <>
        <p>
          Many Shikhor users are school and college students, and some are under 18. We take that seriously and follow
          the spirit of children&rsquo;s data-protection rules.
        </p>
        <Bullets
          items={[
            <>
              We collect only the information we genuinely need to register a student for a contest and to contact them
              about it.
            </>,
            <>We never show advertising to students, and we never sell or share their information for marketing.</>,
            <>
              We encourage parents and guardians to be aware of and involved in their child&rsquo;s use of Shikhor. If
              you are a parent or guardian and want to review, correct, or delete your child&rsquo;s information &mdash;
              or you have any concern about how it is handled &mdash; please contact us at <MailLink /> and we will help.
            </>,
            <>
              If you are a student, please ask a parent, guardian, or teacher before signing up, and use an email address
              and phone number that a trusted adult knows about.
            </>,
            <>
              If we learn that we have collected a child&rsquo;s information in a way their parent or guardian objects to,
              we will delete it promptly unless we are required to keep it.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: "security",
    title: "How we protect your information",
    content: (
      <>
        <Bullets
          items={[
            <>
              Your data is stored in a <Term>PostgreSQL database on a private server (VPS) that we control</Term> &mdash;
              not on third-party marketing platforms, and it is never sold.
            </>,
            <>All connections to Shikhor are encrypted with HTTPS/TLS.</>,
            <>Passwords are stored only as salted, one-way hashes.</>,
            <>Login sessions use secure, httpOnly cookies.</>,
            <>
              Access to the admin panel and the database is limited to a small number of authorised people and protected
              by authentication.
            </>,
            <>We keep our software updated and take reasonable steps to guard against unauthorised access.</>,
          ]}
        />
        <p>
          No online service can be completely secure, but we work to protect your information and to act quickly if
          something goes wrong. If a security breach ever affects your personal information, we will notify the users
          affected and take appropriate steps.
        </p>
      </>
    ),
  },
  {
    id: "account-verification",
    title: "Account Verification / অ্যাকাউন্ট ভেরিফিকেশন",
    content: (
      <p>
        Every account is verified in two layers: email OTP confirmation at signup, and a manual document review (ID
        card, salary slip, or result sheet) before the account is marked verified. / প্রতিটা অ্যাকাউন্ট দুই ধাপে
        ভেরিফাই করা হয়: সাইনআপের সময় ইমেইল OTP নিশ্চিতকরণ, এবং একটা ডকুমেন্ট (ID card, salary slip, বা result sheet)
        ম্যানুয়ালি রিভিউ করার পর অ্যাকাউন্ট ভেরিফায়েড হিসেবে চিহ্নিত হয়।
      </p>
    ),
  },
  {
    id: "device-signal",
    title: "Device Signal / ডিভাইস সিগন্যাল",
    content: (
      <p>
        A device signal is collected during account activity as part of our security measures. / সিকিউরিটি
        ব্যবস্থার অংশ হিসেবে অ্যাকাউন্ট কার্যকলাপের সময় একটা ডিভাইস সিগন্যাল সংগ্রহ করা হয়।
      </p>
    ),
  },
  {
    id: "third-party-links",
    title: "Links to other websites",
    content: (
      <p>
        Shikhor may link to other websites, such as contest partners or learning resources. We are not responsible for
        the privacy practices of those sites, so please read their own privacy policies before sharing information with
        them.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    content: (
      <p>
        We may update this Privacy Policy from time to time &mdash; for example, when we add features or change how we
        handle data. When we do, we will update the &ldquo;Last updated&rdquo; date at the top of this page, and for
        significant changes we will also give notice on the site or by email. If you keep using Shikhor after an update,
        that means you accept the revised policy.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    content: (
      <>
        <p>
          If you have any questions, concerns, or requests about this Privacy Policy or your personal information,
          contact us at:
        </p>
        <p>
          Email: <MailLink />
        </p>
        <p>We will do our best to help.</p>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-gradient-to-b from-olympiad-50 to-white">
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-olympiad-500/20 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-olympiad-500">
          Legal
        </span>

        <h1 className="mt-3 text-2xl font-bold text-olympiad-900 sm:text-3xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-text-muted">Last updated: {LAST_UPDATED}</p>

        <div className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-text-muted">
          <p>
            শিখর (Shikhor) is an online Olympiad and academic contest platform for school and college students in
            Bangladesh, run at <Term>shikhor.net</Term>. This Privacy Policy explains what personal information we
            collect, why we collect it, who we share it with, and the choices and rights you have. We have written it in
            plain language so that students and parents can understand it without needing a lawyer.
          </p>
          <p>
            This policy covers our main site (<Term>shikhor.net</Term>), our admin panel (
            <Term>admin.shikhor.net</Term>), and our backend API (<Term>api.shikhor.net</Term>).
          </p>
        </div>

        <Card className="mt-8 p-6 sm:p-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-olympiad-500">On this page</h2>
          <ol className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            {SECTIONS.map((section, i) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-text-muted transition-colors hover:text-olympiad-900 hover:underline"
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
              <div className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-text-muted">
                {section.content}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
