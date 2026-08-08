export function useHindiNumbers() {
  const hindiDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']

  const convertToHindi = (value: string | number): string => {
    const stringValue = String(value)
    return stringValue.replace(/\d/g, (digit) => hindiDigits[parseInt(digit)])
  }

  return {
    convertToHindi,
  }
}
