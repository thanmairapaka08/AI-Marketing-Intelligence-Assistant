import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/recommendations")({
  head: () => ({
    meta: [
      { title: "AI Recommendations — AI Marketing Intelligence Assistant" },
      { name: "description", content: "Prioritised improvements from your audits." },
      { property: "og:title", content: "AI Recommendations — AI Marketing Intelligence Assistant" },
      { property: "og:description", content: "Prioritised improvements from your audits." },
    ],
  }),
  component: () => <RecommendationsPage />,
});

function RecommendationsPage() {
  const isPending = false;

  // Demo recommendations from completed audit
  const recommendations = [
    {
      id: 1,
      title: "Shorten Homepage Meta Description",
      description: "Your meta description is 165 characters long. Search engines cut off snippets after ~160 characters.",
      priority: "medium",
      expected_impact: "Prevents truncation in search engine result pages",
      estimated_effort: "Low (5 mins)",
      category: "Meta & Content",
      metric: "title_meta",
    },
    {
      id: 2,
      title: "Add Alt Attribute to Hero Header Graphic",
      description: "1 image is currently unlabelled, reducing accessibility score and image search visibility.",
      priority: "medium",
      expected_impact: "WCAG compliance and image pack discovery",
      estimated_effort: "Low (5 mins)",
      category: "Accessibility & Media",
      metric: "image_alt",
    },
    {
      id: 3,
      title: "Optimize Title for Length",
      description: "Title is 65 characters. Optimal is 30-60 for featured snippet visibility.",
      priority: "low",
      expected_impact: "Better visibility in Google search results",
      estimated_effort: "5 mins",
      category: "Meta & Content",
      metric: "title_meta",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Recommendations"
        description="Prioritised improvements from your completed audits."
      />

      {isPending ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 rounded bg-muted animate-pulse" />
          ))}
        </div>
      ) : recommendations && recommendations.length > 0 ? (
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <Card key={rec.id}>
              <CardHeader>
                <CardTitle className="text-base">{rec.title}</CardTitle>
                <CardDescription>{rec.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-xs">
                  <div>
                    <span className="font-medium text-muted-foreground">Priority: </span>
                    {rec.priority}
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Impact: </span>
                    {rec.expected_impact}
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Effort: </span>
                    {rec.estimated_effort}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No recommendations yet. Complete an audit to see AI suggestions.</p>
      )}
    </div>
  );
}