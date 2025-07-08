"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";

export default function ShippingAndDelivery() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-foreground">
              Shipping & Delivery Policy
            </CardTitle>
            <p className="text-center text-muted-foreground mt-2">
              Last updated on July 8th, 2025
            </p>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <div className="space-y-6">
              <section>
                <p className="text-foreground leading-relaxed">
                  For International buyers, orders are shipped and delivered through registered international courier companies and/or International speed post only. For domestic buyers, orders are shipped through registered domestic courier companies and/or speed post only.
                </p>
                <p className="text-foreground leading-relaxed">
                  Orders are shipped within 3-5 days or as per the delivery date agreed at the time of order confirmation, and delivery of the shipment is subject to courier company/post office norms. We are not liable for any delay in delivery by the courier company/postal authorities and only guarantee to hand over the consignment to them within 3-5 days from the date of the order and payment, or as per the delivery date agreed at the time of order confirmation.
                </p>
                <p className="text-foreground leading-relaxed">
                  Delivery of all orders will be made to the address provided by the buyer. Delivery of our services will be confirmed via the email ID specified during registration.
                </p>
                <p className="text-foreground leading-relaxed">
                  For any issues in utilizing our services, you may contact our helpdesk on <strong>9322850587</strong> or <strong>jadhavrz423@gmail.com</strong>.
                </p>
              </section>

              <Separator />

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Disclaimer:</strong> The above content is created at RAJESH ZABU JADHAV's sole discretion. Razorpay shall not be liable for any content provided here and shall not be responsible for any claims and liability that may arise due to merchant’s non-adherence to it.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
