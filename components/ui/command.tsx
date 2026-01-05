'use client';

import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { Search } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';

/**
 * Renders a styled wrapper around the cmdk CommandPrimitive and exposes a data-slot for styling.
 *
 * @returns A CommandPrimitive element with `data-slot="command"` and a composed `className` that includes layout and card styling.
 */
function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        'flex h-full w-full flex-col overflow-hidden rounded-(--radius) bg-card text-foreground',
        className
      )}
      {...props}
    />
  );
}

type CommandDialogProps = React.ComponentProps<typeof Dialog> & {
  closeLabel?: string;
  className?: string;
};

/**
 * Renders a dialog hosting the command palette.
 *
 * Renders a Dialog whose DialogContent contains the Command component and provided children.
 *
 * @param children - Content to render inside the Command palette (typically command items and groups)
 * @param closeLabel - Accessible label for the dialog close control
 * @param className - Additional class names applied to the DialogContent container
 */
function CommandDialog({
  children,
  closeLabel,
  className,
  ...props
}: CommandDialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent
        className={cn('overflow-hidden p-0 shadow-2xl', className)}
        closeLabel={closeLabel}
      >
        <Command className="border-0">{children}</Command>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Renders the command palette input region with a leading search icon.
 *
 * @param className - Additional class names applied to the input element
 * @param props - Additional props forwarded to the underlying CommandPrimitive.Input
 * @returns The input wrapper element containing a search icon and the command input
 */
function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex items-center gap-2 border-b border-border px-4"
    >
      <Search className="h-4 w-4 text-muted-foreground" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          'flex h-12 w-full rounded-md bg-transparent text-sm outline-none placeholder:text-muted-foreground',
          className
        )}
        {...props}
      />
    </div>
  );
}

/**
 * Renders the scrollable list region for the command palette.
 *
 * Renders a CommandPrimitive.List element with a `data-slot="command-list"` attribute and default scrolling and padding classes; merges any provided `className` with these defaults.
 *
 * @returns The rendered command list element
 */
function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn('max-h-80 overflow-y-auto p-2', className)}
      {...props}
    />
  );
}

/**
 * Renders the empty-state slot for the command palette.
 *
 * @returns The CommandPrimitive.Empty element with centered, muted empty-state styling and data-slot="command-empty".
 */
function CommandEmpty({
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="py-6 text-center text-sm text-muted-foreground"
      {...props}
    />
  );
}

/**
 * Renders a styled group container for command palette items.
 *
 * @returns The underlying `CommandPrimitive.Group` element used to group command items in the command palette.
 */
function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn('overflow-hidden p-1 text-foreground', className)}
      {...props}
    />
  );
}

/**
 * Renders a horizontal separator used between command items and groups.
 *
 * @returns The separator element for the command palette rendered as a thin horizontal divider.
 */
function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn('-mx-1 h-px bg-border/70', className)}
      {...props}
    />
  );
}

/**
 * Renders a styled command palette item.
 *
 * @returns The `CommandPrimitive.Item` element configured with palette-specific slots and styles.
 */
function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        'flex cursor-default select-none items-center gap-2 rounded-xl px-3 py-2 text-sm outline-none transition-colors data-[disabled=true]:pointer-events-none data-[selected=true]:bg-muted',
        className
      )}
      {...props}
    />
  );
}

/**
 * Renders a right-aligned, small-text shortcut label for command items.
 *
 * @param className - Additional CSS classes to merge with the component's default styling
 * @param props - Additional attributes forwarded to the underlying `span` element
 * @returns The rendered `span` element used to display a keyboard shortcut hint
 */
function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};