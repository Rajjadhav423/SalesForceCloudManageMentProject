"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <Card className="shadow-lg border-0 bg-background text-foreground">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">About Us</CardTitle>
          <CardDescription className="mt-2 text-base">
            Empowering businesses with modern, AI-driven Salesforce management.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-6 mt-4">
          <section>
            <h2 className="text-xl font-semibold mb-2">Who We Are</h2>
            <p className="text-muted-foreground">
              <span className="font-semibold">Cloud Force CRM Manager</span> is a next-generation platform designed to simplify and enhance your Salesforce experience. Our mission is to provide intuitive, powerful, and secure tools for managing your CRM data, automating workflows, and gaining actionable insights.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Our Vision</h2>
            <p className="text-muted-foreground">
              We believe in making cloud CRM management accessible and efficient for organizations of all sizes. By leveraging the latest technologies in AI, automation, and UI/UX, we help teams focus on what matters most—building strong customer relationships.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">What We Offer</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Seamless Salesforce integration with real-time data sync</li>
              <li>AI-powered query assistant for effortless data retrieval</li>
              <li>Modern, responsive UI with dark and light theme support</li>
              <li>Advanced reporting, schema visualization, and automation tools</li>
              <li>Dedicated support and regular feature updates</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Our Values</h2>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Innovation</Badge>
              <Badge variant="secondary">Security</Badge>
              <Badge variant="secondary">User-Centric</Badge>
              <Badge variant="secondary">Transparency</Badge>
              <Badge variant="secondary">Reliability</Badge>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}