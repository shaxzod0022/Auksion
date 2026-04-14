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
  Trash2,
} from "lucide-react";

export default function AdminAuctionRoom({ params }) {
  const { slug } = use(params);
  const router = useRouter();
  const [lot, setLot] = useState(null);
  const [loading, setLoading] = useState(true);

  const [socket, setSocket] = useState(null);
  const [phase, setPhase] = useState("loading");
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [bids, setBids] = useState([]);
  const [lastBidder, setLastBidder] = useState(null);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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
        setLot(lotData);

        const socketInstance = io(
          "https://considerate-integrity-production.up.railway.app",
        );
        setSocket(socketInstance);

        socketInstance.emit("join_auction", { slug, isAdmin: true });

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

        socketInstance.on("auction_ended", () => {
          setPhase("ended");
        });

        return () => socketInstance.disconnect();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initAdminAuction();
  }, [slug, router]);

  const handleAdminEnd = () => {
    if (
      socket &&
      window.confirm("Haqiqatan ham auksionni hoziroq yakunlamoqchimisiz?")
    ) {
      socket.emit("admin_end_auction", { slug });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-[#18436E]">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="text-xl font-bold uppercase tracking-widest">
          Admin boshqaruv paneli ulanmoqda...
        </p>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-sm shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 text-white p-2 rounded-sm">
            <ShieldAlert />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-800 uppercase leading-none">
              {lot.name} (ADMIN NAZORATI)
            </h1>
            <span className="text-xs font-bold text-gray-400">
              LOT №: {lot.lotNumber}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {phase === "prep" && (
            <span className="bg-orange-500 text-white px-4 py-2 rounded-sm text-xs font-black uppercase">
              TAYYORGARLIK: {formatTime(timeLeft)}
            </span>
          )}
          {phase === "bidding" && (
            <span className="bg-green-600 text-white px-4 py-2 rounded-sm text-xs font-black uppercase animate-pulse">
              SAVDO: {timeLeft}s
            </span>
          )}
          {phase === "ended" && (
            <span className="bg-gray-800 text-white px-4 py-2 rounded-sm text-xs font-black uppercase">
              Auksion Yakunlangan
            </span>
          )}

          {phase !== "ended" && (
            <button
              onClick={handleAdminEnd}
              className="bg-red-600 text-white px-6 py-2 rounded-sm text-xs font-black uppercase hover:bg-red-700 transition-all shadow-md"
            >
              Auksionni Yakunlash
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: General Stats */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-100">
            <p className="text-[10px] text-gray-400 font-black uppercase mb-2">
              Hozirgi Narx
            </p>
            <h3 className="text-2xl font-black text-[#18436E]">
              {currentPrice?.toLocaleString()} UZS
            </h3>
          </div>
          <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-100">
            <p className="text-[10px] text-gray-400 font-black uppercase mb-2">
              Oxirgi Qadam Egasi
            </p>
            <h3 className="text-lg font-black text-green-600 truncate">
              {lastBidder?.userName || "---"}
            </h3>
          </div>
          <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-100">
            <h4 className="text-xs font-black uppercase text-gray-400 border-b pb-2 mb-3">
              Lot Ma'lumotlari
            </h4>
            <div className="space-y-2 text-xs font-bold">
              <div className="flex justify-between">
                <span>Boshlang'ich:</span>{" "}
                <span>{lot.startPrice?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Qadam:</span>{" "}
                <span>{lot.firstStep?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Live Bids Log */}
        <div className="lg:col-span-3 bg-white rounded-sm shadow-sm border border-gray-100 flex flex-col h-[70vh]">
          <div className="p-4 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-black text-[#18436E] uppercase text-sm">
              Savdolar va Harakatlar Jurnali
            </h3>
            <span className="text-[10px] text-gray-400 uppercase font-bold">
              Jonli Yangilanmoqda
            </span>
          </div>
          <div
            ref={scrollRef}
            className="flex-1 p-4 overflow-y-auto space-y-2 bg-gray-50/30 font-mono text-sm"
          >
            {bids.map((bid, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-white p-3 border-l-4 border-blue-500 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <span className="text-gray-400">
                    [{new Date(bid.time).toLocaleTimeString()}]
                  </span>
                  <span className="font-bold text-gray-700">
                    {bid.userName}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-green-600 font-black">
                    +{lot.firstStep?.toLocaleString()}
                  </span>
                  <span className="font-black text-[#18436E]">
                    {bid.amount?.toLocaleString()} UZS
                  </span>
                </div>
              </div>
            ))}
            {bids.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-gray-300">
                <MessageSquare size={32} className="opacity-20 mb-2" />
                <p>Hozircha hech qanday harakat yo'q</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
