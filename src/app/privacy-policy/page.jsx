
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-foreground">
              Privacy Policy
            </CardTitle>
            <p className="text-center text-muted-foreground mt-2">
              Last updated on July 7th, 2025
            </p>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <div className="space-y-6">
              <section>
                <p className="text-foreground leading-relaxed">
                  This privacy policy sets out how education uses and protects
                  any information that you give education when you visit their
                  website and/or agree to purchase from them.
                </p>
                <p className="text-foreground leading-relaxed">
                  education is committed to ensuring that your privacy is
                  protected. Should we ask you to provide certain information by
                  which you can be identified when using this website, and then
                  you can be assured that it will only be used in accordance
                  with this privacy statement.
                </p>
                <p className="text-foreground leading-relaxed">
                  education may change this policy from time to time by updating
                  this page. You should check this page from time to time to
                  ensure that you adhere to these changes.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Information We Collect
                </h2>
                <p className="text-foreground mb-3">
                  We may collect the following information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-foreground">
                  <li>Name</li>
                  <li>Contact information including email address</li>
                  <li>
                    Demographic information such as postcode, preferences and
                    interests, if required
                  </li>
                  <li>
                    Other information relevant to customer surveys and/or offers
                  </li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  How We Use Your Information
                </h2>
                <p className="text-foreground mb-3">
                  We require this information to understand your needs and
                  provide you with a better service, and in particular for the
                  following reasons:
                </p>
                <ul className="list-disc list-inside space-y-2 text-foreground">
                  <li>Internal record keeping</li>
                  <li>
                    We may use the information to improve our products and
                    services
                  </li>
                  <li>
                    We may periodically send promotional emails about new
                    products, special offers or other information which we think
                    you may find interesting using the email address which you
                    have provided
                  </li>
                  <li>
                    From time to time, we may also use your information to
                    contact you for market research purposes. We may contact you
                    by email, phone, fax or mail
                  </li>
                  <li>
                    We may use the information to customise the website
                    according to your interests
                  </li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Security
                </h2>
                <p className="text-foreground leading-relaxed">
                  We are committed to ensuring that your information is secure.
                  In order to prevent unauthorised access or disclosure we have
                  put in suitable measures.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  How We Use Cookies
                </h2>
                <p className="text-foreground leading-relaxed mb-4">
                  A cookie is a small file which asks permission to be placed on
                  your computer's hard drive. Once you agree, the file is added
                  and the cookie helps analyze web traffic or lets you know when
                  you visit a particular site. Cookies allow web applications to
                  respond to you as an individual. The web application can
                  tailor its operations to your needs, likes and dislikes by
                  gathering and remembering information about your preferences.
                </p>
                <p className="text-foreground leading-relaxed mb-4">
                  We use traffic log cookies to identify which pages are being
                  used. This helps us analyze data about webpage traffic and
                  improve our website in order to tailor it to customer needs.
                  We only use this information for statistical analysis purposes
                  and then the data is removed from the system.
                </p>
                <p className="text-foreground leading-relaxed">
                  Overall, cookies help us provide you with a better website, by
                  enabling us to monitor which pages you find useful and which
                  you do not. A cookie in no way gives us access to your
                  computer or any information about you, other than the data you
                  choose to share with us.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Controlling Your Personal Information
                </h2>
                <p className="text-foreground mb-3">
                  You may choose to restrict the collection or use of your
                  personal information in the following ways:
                </p>
                <ul className="list-disc list-inside space-y-2 text-foreground">
                  <li>
                    whenever you are asked to fill in a form on the website,
                    look for the box that you can click to indicate that you do
                    not want the information to be used by anybody for direct
                    marketing purposes
                  </li>
                  <li>
                    if you have previously agreed to us using your personal
                    information for direct marketing purposes, you may change
                    your mind at any time by writing to or emailing us
                  </li>
                </ul>
                <p className="text-foreground leading-relaxed mt-4">
                  We will not sell, distribute or lease your personal
                  information to third parties unless we have your permission or
                  are required by law to do so. We may use your personal
                  information to send you promotional information about third
                  parties which we think you may find interesting if you tell us
                  that you wish this to happen.
                </p>
                <p className="text-foreground leading-relaxed mt-4">
                  If you believe that any information we are holding on you is
                  incorrect or incomplete, please write to At Sitanaik tanda,
                  Post kolwadi Aurangabad MAHARASHTRA 431103 or contact us as
                  soon as possible. We will promptly correct any information
                  found to be incorrect.
                </p>
              </section>

              <Separator />

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Disclaimer:</strong> The above content is created at
                  RAJESH ZABU JADHAV's sole discretion. Razorpay shall not be
                  liable for any content provided here and shall not be
                  responsible for any claims and liability that may arise due to
                  merchant's non-adherence to it.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
