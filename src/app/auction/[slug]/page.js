"use client";
import { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import applicationService from "@/services/applicationService";
import lotService from "@/services/lotService";
import {
  Loader2,
  User,
  Trophy,
  MessageSquare,
  Shield,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function AuctionRoom({ params }) {
  const { slug } = use(params);
  const router = useRouter();
  const [lot, setLot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  // Socket states
  const [socket, setSocket] = useState(null);
  const [phase, setPhase] = useState("loading"); // loading, prep, bidding, ended
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [bids, setBids] = useState([]);
  const [lastBidder, setLastBidder] = useState(null);
  const [error, setError] = useState("");

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [bids]);

  useEffect(() => {
    const initAuction = async () => {
      try {
        const lotData = await lotService.getLotBySlug(slug);
        if (!lotData) {
          router.push("/lots/lots");
          return;
        }
        setLot(lotData);
        setCurrentPrice(lotData.startPrice);

        const token =
          sessionStorage.getItem("userToken") ||
          sessionStorage.getItem("adminToken");
        if (!token) {
          router.push("/login");
          return;
        }

        const isAdmin = !!sessionStorage.getItem("adminToken");
        if (isAdmin) {
          setAuthorized(true);
        } else {
          const app = await applicationService.checkMyApplication(lotData._id);
          if (app && app.status === "approved") {
            setAuthorized(true);
          } else {
            setAuthorized(false);
            setLoading(false);
            return;
          }
        }

        // Initialize Socket
        const socketInstance = io(
          "https://auksion-backend-production.up.railway.app",
        );
        setSocket(socketInstance);

        socketInstance.emit("join_auction", { slug, isAdmin });

        socketInstance.on("auction_state", (state) => {
          setPhase(state.phase);
          setTimeLeft(state.timeLeft);
          setCurrentPrice(state.currentPrice);
          setBids(state.bids);
          setLastBidder(state.lastBidder);
        });

        socketInstance.on("timer_update", (data) => {
          setTimeLeft(data.timeLeft);
          if (data.phase) setPhase(data.phase);
        });

        socketInstance.on("phase_change", (data) => {
          setPhase(data.phase);
          setTimeLeft(data.timeLeft);
        });

        socketInstance.on("new_bid", (data) => {
          setCurrentPrice(data.currentPrice);
          setLastBidder(data.lastBidder);
          setBids(data.bids);
          setTimeLeft(data.timeLeft);
        });

        socketInstance.on("auction_ended", (data) => {
          setPhase("ended");
          setLastBidder(data.winner);
          setCurrentPrice(data.finalPrice);

          // Auto-redirect after 10 seconds
          setTimeout(() => {
            router.push("/");
          }, 10000);
        });

        socketInstance.on("error", (msg) => setError(msg));

        // Immediate check if lot is already finished
        if (lotData.status !== "active") {
          setPhase("ended");
        }

        return () => socketInstance.disconnect();
      } catch (err) {
        console.error("Auction init error:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuction();
  }, [slug, router]);

  const handlePlaceBid = () => {
    if (phase !== "bidding" || !socket) return;
    const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
    if (!userData._id) return;

    socket.emit("place_bid", {
      slug,
      userId: userData._id,
      userName: `${userData.lastName} ${userData.firstName}`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-[#18436E]">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="text-xl font-bold uppercase tracking-widest">
          Auksionga ulanmoqda...
        </p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <Shield className="text-red-500 mb-6" size={80} />
        <h1 className="text-3xl font-black text-[#18436E] uppercase mb-4">
          Ruxsat yo'q
        </h1>
        <p className="text-gray-500 max-w-md mb-8 italic">
          Ushbu auksionga kirish uchun sizning arizangiz tasdiqlangan bo'lishi
          kerak.
        </p>
        <Link
          href="/"
          className="bg-[#18436E] text-white px-8 py-3 rounded-sm font-bold shadow-lg"
        >
          Bosh sahifaga qaytish
        </Link>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-[#18436E] text-white p-4 shadow-xl z-20">
        <div className="max-w-[1440px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="bg-white/10 p-2 rounded-sm border border-white/20 hover:bg-white/20 transition-all"
            >
              <Trophy size={20} className="text-yellow-400" />
            </Link>
            <div>
              <h1 className="text-lg font-black uppercase tracking-tight leading-none">
                {lot.name}
              </h1>
              <p className="text-[10px] text-blue-200 font-bold tracking-widest uppercase">
                Lot №: {lot.lotNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {phase === "prep" && (
              <div className="bg-orange-500 px-4 py-2 rounded-sm flex items-center gap-2">
                <Clock size={16} />
                <span className="text-xs font-black uppercase">
                  Tayyorgarlik faza: {formatTime(timeLeft)}
                </span>
              </div>
            )}
            {phase === "bidding" && (
              <div className="bg-green-600 px-4 py-2 rounded-sm flex items-center gap-2 animate-pulse">
                <Clock size={16} />
                <span className="text-xs font-black uppercase">
                  Savdo faza: {timeLeft}s
                </span>
              </div>
            )}
            {phase === "ended" && (
              <div className="bg-red-600 px-4 py-2 rounded-sm animate-bounce">
                <span className="text-xs font-black uppercase">
                  Auksion tugadi
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-[1440px] mx-auto w-full p-4 gap-4 overflow-hidden">
        {/* Left Side: Lot Info & History */}
        <div className="lg:w-2/3 flex flex-col gap-4 overflow-hidden">
          {/* Price Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-sm shadow-sm border-l-4 border-blue-600">
              <p className="text-[10px] text-gray-400 font-black uppercase mb-1">
                Boshlang'ich narx
              </p>
              <h3 className="text-xl font-black text-gray-500">
                {lot.startPrice?.toLocaleString()} UZS
              </h3>
            </div>
            <div className="bg-white p-6 rounded-sm shadow-sm border-l-4 border-green-600">
              <p className="text-[10px] text-green-600 font-black uppercase mb-1">
                Joriy narx
              </p>
              <h3 className="text-3xl font-black text-[#18436E]">
                {currentPrice?.toLocaleString()} UZS
              </h3>
            </div>
          </div>

          {/* Bidding History */}
          <div className="bg-white flex-1 rounded-sm shadow-sm flex flex-col overflow-hidden border border-gray-200">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="font-black text-[#18436E] uppercase text-sm tracking-tighter">
                Savdolar tarixi
              </h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                <span className="text-[10px] font-bold text-gray-400">
                  Jonli efir
                </span>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/20"
            >
              {bids.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-300">
                  <MessageSquare size={48} className="mb-2 opacity-20" />
                  <p className="italic text-sm">Hozircha takliflar yo'q</p>
                </div>
              ) : (
                bids.map((bid, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-white rounded-sm border border-gray-100 shadow-sm animate-in slide-in-from-bottom-2 duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {bid.userName?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-800">
                          {bid.userName}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {new Date(bid.time).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-green-600">
                        +{lot.firstStep?.toLocaleString()}
                      </p>
                      <p className="text-xs font-bold text-gray-500">
                        {bid.amount?.toLocaleString()} UZS
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Controls Area */}
            <div className="p-6 border-t border-gray-100">
              {phase === "prep" && (
                <div className="bg-orange-50 p-4 rounded-sm border border-orange-100 text-center">
                  <p className="text-orange-700 font-bold">
                    Auksion tayyorgarlik jarayonida. Savdolar{" "}
                    {formatTime(timeLeft)} dan keyin boshlanadi.
                  </p>
                </div>
              )}
              {phase === "bidding" && (
                <div className="space-y-4">
                  {/* Visual Timer Bar */}
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${timeLeft < 10 ? "bg-red-500" : "bg-green-500"}`}
                      style={{ width: `${(timeLeft / 30) * 100}%` }}
                    ></div>
                  </div>
                  <button
                    onClick={handlePlaceBid}
                    className="w-full bg-[#18436E] hover:bg-[#123354] text-white py-5 rounded-sm font-black text-2xl uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-50"
                  >
                    QADAM BOSISH (+{lot.firstStep?.toLocaleString()} UZS)
                  </button>
                </div>
              )}
              {phase === "ended" && (
                <div className="bg-black text-white p-8 rounded-sm text-center">
                  <Trophy className="mx-auto mb-4 text-yellow-400" size={64} />
                  <h2 className="text-3xl font-black uppercase mb-2">
                    Auksion Yakunlandi
                  </h2>
                  <p className="text-xl font-bold">
                    G'olib: {lastBidder?.userName || "Aniqlanmadi"}
                  </p>
                  <button
                    onClick={() => router.push("/")}
                    className="mt-6 bg-white text-black px-8 py-3 rounded-sm font-black uppercase tracking-widest"
                  >
                    Chiqish
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Participant List & Admin Control */}
        <div className="lg:w-1/3 flex flex-col gap-4">
          <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-200">
            <h3 className="font-black text-[#18436E] uppercase text-xs tracking-widest mb-4 border-b pb-2 flex items-center gap-2">
              <User size={14} /> Ishtirokchilar
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 bg-blue-50 border border-blue-100 rounded-sm">
                <Shield size={16} className="text-[#18436E]" />
                <span className="font-bold text-sm text-[#18436E]">
                  Auksion Admini
                </span>
              </div>

              {sessionStorage.getItem("adminToken") ? (
                <div className="p-3 bg-gray-50 rounded-sm italic text-xs text-gray-400">
                  Ishtirokchilar ro'yxati auksion yakunilganda ko'rinadi.
                </div>
              ) : (
                <div className="p-3 bg-gray-50 border border-dashed border-gray-200 rounded-sm flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                  <span className="font-bold text-xs text-gray-500">
                    Siz (Ishtirokchi)
                  </span>
                </div>
              )}
              <p className="text-[9px] text-center text-gray-400 uppercase font-black tracking-widest mt-4">
                Ishtirokchilar maxfiy saqlanadi
              </p>
            </div>
          </div>

          {sessionStorage.getItem("adminToken") && phase !== "ended" && (
            <div className="bg-red-50 p-4 rounded-sm border border-red-200">
              <h3 className="text-red-600 font-black uppercase text-xs mb-4">
                Admin nazorati
              </h3>
              <button
                onClick={handleAdminEnd}
                className="w-full bg-red-600 text-white py-3 rounded-sm font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all"
              >
                Auksionni yakunlash
              </button>
            </div>
          )}

          <div className="bg-[#18436E] p-6 rounded-sm shadow-xl text-white flex flex-col items-center">
            <AlertCircle className="mb-4 text-blue-300" size={48} />
            <h4 className="font-black uppercase tracking-tighter text-lg leading-tight mb-2">
              Muhim Eslatma
            </h4>
            <p className="text-xs text-blue-100 text-center leading-relaxed">
              Har bir qadam bosilgandan so'ng vaqt qayta yangilanadi. Kim oxirgi
              bo'lib qadam bossa, auksion g'olibi xisoblanadi.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
