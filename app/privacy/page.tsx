import { PublicLayout } from '@/components/PublicLayout';

export const metadata = {
  title: 'Privacy Policy | DocChase',
  description: 'DocChase Privacy Policy - How we collect, use, and protect your data',
};

export default function PrivacyPolicyPage() {
  return (
    <PublicLayout>
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: February 12, 2026</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Welcome to DocChase ("we," "our," or "us"). We are committed to protecting your privacy and handling your data in an open and transparent manner. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our document collection service.
              </p>
              <p className="text-gray-700">
                By using DocChase, you confirm your acceptance of this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access or use our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Personal Information</h3>
              <p className="text-gray-700 mb-2">When you register for an account, we collect:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Email address</li>
                <li>Practice name</li>
                <li>Password (encrypted using bcrypt)</li>
                <li>Payment information (processed securely through Stripe)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Client Data</h3>
              <p className="text-gray-700 mb-2">When you add clients to campaigns, we collect:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Client names</li>
                <li>Phone numbers (for WhatsApp communication)</li>
                <li>Email addresses (optional)</li>
                <li>Document metadata (filenames, upload dates)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 Document Storage</h3>
              <p className="text-gray-700 mb-4">
                When clients upload documents:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Documents are temporarily stored on our secure servers</li>
                <li>Documents are uploaded to YOUR Google Drive (if connected)</li>
                <li>We retain metadata (filename, upload date, file size) for billing and service purposes</li>
                <li>Document content is not analyzed or accessed by our staff</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.4 Authentication Data</h3>
              <p className="text-gray-700">
                If you use Google OAuth to connect Google Drive, we receive authorization tokens to access your Drive on your behalf. We do not have access to your Google password.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Service Delivery</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Facilitate WhatsApp communication with your clients</li>
                <li>Process and organize client documents</li>
                <li>Upload documents to your Google Drive</li>
                <li>Manage your account and subscription</li>
                <li>Track usage against your plan limits</li>
                <li>Provide customer support</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Communication</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Send transactional emails (campaign updates, document receipts)</li>
                <li>Send important service updates and security notices</li>
                <li>Send notification alerts (if you've enabled email notifications)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Storage and Security</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Security Measures</h3>
              <p className="text-gray-700 mb-2">We implement industry-standard security measures:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>All data transmitted via HTTPS encryption</li>
                <li>Passwords hashed using bcrypt</li>
                <li>Database hosted on secure Railway infrastructure</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication tokens</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Payment Security</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Payment processing handled by Stripe (PCI DSS compliant)</li>
                <li>We never store your full credit card details</li>
                <li>Only Stripe customer IDs are retained</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.3 Document Security</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Documents uploaded via secure Twilio infrastructure</li>
                <li>Files stored temporarily on our servers before Google Drive upload</li>
                <li>Google Drive integration uses OAuth 2.0 for secure access</li>
                <li>No third-party access to your documents without explicit permission</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Retention</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Account Data</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Account information retained while your account is active</li>
                <li>You can request account deletion at any time via Settings</li>
                <li>Upon deletion, personal data removed within 30 days</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 Campaign and Message History</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Campaign data retained for the duration of your subscription</li>
                <li>Message history retained for audit and compliance purposes</li>
                <li>Data automatically deleted upon account deletion</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.3 Documents</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Documents stored in YOUR Google Drive (under your control)</li>
                <li>Temporary server copies deleted after Google Drive upload</li>
                <li>Document metadata retained for billing and service purposes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Sharing</h2>
              <p className="text-gray-700 mb-4">
                <strong>We do not sell, trade, or rent your personal information to third parties.</strong>
              </p>
              <p className="text-gray-700 mb-2">We share data with trusted service providers:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li><strong>Stripe:</strong> Payment processing</li>
                <li><strong>Twilio:</strong> WhatsApp messaging infrastructure</li>
                <li><strong>Google Drive:</strong> Document storage (under your control)</li>
                <li><strong>Anthropic (Claude AI):</strong> AI-powered message generation</li>
                <li><strong>Railway:</strong> Database and hosting infrastructure</li>
                <li><strong>Brevo:</strong> Transactional email delivery</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights (GDPR Compliance)</h2>
              <p className="text-gray-700 mb-2">You have the right to:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Access and download your personal data</li>
                <li>Update or correct your account information</li>
                <li>Request deletion of specific data (documents, clients, campaigns)</li>
                <li>Request complete account deletion</li>
                <li>Unsubscribe from email notifications at any time</li>
                <li>Lodge a complaint with a data protection authority</li>
              </ul>
              <p className="text-gray-700">
                All deletion requests can be performed directly in the Settings page under the "Danger Zone" section.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cookies and Tracking</h2>
              <p className="text-gray-700">
                We use essential cookies for authentication, security, and service functionality. We do not use tracking cookies or sell your data to advertisers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
              <p className="text-gray-700">
                DocChase is a business service not intended for users under 18 years of age. We do not knowingly collect personal information from children.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. International Data Transfers</h2>
              <p className="text-gray-700">
                Your data may be transferred to and processed in countries outside of your residence. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to This Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
              <p className="text-gray-700 mb-2">
                If you have questions about this Privacy Policy or wish to exercise your data rights, please contact us:
              </p>
              <ul className="list-none mb-4 text-gray-700">
                <li><strong>Email:</strong> <a href="mailto:michael@gettingdocs.com" className="text-primary hover:text-primary">michael@gettingdocs.com</a></li>
                <li><strong>Support:</strong> <a href="/contact" className="text-primary hover:text-primary">Contact Form</a></li>
              </ul>
              <p className="text-gray-700 font-semibold">
                DocChase - Committed to protecting your privacy
              </p>
            </section>
          </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
