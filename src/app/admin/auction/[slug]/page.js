"use client";
import { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import lotService from "@/services/lotService";
import {
  Loader2,
  Trophy,
  MessageSquare,
  Clock,
  ShieldAlert,
  User,
  Play,
  Download,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function AdminAuctionRoom({ params }) {
  const { slug } = use(params);
  const router = useRouter();
  const [lot, setLot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tooEarly, setTooEarly] = useState(false);

  const [socket, setSocket] = useState(null);
  const [phase, setPhase] = useState("waiting");
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [bids, setBids] = useState([]);
  const [lastBidder, setLastBidder] = useState(null);
  const [protocolId, setProtocolId] = useState(null);
  const [participants, setParticipants] = useState([]);

  const bidsEndRef = useRef(null);

  useEffect(() => {
    if (bidsEndRef.current) {
      bidsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [bids]);

  useEffect(() => {
    const initAdminAuction = async () => {
      try {
        const adminToken = sessionStorage.getItem("adminToken");
        if (!adminToken) {
          router.push("/admin/login");
          return;
        }

        const lotData = await lotService.getLotBySlug(slug);
        if (!lotData) {
          router.push("/admin/lots");
          return;
        }

        // Check start time
        const now = new Date().getTime();
        const start = new Date(lotData.startDate).getTime();
        if (now < start) {
          setLot(lotData);
          setTooEarly(true);
          setLoading(false);
          return;
        }

        setLot(lotData);
        setCurrentPrice(lotData.startPrice);

        const socketInstance = io("http://localhost:8080");
        setSocket(socketInstance);

        // LISTENERS BEFORE EMIT TO ENSURE STATE IS CAPTURED ON RECONNECT/REFRESH
        socketInstance.on("auction_state", (state) => {
          setPhase(state.phase);
          setTimeLeft(state.timeLeft);
          setCurrentPrice(state.currentPrice);
          setBids(state.bids || []);
          setLastBidder(state.lastBidder);
          setParticipants(state.participants || []);
        });

        socketInstance.on("participants_update", (data) => {
          setParticipants(data.participants || []);
        });

        socketInstance.on("timer_update", (data) => {
          setTimeLeft(data.timeLeft);
        });

        socketInstance.on("phase_change", (data) => {
          setPhase(data.phase);
          setTimeLeft(data.timeLeft);
        });

        socketInstance.on("new_bid", (data) => {
          setCurrentPrice(data.currentPrice);
          setLastBidder(data.lastBidder);
          setBids(data.bids || []);
          setTimeLeft(data.timeLeft);
        });

        socketInstance.on("auction_ended", (data) => {
          setPhase("ended");
          setLastBidder(data.winner);
          setCurrentPrice(data.finalPrice);
          setProtocolId(data.protocolId);
        });

        socketInstance.emit("join_auction", {
          slug,
          isAdmin: true,
          userId: "admin",
          userName: "Admin",
        });

        return () => socketInstance.disconnect();
      } catch (err) {
        console.error("Admin auction init error:", err);
      } finally {
        setLoading(false);
      }
    };

    initAdminAuction();
  }, [slug, router]);

  const handleStartAuction = () => {
    if (socket && phase === "waiting") {
      socket.emit("admin_start_auction", { slug });
    }
  };

  const handleAdminEnd = () => {
    if (
      socket &&
      window.confirm("Haqiqatan ham auksionni hoziroq yakunlamoqchimisiz?")
    ) {
      socket.emit("admin_end_auction", { slug });
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-[#18436E]">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="text-xl font-bold uppercase tracking-widest">
          Admin boshqaruvi ulanmoqda...
        </p>
      </div>
    );
  }

  if (tooEarly) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <Clock className="text-orange-500 mb-6" size={80} />
        <h1 className="text-3xl font-black text-[#18436E] uppercase mb-4">
          Hali vaqt bor
        </h1>
        <p className="text-gray-500 max-w-md mb-3 italic">
          Bu auksion boshlanish vaqti:
        </p>
        <p className="text-[#18436E] font-black text-xl mb-8">
          {lot && new Date(lot.startDate).toLocaleString("uz-UZ")}
        </p>
        <Link
          href="/admin/lots"
          className="bg-[#18436E] text-white px-8 py-3 rounded-sm font-bold shadow-lg"
        >
          Lotlarga qaytish
        </Link>
      </div>
    );
  }

  const stepValue = lot
    ? Math.floor((lot.startPrice * lot.firstStep) / 100)
    : 0;

  return (
    <div className="h-screen bg-gray-100 flex flex-col font-sans overflow-hidden">
      {/* Admin Header */}
      <header className="bg-[#0f172a] text-white p-4 shadow-xl">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/lots"
              className="bg-white/10 p-2 rounded-sm border border-white/20 hover:bg-white/20 transition-all"
            >
              <ShieldAlert size={20} className="text-blue-400" />
            </Link>
            <div>
              <h1 className="text-lg font-black uppercase tracking-tight leading-none">
                {lot?.name}{" "}
                <span className="text-gray-400 text-sm">(ADMIN NAZORATI)</span>
              </h1>
              <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                Lot №: {lot?.lotNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {phase === "waiting" && (
              <div className="bg-blue-600 px-4 py-2 rounded-sm flex items-center gap-2">
                <Clock size={16} />
                <span className="text-xs font-black uppercase">
                  Ishtirokchilar kutilmoqda
                </span>
              </div>
            )}
            {phase === "prep" && (
              <div className="bg-orange-500 px-4 py-2 rounded-sm flex items-center gap-2">
                <Clock size={16} />
                <span className="text-xs font-black uppercase">
                  TAYYORGARLIK: {formatTime(timeLeft)}
                </span>
              </div>
            )}
            {phase === "bidding" && (
              <div className="bg-green-600 px-4 py-2 rounded-sm flex items-center gap-2 animate-pulse font-mono">
                <Clock size={16} />
                <span className="text-xs font-black uppercase">
                  SAVDO: {timeLeft}s
                </span>
              </div>
            )}
            {phase === "finished_waiting" && (
              <div className="bg-yellow-600 px-4 py-2 rounded-sm flex items-center gap-2">
                <Clock size={16} />
                <span className="text-xs font-black uppercase">
                  NATIJA TASDIQLANISHI KUTILMOQDA
                </span>
              </div>
            )}
            {phase === "ended" && (
              <div className="bg-red-700 px-4 py-2 rounded-sm">
                <span className="text-xs font-black uppercase">
                  Auksion Yakunlangan
                </span>
              </div>
            )}

            {phase !== "ended" && (
              <button
                onClick={handleAdminEnd}
                className={`px-5 py-2 rounded-sm text-xs font-black uppercase transition-all shadow-md ${
                  phase === "finished_waiting"
                    ? "bg-yellow-500 text-black hover:bg-yellow-600"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {phase === "finished_waiting"
                  ? "TASDIQLASH VA YAKUNLASH"
                  : "YAKUNLASH"}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full p-4 gap-4 overflow-hidden min-h-0">
        {/* Left: Lot Info + Controls */}
        <div className="lg:w-1/4 flex flex-col gap-4 overflow-y-auto h-full pr-1">
          {/* Stats */}
          <div className="bg-white p-5 rounded-sm shadow-sm border border-gray-200">
            <p className="text-[10px] text-gray-400 font-black uppercase mb-1">
              Boshlang'ich narx
            </p>
            <h3 className="text-xl font-black text-gray-500">
              {lot?.startPrice?.toLocaleString()} UZS
            </h3>
          </div>
          <div className="bg-white p-5 rounded-sm shadow-sm border border-gray-200">
            <p className="text-[10px] text-green-600 font-black uppercase mb-1">
              Joriy narx
            </p>
            <h3 className="text-3xl font-black text-[#18436E]">
              {currentPrice?.toLocaleString()} UZS
            </h3>
          </div>
          <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-100">
            <h4 className="text-xs font-black uppercase text-gray-400 border-b pb-2 mb-3">
              Lot ma'lumotlari
            </h4>
            <div className="space-y-2 text-xs font-bold">
              <div className="flex justify-between">
                <span className="text-gray-500">Qadam:</span>
                <span className="text-[#18436E]">
                  {lot?.firstStep}% ({stepValue.toLocaleString()} UZS)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Zakalat:</span>
                <span className="text-[#18436E]">{lot?.deposit}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Lot raqami:</span>
                <span>{lot?.lotNumber}</span>
              </div>
            </div>
          </div>

          {/* Admin Action Panel */}
          {phase === "waiting" && (
            <button
              onClick={handleStartAuction}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-5 rounded-sm font-black text-lg uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95"
            >
              <Play size={24} fill="currentColor" />
              AUKSIONNI BOSHLASH
            </button>
          )}

          {phase === "prep" && (
            <div className="bg-orange-50 p-6 rounded-sm border-2 border-dashed border-orange-300 text-center">
              <p className="text-orange-700 font-black uppercase text-sm mb-2">
                Tayyorgarlik bosqichi
              </p>
              <div className="text-5xl font-black text-orange-600">
                {formatTime(timeLeft)}
              </div>
            </div>
          )}

          {phase === "bidding" && (
            <div className="bg-green-50 p-6 rounded-sm border border-green-200 text-center">
              <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full transition-all duration-1000 ${timeLeft < 10 ? "bg-red-500" : "bg-green-500"}`}
                  style={{ width: `${(timeLeft / 180) * 100}%` }}
                />
              </div>
              <p className="text-green-700 font-black uppercase text-sm mb-1">
                Keyingi qadamgacha
              </p>
              <div className="text-5xl font-black text-green-600">
                {timeLeft}s
              </div>
              <button
                onClick={handleAdminEnd}
                className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-sm font-black text-xs uppercase tracking-widest shadow-lg transition-all"
              >
                SAVDONI TO'XTATISH
              </button>
            </div>
          )}

          {phase === "finished_waiting" && (
            <div className="bg-yellow-50 p-6 rounded-sm border-2 border-dashed border-yellow-400 text-center space-y-4">
              <Trophy className="mx-auto text-yellow-600" size={48} />
              <div>
                <p className="text-yellow-800 font-black uppercase text-sm mb-1">
                  Vaqt Tugadi
                </p>
                <p className="text-xs text-yellow-600 font-bold">
                  G'olib natijasini tasdiqlang
                </p>
              </div>
              <button
                onClick={handleAdminEnd}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-sm font-black text-sm uppercase tracking-widest shadow-xl transition-all transform hover:scale-105 active:scale-95"
              >
                AUKSIONNI YAKUNLASH
              </button>
              <p className="text-[10px] text-gray-500 font-medium italic">
                Bayonnoma avtomatik rasmiylashtirilgan.
              </p>
            </div>
          )}

          {phase === "ended" && lastBidder && protocolId && (
            <a
              href={`http://localhost:8080/api/protocol/${protocolId}/download`}
              download
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-sm font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-colors shadow-lg"
            >
              <Download size={18} />
              BAYONNOMANI YUKLASH (PDF)
            </a>
          )}
        </div>

        {/* Center: Live Bids Log */}
        <div className="lg:flex-1 bg-white rounded-sm shadow-sm border border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
              <h3 className="font-black text-[#18436E] uppercase text-sm">
                Savdolar Jurnali (Admin View)
              </h3>
            </div>
            <span className="text-[10px] text-gray-400 uppercase font-bold">
              Jonli Yangilanmoqda
            </span>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-gray-50/30 font-mono text-sm">
            {bids.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-300 py-20">
                <MessageSquare size={32} className="opacity-20 mb-2" />
                <p>Hozircha hech qanday harakat yo'q</p>
              </div>
            ) : (
              bids.map((bid, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-white p-3 border-l-4 border-blue-500 shadow-sm rounded-r-sm"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 text-xs">
                      [{new Date(bid.time).toLocaleTimeString()}]
                    </span>
                    <span className="font-bold text-gray-700">
                      {bid.userName}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-green-600 font-black">
                      +{stepValue.toLocaleString()}
                    </span>
                    <span className="font-black text-[#18436E]">
                      {bid.amount?.toLocaleString()} UZS
                    </span>
                  </div>
                </div>
              ))
            )}
            <div ref={bidsEndRef} />
          </div>

          {/* Winner Banner */}
          {phase === "ended" && (
            <div className="p-6 bg-[#0f172a] text-white text-center border-t-4 border-yellow-500">
              <Trophy className="mx-auto mb-3 text-yellow-400" size={40} />
              <h2 className="text-2xl font-black uppercase mb-2">
                Auksion Yakunlandi
              </h2>
              <p className="text-lg font-bold text-yellow-400">
                {lastBidder?.userName || "G'olib aniqlanmadi"}
              </p>
              <p className="text-2xl font-black mt-2">
                {currentPrice?.toLocaleString()} UZS
              </p>
            </div>
          )}
        </div>

        {/* Right: Participants */}
        <div className="lg:w-1/5 flex flex-col gap-4 h-full overflow-y-auto pr-1">
          <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-200">
            <h3 className="font-black text-[#18436E] uppercase text-[10px] tracking-widest mb-4 border-b pb-2 flex items-center gap-2">
              <User size={14} /> ISHTIROKCHILAR
            </h3>
            {participants.length === 0 ? (
              <p className="text-xs text-gray-400 italic text-center py-4">
                Ishtirokchilar kutilmoqda...
              </p>
            ) : (
              <div className="space-y-2">
                {participants.map((p, idx) => {
                  const isWinner = lastBidder?.userId === p.userId;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 p-2 rounded-sm text-xs font-bold border ${isWinner ? "bg-yellow-50 border-yellow-300 text-yellow-700" : "bg-gray-50 border-gray-100 text-gray-700"}`}
                    >
                      <CheckCircle2
                        size={14}
                        className={
                          isWinner ? "text-yellow-500" : "text-green-400"
                        }
                      />
                      <span className="truncate">{p.userName}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-[#0f172a] p-5 rounded-sm text-white">
            <AlertCircle className="mb-3 text-blue-400" size={32} />
            <h4 className="font-black uppercase text-sm mb-2">
              Savdo Qoidalari
            </h4>
            <div className="text-[10px] text-gray-400 space-y-1 leading-relaxed">
              <p>
                • Qadam: {lot?.firstStep}% ({stepValue.toLocaleString()} UZS)
              </p>
              <p>• Har qadamdan keyin 180 soniya (3 daqiqa) qayta sanaladi</p>
              <p>• Vaqt tugasa oxirgi qadam egasi g'olib</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
