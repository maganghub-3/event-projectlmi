export const IDENTITY_TYPES = [
  { id: "ktp", label: "KTP" },
  { id: "sim", label: "SIM" },
  { id: "paspor", label: "Paspor" },
  { id: "kartu-pelajar", label: "Kartu Pelajar" },
];

export const IDENTITY_PLACEHOLDERS = {
  ktp: "16 digit nomor KTP",
  sim: "Nomor SIM",
  paspor: "Nomor paspor",
  "kartu-pelajar": "Nomor kartu pelajar",
};

export function identityLabel(id) {
  return IDENTITY_TYPES.find((type) => type.id === id)?.label || "-";
}
