"use client";

import Icon from "@/app/landing/Icon";
import Button from "@/components/ui/button";
import notify from "@/lib/sweetalert";

export default function ShareButton({ title }) {
  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        notify.toast("Tautan artikel berhasil disalin!");
        return;
      } catch {
        // fallback
      }
    }

    notify.alert({
      title: "Bagikan Cerita Ini",
      text: `Salin link berikut: ${url}`,
      icon: "info",
    });
  };

  const handleShareWhatsApp = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = encodeURIComponent(`Lihat liputan sukses event ini bersama LMI Event: ${title}\n${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        rounded="full"
        onClick={handleShare}
        leftIcon={<Icon name="link" className="h-4 w-4" />}
        className="text-xs font-semibold"
      >
        Salin Link
      </Button>
      <Button
        variant="outline"
        size="sm"
        rounded="full"
        onClick={handleShareWhatsApp}
        leftIcon={<Icon name="chat" className="h-4 w-4" />}
        className="text-xs font-semibold text-emerald-700 hover:bg-emerald-50 border-emerald-200"
      >
        Bagikan ke WhatsApp
      </Button>
    </div>
  );
}
