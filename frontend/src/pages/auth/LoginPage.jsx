import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Alert, Spinner } from "@/components/ui";
import { Zap, Eye, EyeOff } from "lucide-react";
import SoftAurora from "@/component/SoftAurora/SoftAurora";
import SpotlightCard from "@/component/SpotlightCard/SpotlightCard";
import SplitText from "@/component/SplitText/SplitText";
import Magnet from "@/component/Magnet/Magnet";
import SplashCursor from "@/component/SplashCursor/SplashCursor";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 text-sm rounded-xl " +
    "bg-white/5 border border-white/15 " +
    "text-white placeholder:text-white/25 " +
    "focus:outline-none focus:border-brand-400/60 " +
    "focus:shadow-[0_0_16px_2px_rgba(139,92,246,0.2)] " +
    "transition-all duration-200";

  return (
    <div className="login-page min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a0a0f]">

      {/*
      <SplashCursor
        TRANSPARENT={true}
        RAINBOW_MODE={true}
        DENSITY_DISSIPATION={3.5}
        VELOCITY_DISSIPATION={2}
        SPLAT_RADIUS={0.2}
        SPLAT_FORCE={6000}
        CURL={3}
      />
      /*}
      {/* SoftAurora Background */}
      <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }}>
        <SoftAurora
          speed={0.6}
          scale={1.5}
          brightness={1.2}
          color1="#6366f1"
          color2="#a855f7"
          noiseFrequency={2.5}
          noiseAmplitude={1.0}
          bandHeight={0.5}
          bandSpread={1.2}
          octaveDecay={0.1}
          layerOffset={0.4}
          colorSpeed={1.0}
          enableMouseInteraction={true}
          mouseInfluence={0.25}
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 z-[1]" style={{ background: "rgba(8,8,18,0.55)" }} />




      {/* Header — fixed to top center */}
      <div style={{ position: "fixed", top: "2rem", left: 0, right: 0, zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
        <SplitText
          text="Welcome!"
          tag="h1"
          className="text-1xl font-bold text-white"
          splitType="words"
          delay={700}
          duration={5}
          from={{ opacity: 0, y: 12 }}
          to={{ opacity: 1, y: 0 }}
          textAlign="center"
        />
        <p> </p>
        <SplitText
          text="Sign in using your Sceniuz credentials"
          tag="p"
          className="text-sm text-white/50"
          splitType="words"
          delay={200}
          duration={1}
          from={{ opacity: 0, y: 10 }}
          to={{ opacity: 1, y: 0 }}
          textAlign="center"
        />
      </div>
      <p><br /><br /></p>


      {/* Centered content */}
      <div className="relative z-10 w-full max-w-sm px-4 animate-slide-up">

        {/* Card */}
        <SpotlightCard
          className="w-full rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl"
          spotlightColor="rgba(222, 222, 223, 0.5)"
        >
          <div className="p-8">

            {error && (
              <div className="mb-5">
                <Alert type="error" message={error} />
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="you@company.com"
                  />
                </div>
                <p> <br />  </p>

                {/* Password */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="password" className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={form.password}
                      onChange={handleChange}
                      className={`${inputClass} pr-12`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg
                                 bg-white/5 hover:bg-white/10 border border-white/10
                                 text-white/40 hover:text-white/70 transition-all duration-150"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <p> <br />  </p>
                {/* Sign in button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 text-base font-semibold rounded-xl
                             bg-brand-600 hover:bg-brand-500 active:bg-brand-700
                             text-white shadow-lg shadow-brand-500/30
                             transition-all duration-150 flex items-center justify-center gap-2
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Spinner size="sm" /> : "Sign in"}
                </button>

              </div>
            </form>
            <p> <br />  </p>
            {/* Demo credentials */}
            <div className="mt-6 pt-7 border-t border-white/[0.06]">
              <p className="text-[15px] font-semibold text-white/20 uppercase tracking-widest mb-5">
                Demo credentials <br />
                Admin · admin@skillassess.io / Admin@123 <br />
                Employee · aarav@skillassess.io / Employee@123 <br />
              </p>
            </div>
          </div>

        </SpotlightCard>

      </div >

    </div >
  );
}