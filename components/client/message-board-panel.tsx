"use client";

// Client message board widget with polling and server-action posting.
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import useSWR from "swr";
import { Loader2 } from "lucide-react";

import { postBoardMessage, type BoardActionState } from "@/app/actions/board-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { jsonFetcher } from "@/lib/fetcher";
import { formatRelativeTime } from "@/lib/format";
import { BOARD_AUTHOR_MAX, BOARD_BODY_MAX } from "@/lib/constants/board";
import { BOARD_POLL_INTERVAL_MS } from "@/lib/constants/polling";
import type { PortalStrings } from "@/lib/i18n";
import { pushToast } from "@/lib/toast-store";

const initialState: BoardActionState = { status: "idle", resetKey: 0 };

// Message DTO received from the board API.
type BoardMessage = {
  id: number;
  author: string;
  body: string;
  createdAt: string;
};

// API payload structure for the message list.
type BoardResponse = {
  messages: BoardMessage[];
};

type MessageBoardPanelProps = {
  isHome: boolean;
  strings: PortalStrings;
};

// Message board panel with server-action form.
export default function MessageBoardPanel({
  isHome,
  strings,
}: MessageBoardPanelProps) {
  const { data, mutate } = useSWR<BoardResponse>(
    isHome ? "/api/board" : null,
    jsonFetcher,
    { refreshInterval: BOARD_POLL_INTERVAL_MS }
  );

  const [state, formAction] = useActionState(postBoardMessage, initialState);
  const lastToastKey = useRef<string | null>(null);

  const errorMessage = useMemo(() => {
    if (state.status !== "error") {
      return null;
    }
    switch (state.error) {
      case "invalid":
        return strings.board.errorInvalid;
      case "rate":
        return strings.board.errorRate;
      case "not_available":
        return strings.misc.tailnetOnly;
      default:
        return strings.board.errorGeneric;
    }
  }, [state, strings]);

  useEffect(() => {
    if (state.status === "success") {
      mutate();
    }
  }, [state.status, mutate]);

  useEffect(() => {
    const toastKey = `${state.status}:${state.error ?? ""}`;
    if (toastKey === lastToastKey.current) {
      return;
    }

    if (state.status === "success") {
      pushToast({
        title: strings.toasts.boardSuccess.title,
        description: strings.toasts.boardSuccess.description,
        tone: "success",
      });
    }

    if (state.status === "error") {
      if (state.error === "rate") {
        pushToast({
          title: strings.toasts.boardRate.title,
          description: strings.toasts.boardRate.description,
          tone: "warning",
        });
      } else if (state.error === "not_available") {
        pushToast({
          title: strings.toasts.boardUnavailable.title,
          description: strings.toasts.boardUnavailable.description,
          tone: "warning",
        });
      } else {
        pushToast({
          title: strings.toasts.boardError.title,
          description: strings.toasts.boardError.description,
          tone: "error",
        });
      }
    }

    lastToastKey.current = toastKey;
  }, [state.status, state.error, strings]);

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
            <p className="text-sm text-muted-foreground">
              {strings.board.empty}
            </p>
          ) : (
            <div className="space-y-4">
              {data.messages.map((message) => (
                <article
                  key={message.id}
                  className="portal-card rounded-2xl p-4"
                >
                  <header className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {message.author}
                    </span>
                    <span>
                      {formatRelativeTime(message.createdAt, strings.time)}
                    </span>
                  </header>
                  <p className="mt-2 text-sm text-foreground/90">
                    {message.body}
                  </p>
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
          <BoardForm
            key={state.resetKey ?? 0}
            isHome={isHome}
            strings={strings}
            errorMessage={errorMessage}
            formAction={formAction}
          />
        </CardContent>
      </Card>
    </div>
  );
}

type BoardFormProps = {
  isHome: boolean;
  strings: PortalStrings;
  errorMessage: string | null;
  formAction: (formData: FormData) => void;
};

// Form section rendered as its own component to reset on success.
function BoardForm({
  isHome,
  strings,
  errorMessage,
  formAction,
}: BoardFormProps) {
  const [bodyLength, setBodyLength] = useState(0);

  return (
    <form className="space-y-4" action={formAction}>
      <div className="space-y-2">
        <Label htmlFor="author">{strings.board.nameLabel}</Label>
        <Input
          id="author"
          name="author"
          placeholder={strings.board.namePlaceholder}
          maxLength={BOARD_AUTHOR_MAX}
          disabled={!isHome}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="body">{strings.board.messageLabel}</Label>
        <Textarea
          id="body"
          name="body"
          placeholder={strings.board.messagePlaceholder}
          maxLength={BOARD_BODY_MAX}
          disabled={!isHome}
          onInput={(event) =>
            setBodyLength(event.currentTarget.value.length)
          }
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {strings.board.charCount}: {bodyLength}/{BOARD_BODY_MAX}
          </span>
          <span>{strings.board.tailnetOnly}</span>
        </div>
      </div>
      {errorMessage && (
        <p className="text-xs text-rose-600">{errorMessage}</p>
      )}
      <SubmitButton label={strings.board.postButton} disabled={!isHome} />
    </form>
  );
}

type SubmitButtonProps = {
  label: string;
  disabled: boolean;
};

// Submit button that reflects the server action pending state.
function SubmitButton({ label, disabled }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={disabled || pending}
      className="shadow-[0_12px_30px_var(--portal-glow)]"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : label}
    </Button>
  );
}
