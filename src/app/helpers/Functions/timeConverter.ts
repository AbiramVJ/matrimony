export function getFormattedLastSentAt(lastSentAt:any): string {
    if (!lastSentAt) return '';

    const sentDate = new Date(lastSentAt);
    const now = new Date();

    const isToday =
      sentDate.toDateString() === now.toDateString();

    const isThisYear =
      sentDate.getFullYear() === now.getFullYear();

    if (isToday) {
      return sentDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }

    if (isThisYear) {
      return sentDate.toLocaleDateString(undefined, {
        day: '2-digit',
        month: 'short'
      });
    }

    return sentDate.toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    });
  }
