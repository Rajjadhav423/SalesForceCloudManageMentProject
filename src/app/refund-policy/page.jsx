import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";

export default function CancellationRefund() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-foreground">
              Cancellation & Refund Policy
            </CardTitle>
            <p className="text-center text-muted-foreground mt-2">
              Last updated on July 7th, 2025
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <section>
                <p className="text-foreground leading-relaxed">
                  education believes in helping its customers as far as
                  possible, and has therefore a liberal cancellation policy.
                  Under this policy:
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                  <Clock className="h-6 w-6 text-primary mr-2" />
                  Cancellation Policy
                </h2>
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <p className="text-foreground leading-relaxed">
                      Cancellations will be considered only if the request is
                      made within <strong>1-2 days</strong> of placing the
                      order. However, the cancellation request may not be
                      entertained if the orders have been communicated to the
                      vendors/merchants and they have initiated the process of
                      shipping them.
                    </p>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <p className="text-foreground leading-relaxed">
                      education does not accept cancellation requests for
                      perishable items like flowers, eatables etc. However,
                      refund/replacement can be made if the customer establishes
                      that the quality of product delivered is not good.
                    </p>
                  </div>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                  <AlertCircle className="h-6 w-6 text-orange-500 mr-2" />
                  Damaged or Defective Items
                </h2>
                <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <p className="text-foreground leading-relaxed">
                    In case of receipt of damaged or defective items please
                    report the same to our Customer Service team. The request
                    will, however, be entertained once the merchant has checked
                    and determined the same at his own end. This should be
                    reported within <strong>1-2 days</strong> of receipt of the
                    products.
                  </p>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Product Expectations
                </h2>
                <p className="text-foreground leading-relaxed">
                  In case you feel that the product received is not as shown on
                  the site or as per your expectations, you must bring it to the
                  notice of our customer service within{" "}
                  <strong>1-2 days</strong> of receiving the product. The
                  Customer Service Team after looking into your complaint will
                  take an appropriate decision.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Warranty Claims
                </h2>
                <p className="text-foreground leading-relaxed">
                  In case of complaints regarding products that come with a
                  warranty from manufacturers, please refer the issue to them.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                  Refund Processing
                </h2>
                <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-foreground leading-relaxed">
                    In case of any Refunds approved by the education, it'll take{" "}
                    <strong>1-2 days</strong> for the refund to be processed to
                    the end customer.
                  </p>
                </div>
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
