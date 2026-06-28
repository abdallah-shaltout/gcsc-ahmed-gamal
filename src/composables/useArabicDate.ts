export function useArabicDate() {
  function formatArabicDate(dateStr: string | undefined | null): string {
    if (!dateStr) return '.... / .... / ...........'
    const date = new Date(dateStr)
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  function formatDateForInput(d: Date): string {
    return d.toISOString().split('T')[0] ?? ''
  }

  return { formatArabicDate, formatDateForInput }
}
