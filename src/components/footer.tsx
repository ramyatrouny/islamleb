import { Moon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border pb-20 md:pb-0 hidden md:block">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold text-foreground">
              إسلام لبنان
            </span>
          </div>

          {/* Ramadan Greeting */}
          <p className="text-sm text-muted-foreground">
            رمضان كريم - تقبل الله منا ومنكم
          </p>

          {/* Share Call-to-Action */}
          <p className="text-xs text-muted-foreground/70">
            شارك الموقع مع أحبائك
          </p>

          {/* Disclaimer */}
          <p className="max-w-md text-[10px] leading-relaxed text-muted-foreground/50">
            البيانات المعروضة (مواقيت الصلاة، أسعار الصرف، أسعار المعادن، وتواريخ
            التقويم الهجري) مصدرها واجهات برمجة خارجية وقد تحتوي على هامش خطأ.
            يُرجى التحقق من المعلومات قبل اتخاذ أي قرار شرعي أو مالي.
          </p>

          {/* Divider */}
          <div className="h-px w-24 bg-border" />

          {/* Copyright */}
          <p className="text-xs text-muted-foreground/60">
            إسلام لبنان © 2026 - صدقة جارية
          </p>
        </div>
      </div>
    </footer>
  );
}
