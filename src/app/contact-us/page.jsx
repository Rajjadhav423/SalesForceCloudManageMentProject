import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Separator } from "../../components/ui/separator"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-foreground">
              Contact Us
            </CardTitle>
            <p className="text-center text-muted-foreground mt-2">
              Last updated on July 7th, 2025
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-foreground leading-relaxed text-center">
                You may contact us using the information below:
              </p>

              <Separator />

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Registered Address</h3>
                      <p className="text-muted-foreground">
                        At Sitanaik tanda, Post kolwadi<br />
                        Aurangabad MAHARASHTRA 431103
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Telephone</h3>
                      <p className="text-muted-foreground">
                        <a href="tel:9322850587" className="hover:text-primary transition-colors">
                          9322850587
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Email</h3>
                      <p className="text-muted-foreground">
                        <a href="mailto:jadhavrz423@gmail.com" className="hover:text-primary transition-colors">
                          jadhavrz423@gmail.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-6 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-3">Business Information</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong className="text-foreground">Merchant Legal Entity:</strong> education</p>
                    <p><strong className="text-foreground">Registration:</strong> Maharashtra, India</p>
                    <p><strong className="text-foreground">Business Type:</strong> Educational Services</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Disclaimer:</strong> The above content is created at RAJESH ZABU JADHAV's sole discretion. Razorpay shall not be liable for any content provided here and shall not be responsible for any claims and liability that may arise due to merchant's non-adherence to it.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
