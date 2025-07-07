"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";

export default function ServicesPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <Card className="shadow-lg border-0 bg-background text-foreground">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Our Services</CardTitle>
          <CardDescription className="mt-2 text-base">
            Comprehensive solutions for Salesforce management and business automation.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-6 mt-4">
          <section>
            <h2 className="text-xl font-semibold mb-2">Salesforce Data Management</h2>
            <p className="text-muted-foreground">
              Effortlessly manage your Salesforce leads, contacts, accounts, opportunities, and cases with our intuitive tools. Perform CRUD operations, bulk actions, and real-time updates.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">AI Query Assistant</h2>
            <p className="text-muted-foreground">
              Generate and execute SOQL queries using natural language. Our AI assistant helps you retrieve and analyze Salesforce data without writing complex code.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Schema Visualization</h2>
            <p className="text-muted-foreground">
              Visualize Salesforce object relationships and metadata. Explore your CRM structure with interactive diagrams and detailed schema information.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Advanced Reporting</h2>
            <p className="text-muted-foreground">
              Build, filter, and export detailed reports from your Salesforce data. Gain insights with charts, tables, and custom dashboards.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Automation & Integration</h2>
            <p className="text-muted-foreground">
              Automate repetitive tasks and integrate with other business tools to streamline your workflows and boost productivity.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Support & Security</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="secondary">24/7 Support</Badge>
              <Badge variant="secondary">Data Security</Badge>
              <Badge variant="secondary">Regular Updates</Badge>
            </div>
            <p className="text-muted-foreground">
              Our team is dedicated to providing reliable support and ensuring your data is always secure.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}