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
  Play,
  Download,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function AuctionRoom({ params }) {
  const { slug } = use(params);
  const router = useRouter();
  const [lot, setLot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);
  const [tooEarly, setTooEarly] = useState(false);

  // Socket states
  const [socket, setSocket] = useState(null);
  const [phase, setPhase] = useState("loading"); // waiting, prep, bidding, ended
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [bids, setBids] = useState([]);
  const [lastBidder, setLastBidder] = useState(null);
  const [protocolId, setProtocolId] = useState(null);
  const [error, setError] = useState("");

  const bidsEndRef = useRef(null);

  useEffect(() => {
    if (bidsEndRef.current) {
      bidsEndRef.current.scrollIntoView({ behavior: "smooth" });
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

        // Check entry time
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

        const adminToken = sessionStorage.getItem("adminToken");
        const userToken = sessionStorage.getItem("userToken");
        const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");

        const token = adminToken || userToken;
        if (!token) {
          router.push("/login");
          return;
        }

        const isAdm = !!adminToken;
        setIsAdmin(isAdm);
        setUserId(userData._id);

        if (isAdm) {
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
          "https://considerate-integrity-production.up.railway.app",
        );
        setSocket(socketInstance);

        // ALWAYS SET LISTENERS BEFORE EMITTING JOIN TO AVOID RACE CONDITIONS ON REFRESH
        socketInstance.on("auction_state", (state) => {
          setPhase(state.phase);
          setTimeLeft(state.timeLeft);
          setCurrentPrice(state.currentPrice);
          setBids(state.bids);
          setLastBidder(state.lastBidder);
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
          setBids(data.bids);
          setTimeLeft(data.timeLeft);
        });

        socketInstance.on("auction_ended", (data) => {
          setPhase("ended");
          setLastBidder(data.winner);
          setCurrentPrice(data.finalPrice);
          setProtocolId(data.protocolId);
        });

        socketInstance.on("error", (msg) => setError(msg));

        socketInstance.emit("join_auction", {
          slug,
          isAdmin: isAdm,
          userId: userData._id,
          userName: isAdm
            ? "Admin"
            : `${userData.lastName} ${userData.firstName}`,
        });

        return () => socketInstance.disconnect();
      } catch (err) {
        console.error("Auction init error:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuction();
  }, [slug, router]);

  const handleStartAuction = () => {
    if (socket && isAdmin && phase === "waiting") {
      socket.emit("admin_start_auction", { slug });
    }
  };

  const handlePlaceBid = () => {
    if (phase !== "bidding" || !socket || isAdmin) return;
    const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");

    socket.emit("place_bid", {
      slug,
      userId: userData._id,
      userName: `${userData.lastName} ${userData.firstName}`,
    });
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
        <p className="text-xl font-bold uppercase tracking-widest text-center">
          Auksionga ulanmoqda...
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
        <p className="text-gray-500 max-w-md mb-8 italic">
          Ushbu auksion boshlanish vaqti : <br />
          <span className="text-[#18436E] font-black not-italic text-lg">
            {new Date(lot.startDate).toLocaleString()}
          </span>
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

  const stepValue = Math.floor((lot.startPrice * lot.firstStep) / 100);

  return (
    <div className="h-screen bg-gray-100 flex flex-col font-sans overflow-hidden">
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
            {phase === "waiting" && (
              <div className="bg-blue-600 px-4 py-2 rounded-sm flex items-center gap-2">
                <Clock size={16} />
                <span className="text-xs font-black uppercase">
                  Savdo boshlanishini kuting
                </span>
              </div>
            )}
            {phase === "prep" && (
              <div className="bg-orange-500 px-4 py-2 rounded-sm flex items-center gap-2">
                <Clock size={16} />
                <span className="text-xs font-black uppercase">
                  Tayyorgarlik faza: {formatTime(timeLeft)}
                </span>
              </div>
            )}
            {phase === "bidding" && (
              <div className="bg-green-600 px-4 py-2 rounded-sm flex items-center gap-2 animate-pulse font-mono">
                <Clock size={16} />
                <span className="text-xs font-black uppercase">
                  Vaqt: {timeLeft}s
                </span>
              </div>
            )}
            {phase === "finished_waiting" && (
              <div className="bg-yellow-600 px-4 py-2 rounded-sm flex items-center gap-2">
                <Clock size={16} />
                <span className="text-xs font-black uppercase">
                  Natija kutilmoqda...
                </span>
              </div>
            )}
            {phase === "ended" && (
              <div className="bg-red-600 px-4 py-2 rounded-sm">
                <span className="text-xs font-black uppercase">
                  Auksion tugadi
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-[1440px] mx-auto w-full p-4 gap-4 overflow-hidden relative min-h-0">
        {/* Left Side: Lot Info & History */}
        <div className="lg:w-2/3 flex flex-col gap-4 overflow-hidden h-full">
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
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  Jonli efir
                </span>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/20">
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
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                        {isAdmin ? bid.userName?.[0] : i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-800">
                          {isAdmin
                            ? bid.userName
                            : bid.userId === userId
                              ? "Sizning qadamingiz"
                              : bid.alias || "Ishtirokchi"}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {new Date(bid.time).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-green-600">
                        +{stepValue.toLocaleString()}
                      </p>
                      <p className="text-xs font-bold text-gray-500">
                        {bid.amount?.toLocaleString()} UZS
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={bidsEndRef} />
            </div>

            {/* Controls Area */}
            <div className="p-10 border-t border-gray-100">
              {phase === "waiting" && (
                <div className="text-center space-y-4">
                  <Clock className="mx-auto text-blue-400 w-16 h-16 animate-pulse" />
                  <p className="text-lg font-black text-[#18436E] uppercase tracking-tighter">
                    {isAdmin
                      ? "Ishtirokchilar yig'ilishini kuting"
                      : "Savdo boshlanishini kuting"}
                  </p>
                  {isAdmin && (
                    <button
                      onClick={handleStartAuction}
                      className="bg-green-600 hover:bg-green-700 text-white px-10 py-5 rounded-sm font-black text-xl uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 mx-auto transition-all transform hover:scale-105 active:scale-95"
                    >
                      <Play size={24} fill="currentColor" />
                      AUKSIONNI BOSHLASH
                    </button>
                  )}
                </div>
              )}
              {phase === "prep" && (
                <div className="bg-orange-50 p-8 rounded-sm border-2 border-dashed border-orange-200 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Clock size={80} />
                  </div>
                  <h3 className="text-2xl font-black text-orange-600 uppercase mb-2">
                    TAYYORGARLIK BOSQICHI
                  </h3>
                  <p className="text-orange-700 font-bold text-lg mb-6">
                    Savdolar boshlanishiga sanoq ketmoqda
                  </p>
                  <div className="text-6xl font-black text-orange-600 tabular-nums">
                    {formatTime(timeLeft)}
                  </div>
                </div>
              )}
              {phase === "bidding" && (
                <div className="space-y-6">
                  {/* Visual Timer Bar */}
                  <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                    <div
                      className={`h-full transition-all duration-1000 ${timeLeft < 10 ? "bg-red-500" : "bg-green-500"}`}
                      style={{ width: `${(timeLeft / 180) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <button
                      onClick={handlePlaceBid}
                      disabled={isAdmin}
                      className="w-full bg-[#18436E] hover:bg-[#123354] text-white py-6 rounded-sm font-black text-3xl uppercase tracking-widest shadow-2xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group flex flex-col items-center gap-1"
                    >
                      QADAM BOSISH
                      <span className="text-sm font-bold opacity-60">
                        +{lot.firstStep}% ({stepValue.toLocaleString()} UZS)
                      </span>
                    </button>
                    {isAdmin && (
                      <p className="mt-3 text-red-500 font-bold text-sm bg-red-50 px-4 py-2 rounded-sm border border-red-100">
                        Admin qadam bosa olmaydi, faqat nazorat qiladi.
                      </p>
                    )}
                  </div>
                </div>
              )}
              {phase === "finished_waiting" && (
                <div className="bg-yellow-50 p-10 rounded-sm border-2 border-dashed border-yellow-300 text-center space-y-4">
                  <div className="inline-block p-4 bg-yellow-100 rounded-full text-yellow-600 animate-bounce">
                    <Trophy size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-yellow-700 uppercase">
                    SAVDO YAKUNLANMOQDA
                  </h3>
                  <p className="text-yellow-800 font-bold text-lg">
                    Vaqt tugadi. Admin tomonidan g'oliblik tasdiqlanishini
                    kuting.
                  </p>
                  <div className="bg-white p-4 rounded-sm border border-yellow-200 inline-block">
                    <p className="text-xs text-gray-400 uppercase font-black mb-1">
                      Oxirgi holat
                    </p>
                    <p className="text-xl font-black text-[#18436E]">
                      {lastBidder
                        ? isAdmin
                          ? lastBidder.userName
                          : lastBidder.userId === userId
                            ? "Sizning qadamingiz"
                            : lastBidder.alias
                        : "Ishtirokchi yo'q"}
                    </p>
                    <p className="text-2xl font-black text-green-600">
                      {currentPrice?.toLocaleString()} UZS
                    </p>
                  </div>
                </div>
              )}
              {phase === "ended" && (
                <div className="bg-[#0f172a] text-white p-10 rounded-sm text-center shadow-2xl border-b-8 border-yellow-500">
                  <div className="inline-block p-4 bg-yellow-500 rounded-full mb-6 text-black">
                    <Trophy size={64} />
                  </div>
                  <h2 className="text-4xl font-black uppercase mb-4 tracking-tighter">
                    Auksion Yakunlandi
                  </h2>
                  <div className="bg-white/10 p-6 rounded-sm mb-8 inline-block min-w-[300px]">
                    <p className="text-gray-400 text-xs font-bold uppercase mb-2 tracking-widest">
                      G'olib ishtirokchi
                    </p>
                    <p className="text-2xl font-black text-yellow-400">
                      {lastBidder
                        ? isAdmin
                          ? lastBidder.userName
                          : lastBidder.userId === userId
                            ? "Sizning qadamingiz"
                            : lastBidder.alias
                        : "Aniqlanmadi"}
                    </p>
                    <p className="text-4xl font-black mt-4 text-white">
                      {currentPrice?.toLocaleString()}{" "}
                      <span className="text-lg">SO'M</span>
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 max-w-sm mx-auto">
                    {(isAdmin ||
                      (lastBidder && lastBidder.userId === userId)) &&
                      protocolId && (
                        <a
                          href={`https://considerate-integrity-production.up.railway.app/api/protocol/${protocolId}/download`}
                          download
                          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-colors shadow-lg"
                        >
                          <Download size={20} />
                          BAYONNOMANI YUKLAB OLISH (PDF)
                        </a>
                      )}
                    <button
                      onClick={() => router.push("/")}
                      className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-sm font-bold uppercase tracking-widest transition-colors"
                    >
                      SAVDODAN CHIQISH
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Participant List & Admin Control */}
        <div className="lg:w-1/3 flex flex-col gap-4 h-full overflow-y-auto pr-1">
          <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-200">
            <h3 className="font-black text-[#18436E] uppercase text-[10px] tracking-widest mb-4 border-b pb-2 flex items-center gap-2">
              <User size={14} /> ISHTIROKCHILAR RO'YXATI
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-sm">
                <Shield size={16} className="text-[#18436E]" />
                <span className="font-bold text-xs text-[#18436E]">
                  AUKSION ADMINI (ONLINE)
                </span>
              </div>

              {isAdmin ? (
                <div className="space-y-2">
                  <p className="text-[10px] text-gray-400 uppercase font-black px-2 mt-4">
                    Jonli ishtirokchilar
                  </p>
                  {/* In a real scenario we'd track online participants specifically via socket, 
                        but for now we show who has bid at least */}
                  {Array.from(new Set(bids.map((b) => b.userId))).map((uid) => {
                    const userBid = bids.find((b) => b.userId === uid);
                    return (
                      <div
                        key={uid}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-sm border border-gray-100"
                      >
                        <CheckCircle2 size={16} className="text-green-500" />
                        <span className="font-bold text-xs text-gray-700 uppercase">
                          {userBid.userName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 border border-dashed border-gray-200 rounded-sm text-center">
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest leading-relaxed">
                    Xavfsizlik maqsadida ishtirokchilar <br /> ma'lumotlari
                    yashirilgan
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#18436E] p-8 rounded-sm shadow-xl text-white flex flex-col items-center">
            <AlertCircle className="mb-4 text-blue-300" size={48} />
            <h4 className="font-black uppercase tracking-tighter text-lg leading-tight mb-2">
              Savdo Qoidalari
            </h4>
            <div className="text-[12px] text-blue-100 text-center leading-relaxed space-y-2 opacity-80">
              <p>
                1. Asosiy qoida - auksion tugamagunicha sahifadan chiqib ketmang
                aks holda qayta auksionga qo'shila olmaysiz.
              </p>
              <p>2. Har bir qadam {lot.firstStep}% ni tashkil etadi.</p>
              <p>
                3. Qaysidur ishtirokchi qadam bosganida vaqt{" "}
                {timeLeft > 0 ? 180 : 0} soniya (3 daqiqa) qayta sanaladi va bu
                vaqt ichida siz o'z qadamizni bosishingiz mumkin.
              </p>
              <p>
                4. Berilgan 3 daqiqa vaqt tugaguncha hech bir ishtirokchi qadam
                bosmasa, oxirgi qadam egasi g'olib hisoblanadi.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Error Overlay */}
      {error && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-6 text-center backdrop-blur-sm">
          <div className="bg-white p-8 rounded-sm max-w-sm">
            <Shield className="text-red-600 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-black text-gray-900 mb-2 uppercase">
              Xatolik yuz berdi
            </h3>
            <p className="text-gray-500 text-sm mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white w-full py-3 rounded-sm font-bold"
            >
              Qaytadan yuklash
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
