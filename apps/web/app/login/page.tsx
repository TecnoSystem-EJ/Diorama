import { SiteHeader } from "../components/Header"
import { LoginForm } from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F4F1EA" }}>
      
      {/* Navbar */}
      <SiteHeader isAuthenticated={false} />

      {/* Card */}
      <main className="flex-1 flex items-center justify-center py-20 px-6">
        <div className="bg-white border border-black/10 shadow-2xl p-12 md:p-20 w-full max-w-lg flex flex-col gap-10">
          
          <div className="text-center flex flex-col gap-2">
            <h1 className="font-serif text-5xl uppercase tracking-tighter text-[#111111]">
              Diorama
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">
              Painel Editorial
            </p>
          </div>

          <LoginForm />

        </div>
      </main>
    </div>
  );
}