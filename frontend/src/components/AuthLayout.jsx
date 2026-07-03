import { Link } from "react-router-dom";
import { Sprout } from "lucide-react";

// Shared split-screen layout for the login and register pages.
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen bg-ink-50">
      {/* Left brand panel (hidden on small screens) */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-primary-600 p-12 text-white lg:flex">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Sprout className="h-7 w-7" />
          <span>AGROBROKER</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold leading-tight">
            Manage your agricultural marketplace in one place.
          </h2>
          <p className="mt-4 max-w-md text-primary-50/90">
            Track farmers, buyers, products, transactions, and payments with a
            clean, modern dashboard built for brokers.
          </p>
        </div>
        <p className="text-sm text-primary-50/80">
          &copy; {new Date().getFullYear()} AGROBROKER. | Agricultural Brokerage Management System
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <Sprout className="h-7 w-7 text-primary-600" />
            <span className="text-lg font-semibold text-ink-800">AGROBROKER</span>
          </div>
          <h1 className="text-2xl font-bold text-ink-800">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && (
            <p className="mt-6 text-center text-sm text-ink-500">
              {footer.to ? (
                <>
                  {footer.text}{" "}
                  <Link to={footer.to} className="font-medium text-primary-600 hover:text-primary-700">
                    {footer.label}
                  </Link>
                </>
              ) : (
                footer.text
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
