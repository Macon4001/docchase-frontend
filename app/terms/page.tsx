import { PublicLayout } from '@/components/PublicLayout';

export const metadata = {
  title: 'Terms and Conditions | DocChase',
  description: 'DocChase Terms and Conditions - Legal agreement for using our service',
};

export default function TermsPage() {
  return (
    <PublicLayout>
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
          <p className="text-gray-600 mb-8">Last updated: February 12, 2026</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700">
                By using DocChase ("the Service") you confirm your acceptance of, and agree to be bound by, these terms and conditions ("Terms"). These Terms constitute a legally binding agreement between you ("User" or "you") and DocChase ("we," "us," or "our").
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Agreement to Terms</h2>
              <p className="text-gray-700">
                This Agreement takes effect on the date on which you first use the DocChase application or create an account. If you do not agree to these Terms, you must not use our Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                DocChase is an AI-powered document collection service that automates the process of collecting client documents via WhatsApp.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Free Trial</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>14-day free trial available</li>
                <li>Access to all features during trial</li>
                <li>No credit card required for trial</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Paid Plans</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li><strong>Starter Plan:</strong> £29/month - Up to 50 active clients</li>
                <li><strong>Pro Plan:</strong> £99/month - Up to 200 active clients, priority support</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Account Registration</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Requirements</h3>
              <p className="text-gray-700 mb-2">To use the Service, you must:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Be at least 18 years of age</li>
                <li>Be authorized to use the Service for business purposes</li>
                <li>Comply with these Terms and all applicable laws</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Account Security</h3>
              <p className="text-gray-700">
                You are responsible for maintaining the confidentiality of your password and API tokens, and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Subscription and Billing</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Subscription Plans</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Subscriptions are billed monthly in advance</li>
                <li>All prices are in British Pounds (£)</li>
                <li>Prices subject to change with 30 days' notice</li>
                <li>Billing handled securely through Stripe</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 Client Limits</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Client limits are based on active clients in your account</li>
                <li>Archived or deleted clients do not count toward your limit</li>
                <li>Exceeding limits may result in service restrictions</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.3 Failed Payments</h3>
              <p className="text-gray-700">
                If payment fails, your account status will change to "past_due" and service access will be restricted. Account may be downgraded or suspended after 7 days of non-payment.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Refunds and Cancellations</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 Cancellation Policy</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>You may cancel your subscription at any time via your account settings</li>
                <li>Cancellation takes effect at the end of the current billing period</li>
                <li>You retain access to paid features until period end</li>
                <li>No refunds for partial months</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2 Refund Policy</h3>
              <p className="text-gray-700 mb-2">Due to the nature of digital services:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>No refunds for partial months or unused time</li>
                <li>No refunds for unused client allowances</li>
                <li>Refunds may be considered for technical issues preventing service use</li>
                <li>Refunds at our discretion for billing errors</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Service License and Usage Rights</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">7.1 License Grant</h3>
              <p className="text-gray-700">
                We grant you a limited, non-exclusive, non-transferable, revocable license to use DocChase for your business purposes in accordance with these Terms.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">7.2 You May NOT:</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Reverse engineer, decompile, or disassemble the Service</li>
                <li>Copy, modify, or create derivative works</li>
                <li>Rent, lease, sell, or sublicense access to the Service</li>
                <li>Use the Service for illegal purposes or to violate any laws</li>
                <li>Attempt unauthorized access to our systems or networks</li>
                <li>Use the Service to send spam or unsolicited messages</li>
                <li>Impersonate others or misrepresent your affiliation</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">7.3 Termination Rights</h3>
              <p className="text-gray-700">
                We reserve the right to suspend or terminate your account for violations of these Terms, fraudulent activity, or any conduct we deem harmful to the Service or other users. We may also modify or discontinue the Service at any time with reasonable notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. User Content and Data</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">8.1 Your Data</h3>
              <p className="text-gray-700">
                You retain all rights to your client data, documents, and content uploaded through the Service. We claim no intellectual property rights over your content.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">8.2 Data Processing</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Client documents uploaded via WhatsApp are processed and stored temporarily</li>
                <li>Documents are uploaded to YOUR Google Drive (if connected)</li>
                <li>We retain metadata for billing and service purposes</li>
                <li>AI-generated messages use Anthropic Claude API</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">8.3 Data Deletion</h3>
              <p className="text-gray-700">
                You may delete your data at any time through the Settings page. Upon account deletion, all personal data is permanently removed within 30 days.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Third-Party Services</h2>
              <p className="text-gray-700 mb-2">DocChase integrates with third-party services:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li><strong>Twilio:</strong> WhatsApp messaging infrastructure</li>
                <li><strong>Google Drive:</strong> Document storage</li>
                <li><strong>Stripe:</strong> Payment processing</li>
                <li><strong>Anthropic Claude:</strong> AI message generation</li>
              </ul>
              <p className="text-gray-700">
                Your use of these services is subject to their respective terms and conditions. We are not responsible for third-party service interruptions or changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Warranties and Disclaimers</h2>
              <p className="text-gray-700 mb-4">
                <strong>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND.</strong> We do not warrant that:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>The Service will meet your specific requirements</li>
                <li>The Service will be uninterrupted, timely, or error-free</li>
                <li>Results will be 100% accurate</li>
                <li>All errors or defects will be corrected</li>
                <li>AI-generated messages will always be appropriate</li>
              </ul>
              <p className="text-gray-700">
                You are responsible for reviewing AI-generated messages before sending and verifying all collected documents.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID IN THE 12 MONTHS PRECEDING THE CLAIM.</strong>
              </p>
              <p className="text-gray-700 mb-2">WE SHALL NOT BE LIABLE FOR:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Indirect, incidental, or consequential damages</li>
                <li>Loss of profits, revenue, data, or business opportunities</li>
                <li>Business interruption or service downtime</li>
                <li>Third-party service failures (Twilio, Google, Stripe, etc.)</li>
                <li>Unauthorized access to your account due to password compromise</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Indemnification</h2>
              <p className="text-gray-700">
                You agree to indemnify and hold harmless DocChase from any claims, damages, losses, or expenses arising from your use of the Service, violation of these Terms, or infringement of any third-party rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Price Adjustments</h2>
              <p className="text-gray-700">
                As we continue to improve DocChase and expand our offerings, prices may increase. Existing subscribers will receive 30 days' notice before any price changes take effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Governing Law</h2>
              <p className="text-gray-700">
                These Terms are governed by the laws of England and Wales. You agree to submit to the exclusive jurisdiction of the courts located in England and Wales for resolution of any disputes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to modify these Terms at any time. We will provide notice of material changes via email or through the Service. Continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">16. Contact Information</h2>
              <p className="text-gray-700 mb-2">
                For questions about these Terms, please contact us:
              </p>
              <ul className="list-none mb-4 text-gray-700">
                <li><strong>Email:</strong> <a href="mailto:michael@gettingdocs.com" className="text-emerald-600 hover:text-emerald-700">michael@gettingdocs.com</a></li>
                <li><strong>Support:</strong> <a href="/contact" className="text-emerald-600 hover:text-emerald-700">Contact Form</a></li>
              </ul>
              <p className="text-gray-700 font-semibold">
                By using DocChase, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
              <p className="text-gray-700 font-semibold mt-4">
                DocChase - Simplifying Document Collection
              </p>
            </section>
          </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
