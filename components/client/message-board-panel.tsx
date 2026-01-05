'use client';

// Client message board widget with polling and server-action posting.
import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import useSWR from 'swr';
import { ArrowDownUp, Loader2 } from 'lucide-react';

import {
  postBoardMessage,
  type BoardActionState,
} from '@/app/actions/board-actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { jsonFetcher } from '@/lib/fetcher';
import { formatRelativeTime } from '@/lib/format';
import { BOARD_AUTHOR_MAX, BOARD_BODY_MAX } from '@/lib/constants/board';
import { BOARD_POLL_INTERVAL_MS } from '@/lib/constants/polling';
import type { PortalStrings } from '@/lib/i18n';
import { pushToast } from '@/lib/toast-store';
import { cn } from '@/lib/utils';

const initialState: BoardActionState = { status: 'idle', resetKey: 0 };

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

type MessageBoardPanelProps = Readonly<{
  isHome: boolean;
  strings: PortalStrings;
  variant?: 'split' | 'stacked';
}>;

type BoardFilters = {
  query: string;
  startDate: string;
  endDate: string;
  sortOrder: 'desc' | 'asc';
};

const filterBoardMessages = (
  messages: BoardMessage[] | undefined,
  filters: BoardFilters
) => {
  if (messages === undefined) {
    return [];
  }

  const normalizedQuery = filters.query.trim().toLowerCase();
  const startTime = filters.startDate
    ? new Date(`${filters.startDate}T00:00:00`).getTime()
    : null;
  const endTime = filters.endDate
    ? new Date(`${filters.endDate}T23:59:59.999`).getTime()
    : null;

  return messages
    .filter((message) => {
      if (normalizedQuery) {
        const haystack = `${message.author} ${message.body}`.toLowerCase();
        if (!haystack.includes(normalizedQuery)) {
          return false;
        }
      }

      const createdTime = new Date(message.createdAt).getTime();
      if (Number.isNaN(createdTime)) {
        return false;
      }
      if (startTime !== null && createdTime < startTime) {
        return false;
      }
      if (endTime !== null && createdTime > endTime) {
        return false;
      }
      return true;
    })
    .slice()
    .sort((left, right) => {
      const leftTime = new Date(left.createdAt).getTime();
      const rightTime = new Date(right.createdAt).getTime();
      return filters.sortOrder === 'desc'
        ? rightTime - leftTime
        : leftTime - rightTime;
    });
};

const getBoardErrorMessage = (
  state: BoardActionState,
  strings: PortalStrings
) => {
  if (state.status === 'error') {
    switch (state.error) {
      case 'invalid':
        return strings.board.errorInvalid;
      case 'rate':
        return strings.board.errorRate;
      case 'not_available':
        return strings.misc.tailnetOnly;
      default:
        return strings.board.errorGeneric;
    }
  }
  return null;
};

/**
 * Render a message board panel with a list of recent messages, client-side filters, and a posting form.
 *
 * @param isHome - Whether the panel operates in the home context (enables fetching and posting behavior).
 * @param strings - Localization strings used for labels, placeholders, descriptions, and toast messages.
 * @param variant - Layout variant for the panel; `"split"` renders side-by-side cards, `"stacked"` renders a vertical layout.
 * @returns The rendered message board panel React element.
 */
export default function MessageBoardPanel({
  isHome,
  strings,
  variant = 'split',
}: MessageBoardPanelProps) {
  const { data, mutate } = useSWR<BoardResponse>(
    isHome ? '/api/board' : null,
    jsonFetcher,
    { refreshInterval: BOARD_POLL_INTERVAL_MS }
  );

  const [state, formAction] = useActionState(postBoardMessage, initialState);
  const lastToastKey = useRef<string | null>(null);
  const isStacked = variant === 'stacked';
  const [query, setQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const filteredMessages = filterBoardMessages(data?.messages, {
    query,
    startDate,
    endDate,
    sortOrder,
  });

  const errorMessage = getBoardErrorMessage(state, strings);

  const boardContent = (() => {
    if (data === undefined) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      );
    }

    if (data.messages.length === 0) {
      return (
        <p className="text-sm text-muted-foreground">{strings.board.empty}</p>
      );
    }

    return (
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <div className="space-y-2">
            <Label htmlFor="board-filter">{strings.board.filterLabel}</Label>
            <Input
              id="board-filter"
              placeholder={strings.board.filterPlaceholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            className="justify-between md:w-47.5"
            onClick={() =>
              setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))
            }
          >
            <span>
              {sortOrder === 'desc'
                ? strings.board.sortNewest
                : strings.board.sortOldest}
            </span>
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="board-start">{strings.board.dateFromLabel}</Label>
            <Input
              id="board-start"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="board-end">{strings.board.dateToLabel}</Label>
            <Input
              id="board-end"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </div>
        </div>
        {(query || startDate || endDate) && (
          <div>
            <Button
              type="button"
              variant="ghost"
              className="h-8 px-2 text-xs"
              onClick={() => {
                setQuery('');
                setStartDate('');
                setEndDate('');
              }}
            >
              {strings.board.clearFilters}
            </Button>
          </div>
        )}
        {filteredMessages.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {strings.board.emptyFiltered}
          </p>
        ) : (
          filteredMessages.map((message) => (
            <article key={message.id} className="portal-card rounded-2xl p-4">
              <header className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {message.author}
                </span>
                <span>
                  {formatRelativeTime(message.createdAt, strings.time)}
                </span>
              </header>
              <p className="mt-2 text-sm text-foreground/90">{message.body}</p>
            </article>
          ))
        )}
      </div>
    );
  })();

  useEffect(() => {
    if (state.status === 'success') {
      mutate();
    }
  }, [state.status, mutate]);

  useEffect(() => {
    const toastKey = `${state.status}:${state.error ?? ''}`;
    if (toastKey === lastToastKey.current) {
      return;
    }

    if (state.status === 'success') {
      pushToast({
        title: strings.toasts.boardSuccess.title,
        description: strings.toasts.boardSuccess.description,
        tone: 'success',
      });
    }

    if (state.status === 'error') {
      if (state.error === 'rate') {
        pushToast({
          title: strings.toasts.boardRate.title,
          description: strings.toasts.boardRate.description,
          tone: 'warning',
        });
      } else if (state.error === 'not_available') {
        pushToast({
          title: strings.toasts.boardUnavailable.title,
          description: strings.toasts.boardUnavailable.description,
          tone: 'warning',
        });
      } else {
        pushToast({
          title: strings.toasts.boardError.title,
          description: strings.toasts.boardError.description,
          tone: 'error',
        });
      }
    }

    lastToastKey.current = toastKey;
  }, [state.status, state.error, strings]);

  return (
    <div
      className={cn(
        'mt-6 grid gap-6',
        isStacked ? 'mt-4' : 'lg:grid-cols-[1.1fr_1fr]'
      )}
    >
      <Card className="portal-surface">
        <CardHeader className={cn(isStacked && 'p-5')}>
          <CardTitle className={cn(isStacked && 'text-base')}>
            {strings.board.recentTitle}
          </CardTitle>
          <CardDescription className={cn(isStacked && 'text-xs')}>
            {strings.board.recentDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className={cn('space-y-4', isStacked && 'p-5 pt-0')}>
          {boardContent}
        </CardContent>
      </Card>

      <Card className="portal-surface">
        <CardHeader className={cn(isStacked && 'p-5')}>
          <CardTitle className={cn(isStacked && 'text-base')}>
            {strings.board.postTitle}
          </CardTitle>
          <CardDescription className={cn(isStacked && 'text-xs')}>
            {strings.board.postDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className={cn(isStacked && 'p-5 pt-0')}>
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

type BoardFormProps = Readonly<{
  isHome: boolean;
  strings: PortalStrings;
  errorMessage: string | null;
  formAction: (formData: FormData) => void;
}>;

/**
 * Render the message-posting form used to submit new board messages.
 *
 * @param isHome - If `true`, form inputs and submission are enabled; if `false`, inputs are disabled.
 * @param strings - Localized UI strings for labels, placeholders, button text, and helper copy.
 * @param errorMessage - Optional error text to display above the submit button when present.
 * @param formAction - Action handler used as the form's `action` prop for submission.
 * @returns The JSX element for the board submission form, including author and message fields, character count, and submit control.
 */
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
          onInput={(event) => setBodyLength(event.currentTarget.value.length)}
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {strings.board.charCount}: {bodyLength}/{BOARD_BODY_MAX}
          </span>
          <span>{strings.board.tailnetOnly}</span>
        </div>
      </div>
      {errorMessage && <p className="text-xs text-rose-600">{errorMessage}</p>}
      <SubmitButton label={strings.board.postButton} disabled={!isHome} />
    </form>
  );
}

type SubmitButtonProps = Readonly<{
  label: string;
  disabled?: boolean;
}>;

/**
 * Render a submit button that displays a loading spinner while the surrounding form action is pending.
 *
 * @param label - Text to display inside the button.
 * @param disabled - If `true`, disables the button in addition to any pending form state.
 * @returns The submit button element; when the form is pending a spinner is shown and the button is disabled.
 */
function SubmitButton({ label, disabled }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={disabled || pending}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {label}
    </Button>
  );
}