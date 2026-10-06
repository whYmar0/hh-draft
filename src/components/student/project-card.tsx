import * as React from 'react';
import Link from 'next/link';
import { Github, ExternalLink, Code2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface ProjectCardProps {
  title: string;
  description: string;
  role?: string | null;
  repoUrl?: string | null;
  demoUrl?: string | null;
  technologies: string[];
}

export function ProjectCard({
  title,
  description,
  role,
  repoUrl,
  demoUrl,
  technologies,
}: ProjectCardProps) {
  return (
    <Card className="flex flex-col justify-between border-border/60 hover:border-indigo-500/30 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Code2 className="h-4 w-4 text-indigo-500 shrink-0" />
              {title}
            </CardTitle>
            {role && (
              <span className="text-xs text-muted-foreground font-medium mt-0.5 inline-block">
                Роль: {role}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {repoUrl && (
              <Link href={repoUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <Github className="h-4 w-4" />
                </Button>
              </Link>
            )}
            {demoUrl && (
              <Link href={demoUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
        <CardDescription className="text-xs leading-relaxed mt-2 line-clamp-3">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/40">
          {technologies.map((tech) => (
            <Badge key={tech} variant="tech">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
