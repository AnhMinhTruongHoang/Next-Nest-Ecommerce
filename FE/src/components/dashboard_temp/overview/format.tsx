export function compactFormat(value: number) {
  const num = Math.round(Number(value) || 0);

  if (num >= 1_000_000_000) {
    return `${new Intl.NumberFormat("vi-VN", {
      maximumFractionDigits: 1,
    }).format(num / 1_000_000_000)} tỷ`;
  }

  if (num >= 1_000_000) {
    return `${new Intl.NumberFormat("vi-VN", {
      maximumFractionDigits: 1,
    }).format(num / 1_000_000)} triệu`;
  }

  if (num >= 1_000) {
    return `${new Intl.NumberFormat("vi-VN", {
      maximumFractionDigits: 1,
    }).format(num / 1_000)} nghìn`;
  }

  return new Intl.NumberFormat("vi-VN").format(num);
}

export function standardFormat(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  }).format(Math.round(Number(value) || 0));
}

export function currencyVND(value: number) {
  return `${standardFormat(value)} ₫`;
}
