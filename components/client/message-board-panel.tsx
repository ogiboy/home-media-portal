"use client";

import { useState, type FormEvent } from "react";
import useSWR from "swr";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { jsonFetcher } from "@/lib/fetcher";
import { formatRelativeTime } from "@/lib/format";
import type { PortalStrings } from "@/lib/i18n";

type BoardMessage = {
  id: number;
  author: string;
  body: string;
  createdAt: string;
};

type BoardResponse = {
  messages: BoardMessage[];
};

type MessageBoardPanelProps = {
  isHome: boolean;
  strings: PortalStrings;
};

export default function MessageBoardPanel({ isHome, strings }: MessageBoardPanelProps) {
  const { data, mutate } = useSWR<BoardResponse>(
    isHome ? "/api/board" : null,
    jsonFetcher,
    { refreshInterval: 15000 }
  );

  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!isHome) {
      return;
    }

    const trimmedAuthor = author.trim();
    const trimmedBody = body.trim();

    if (trimmedAuthor.length < 1 || trimmedAuthor.length > 30) {
      setError(strings.board.errorInvalid);
      return;
    }
    if (trimmedBody.length < 1 || trimmedBody.length > 280) {
      setError(strings.board.errorInvalid);
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("/api/board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: trimmedAuthor, body: trimmedBody }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        if (result?.error === "rate_limited") {
          setError(strings.board.errorRate);
        } else {
          setError(strings.board.errorGeneric);
        }
        return;
      }

      setAuthor("");
      setBody("");
      mutate();
      setCooldown(true);
      window.setTimeout(() => setCooldown(false), 1500);
    } catch {
      setError(strings.board.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <Card className="portal-surface">
        <CardHeader>
          <CardTitle>{strings.board.recentTitle}</CardTitle>
          <CardDescription>{strings.board.recentDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!data ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          ) : data.messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">{strings.board.empty}</p>
          ) : (
            <div className="space-y-4">
              {data.messages.map((message) => (
                <article
                  key={message.id}
                  className="portal-card rounded-2xl p-4"
                >
                  <header className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">{message.author}</span>
                    <span>{formatRelativeTime(message.createdAt, strings.time)}</span>
                  </header>
                  <p className="mt-2 text-sm text-foreground/90">{message.body}</p>
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="portal-surface">
        <CardHeader>
          <CardTitle>{strings.board.postTitle}</CardTitle>
          <CardDescription>{strings.board.postDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="author">{strings.board.nameLabel}</Label>
              <Input
                id="author"
                placeholder={strings.board.namePlaceholder}
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                maxLength={30}
                disabled={!isHome}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">{strings.board.messageLabel}</Label>
              <Textarea
                id="body"
                placeholder={strings.board.messagePlaceholder}
                value={body}
                onChange={(event) => setBody(event.target.value)}
                maxLength={280}
                disabled={!isHome}
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{strings.board.charCount}: {body.length}/280</span>
                <span>{strings.board.tailnetOnly}</span>
              </div>
            </div>
            {error && <p className="text-xs text-rose-600">{error}</p>}
            <Button
              type="submit"
              disabled={!isHome || submitting || cooldown}
              className="shadow-[0_12px_30px_var(--portal-glow)]"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                strings.board.postButton
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
