/**
 * Penyimpanan pesanan sementara (UI-only).
 * Menggantikan backend sampai nanti ada API + payment gateway.
 * Semua akses localStorage hanya dipanggil dari event handler / useEffect di browser.
 */

const STORAGE_KEY = "lmi-event-orders-v1";

export const EMPTY_ATTENDEE = {
  name: "",
  phone: "",
  email: "",
  identityType: "ktp",
  identityNumber: "",
};

export function makeAttendees(count) {
  return Array.from({ length: count }, () => ({ ...EMPTY_ATTENDEE }));
}

export function readOrders() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeOrders(orders) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function soldTickets(slug) {
  return readOrders()
    .filter((order) => order.status === "paid" && order.eventSlug === slug)
    .reduce(
      (total, order) => total + order.qty * (order.ticketCount || 1),
      0
    );
}

export function availableTickets(event) {
  return Math.max(0, event.spotsLeft - soldTickets(event.slug));
}

export function createDraft(event, qty, ticketType) {
  const orders = readOrders().filter((order) => order.status !== "pending_payment");
  const unitPrice = ticketType.price;
  const ticketCount = ticketType.ticketCount;
  const draft = {
    id: `LMI-${Date.now().toString(36).toUpperCase()}`,
    eventSlug: event.slug,
    qty,
    ticketTypeId: ticketType.id,
    ticketTypeName: ticketType.name,
    ticketCount,
    unitPrice,
    total: unitPrice * qty,
    status: "pending_payment",
    buyer: null,
    attendees: makeAttendees(qty * ticketCount),
    paymentMethod: null,
    tickets: [],
    createdAt: new Date().toISOString(),
    paidAt: null,
  };
  writeOrders([draft, ...orders]);
  return draft;
}

export function getLatestDraft() {
  return readOrders().find((order) => order.status === "pending_payment") || null;
}

export function getOrder(id) {
  return readOrders().find((order) => order.id === id) || null;
}

export function saveAttendees(id, attendees) {
  let updated = null;
  const orders = readOrders().map((order) => {
    if (order.id !== id) return order;
    updated = { ...order, attendees, buyer: attendees[0] || null };
    return updated;
  });
  writeOrders(orders);
  return updated;
}

export function completeOrder(id, buyer, paymentMethod, attendees) {
  let completed = null;
  const orders = readOrders().map((order) => {
    if (order.id !== id) return order;
    completed = {
      ...order,
      status: "paid",
      buyer,
      attendees: attendees && attendees.length ? attendees : [buyer],
      paymentMethod,
      paidAt: new Date().toISOString(),
      tickets: Array.from(
        { length: order.qty * (order.ticketCount || 1) },
        (_, index) => `${order.id}-${index + 1}`
      ),
    };
    return completed;
  });
  writeOrders(orders);
  return completed;
}

export function cancelOrder(id) {
  writeOrders(readOrders().filter((order) => order.id !== id));
}
