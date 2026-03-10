import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, FileCode, Layers, Network, Target, Gauge } from "lucide-react";

interface Requirement {
  name: string;
  description: string;
}

interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  route: string;
  description: string;
  requestBody?: string;
  responseBody: string;
}

export interface SystemDesignProps {
  version: "basic" | "advanced" | "legendary";
  functionalReqs: Requirement[];
  nonFunctionalReqs: { name: string; description: string; supported: boolean }[];
  highLevelDesign: {
    description: string;
    components: { name: string; description: string }[];
    diagram: string;
  };
  lowLevelDesign: {
    description: string;
    details: { title: string; content: string }[];
  };
  apiEndpoints: ApiEndpoint[];
  apiDescription?: string;
}

const methodColors = {
  GET: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  POST: "bg-green-500/20 text-green-400 border-green-500/30",
  PUT: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  DELETE: "bg-red-500/20 text-red-400 border-red-500/30",
};

const SystemDesignCards = ({
  functionalReqs,
  nonFunctionalReqs,
  highLevelDesign,
  lowLevelDesign,
  apiEndpoints,
  apiDescription = "RESTful endpoints",
}: SystemDesignProps) => {
  return (
    <div className="space-y-6">
      {/* Requirements Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Functional Requirements */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-5 w-5 text-primary" />
              Functional Requirements
            </CardTitle>
            <CardDescription>What the system must do</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {functionalReqs.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium text-sm">{req.name}</span>
                    <p className="text-xs text-muted-foreground">{req.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Non-Functional Requirements */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Gauge className="h-5 w-5 text-primary" />
              Non-Functional Requirements
            </CardTitle>
            <CardDescription>Quality attributes & constraints</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {nonFunctionalReqs.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  {req.supported ? (
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  )}
                  <div>
                    <span className="font-medium text-sm">{req.name}</span>
                    <p className="text-xs text-muted-foreground">{req.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* High Level Design */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Layers className="h-5 w-5 text-primary" />
            High Level Design (HLD)
          </CardTitle>
          <CardDescription>{highLevelDesign.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* ASCII Diagram */}
          <div className="p-4 rounded-lg bg-secondary/50 font-mono text-xs overflow-x-auto">
            <pre className="text-muted-foreground whitespace-pre">{highLevelDesign.diagram}</pre>
          </div>

          {/* Components */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {highLevelDesign.components.map((comp, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                <h4 className="font-semibold text-sm mb-1">{comp.name}</h4>
                <p className="text-xs text-muted-foreground">{comp.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Low Level Design */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileCode className="h-5 w-5 text-primary" />
            Low Level Design (LLD)
          </CardTitle>
          <CardDescription>{lowLevelDesign.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {lowLevelDesign.details.map((detail, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                <h4 className="font-semibold text-sm mb-2">{detail.title}</h4>
                <div className="font-mono text-xs bg-background/50 p-3 rounded overflow-x-auto">
                  <pre className="text-muted-foreground whitespace-pre">{detail.content}</pre>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Design */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Network className="h-5 w-5 text-primary" />
            API Design
          </CardTitle>
          <CardDescription>{apiDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiEndpoints.map((endpoint, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className={`${methodColors[endpoint.method]} font-mono text-xs`}>
                    {endpoint.method}
                  </Badge>
                  <code className="text-sm font-mono text-foreground">{endpoint.route}</code>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{endpoint.description}</p>

                <div className="grid md:grid-cols-2 gap-3">
                  {endpoint.requestBody && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">Request Body</span>
                      <div className="mt-1 p-2 rounded bg-background/50 font-mono text-xs overflow-x-auto">
                        <pre className="text-green-400">{endpoint.requestBody}</pre>
                      </div>
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Response</span>
                    <div className="mt-1 p-2 rounded bg-background/50 font-mono text-xs overflow-x-auto">
                      <pre className="text-blue-400">{endpoint.responseBody}</pre>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemDesignCards;
