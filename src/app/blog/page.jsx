"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";

export default function BlogPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <Card className="shadow-lg border-0 bg-background text-foreground">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Blog</CardTitle>
          <CardDescription className="mt-2 text-base">
            Insights, updates, and best practices for Salesforce and cloud CRM management.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-8 mt-4">
          <section>
            <h2 className="text-xl font-semibold mb-2">Latest Articles</h2>
            <ul className="space-y-4">
              <li>
                <Badge variant="secondary" className="mr-2">AI</Badge>
                <span className="font-medium">How AI is Transforming Salesforce Data Management</span>
                <p className="text-muted-foreground text-sm">
                  Discover how artificial intelligence is making CRM data handling smarter and more efficient.
                </p>
              </li>
              <li>
                <Badge variant="secondary" className="mr-2">Tips</Badge>
                <span className="font-medium">5 Tips for Better Salesforce Reporting</span>
                <p className="text-muted-foreground text-sm">
                  Learn actionable tips to get the most out of your Salesforce reports and dashboards.
                </p>
              </li>
              <li>
                <Badge variant="secondary" className="mr-2">Product</Badge>
                <span className="font-medium">What’s New in Cloud Force CRM Manager</span>
                <p className="text-muted-foreground text-sm">
                  Explore the latest features and improvements in our platform.
                </p>
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Want to Contribute?</h2>
            <p className="text-muted-foreground">
              Have insights or tips to share? Contact us to submit your article or suggest a topic for our blog!
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}