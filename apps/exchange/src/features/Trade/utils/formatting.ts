// Tick/step-aware number formatting + input validation.
// Extracted from Trade/index.tsx so OrderForm, OrderBook, and any future
// widgets share one source of truth for precision.

type Coin = {
    tick_size?: number | string | null;
    step_size?: number | string | null;
} | null | undefined;

export function getDecimalPlaces(value: any): number {
    if (!value || value >= 1) return 0;
    const str = value.toString();
    if (str.includes("e-")) {
        return parseInt(str.split("e-")[1]);
    }
    const decimalPart = str.split(".")[1];
    return decimalPart ? decimalPart.length : 0;
}

export function getPricePrecision(coin: Coin): number {
    const tickSize = coin?.tick_size;
    if (tickSize === undefined || tickSize === null) return 8;
    return getDecimalPlaces(tickSize);
}

export function getQuantityPrecision(coin: Coin): number {
    const stepSize = coin?.step_size;
    if (stepSize === undefined || stepSize === null) return 8;
    return getDecimalPlaces(stepSize);
}

export function formatPrice(price: any, coin: Coin): string {
    if (price === undefined || price === null || isNaN(price)) return "0";
    const precision = getPricePrecision(coin);
    return parseFloat(Number(price).toFixed(precision)).toString();
}

export function formatQuantity(qty: any, coin: Coin): number {
    if (qty === undefined || qty === null || isNaN(qty)) return 0;
    const precision = getQuantityPrecision(coin);
    return parseFloat(Number(qty).toFixed(precision));
}

export function formatTotal(value: any, coin: Coin): string {
    const precision = getPricePrecision(coin);
    const finalValue = value?.toFixed(precision)?.replace(/\.?0+$/, "");
    const formattedNum = finalValue?.toString();
    const result = formattedNum?.replace(/^0\.0*/, "");
    const decimalPart = finalValue?.toString()?.split(".")[1];
    if (!decimalPart) return finalValue;
    let zeroCount = 0;
    for (const char of decimalPart) {
        if (char === "0") zeroCount++;
        else break;
    }
    if (zeroCount > 4) return `0.0{${zeroCount}}${result}`;
    if (value < 1e-7) return `0.0{${zeroCount}}${result}`;
    return finalValue;
}

export function formatPriceThousands(raw: any, coin: Coin): string {
    const n = parseFloat(String(raw).replace(/,/g, ""));
    if (Number.isNaN(n)) return raw === undefined || raw === null ? "" : String(raw);
    const prec = getPricePrecision(coin);
    return n.toLocaleString("en-US", { maximumFractionDigits: prec, minimumFractionDigits: 0 });
}

export function toFixed8(data: number, coin: Coin): number {
    const precision = getQuantityPrecision(coin);
    const multiplier = Math.pow(10, precision);
    return Math.floor(data * multiplier) / multiplier;
}

export function isValidPriceInput(value: any, coin: Coin): boolean {
    const valueClean = String(value).replace(/,/g, "");
    if (valueClean === "" || valueClean === "0") return true;
    const tickSize = Number(coin?.tick_size) || 0.01;
    const pricePrecision = getPricePrecision(coin);
    const regex = new RegExp(`^\\d*\\.?\\d{0,${pricePrecision}}$`);
    if (!regex.test(valueClean)) return false;
    if (valueClean.endsWith(".")) return true;
    const numValue = parseFloat(valueClean);
    if (isNaN(numValue)) return false;
    if (numValue === 0) return true;
    return numValue >= tickSize;
}

export function isValidQuantityInput(value: any, coin: Coin): boolean {
    if (value === "" || value === "0") return true;
    const stepSize = Number(coin?.step_size) || 0.00001;
    const qtyPrecision = getQuantityPrecision(coin);
    const regex = new RegExp(`^\\d*\\.?\\d{0,${qtyPrecision}}$`);
    if (!regex.test(value)) return false;
    if (value.endsWith(".")) return true;
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return false;
    if (numValue === 0) return true;
    return numValue >= stepSize;
}
