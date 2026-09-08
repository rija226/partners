// One entry, edited directly in Contentful, holding every partner email that should be
// notified — simplest content model for a list that doesn't need per-subscriber metadata yet.
export type NotificationSubscribers = {
  displayName: string;
  emails: string[];
};
