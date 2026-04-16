import { styles } from "@/styles/styles";

const data = [
  {
    id: 1,
    image: "/ico-19.png",
    title: "Joriy auksionlar",
    count: 45,
  },
  {
    id: 2,
    image: "/ico-20.png",
    title: "Kelgusi auksionlar",
    count: 50,
  },
  {
    id: 3,
    image: "/ico-21.png",
    title: "Yakunlangan auksionlar",
    count: 30,
  },
  {
    id: 4,
    image: "/ico-22.png",
    title: "Ishtirokchilar",
    count: 64,
  },
];

export default function Statistica() {
  return (
    <div className={`${styles.paddingCont}`}>
      <h2 className={`${styles.h2} mb-10`}>Statistika</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {data.map((item) => (
          <div key={item.id} className="flex flex-col items-center gap-2">
            <img className="sm:w-16 w-12" src={item.image} alt={item.title} />
            <div className="w-full h-px bg-[#18436E]"></div>
            <span
              className={`${styles.span} text-gray-500 uppercase tracking-wider`}
            >
              {item.title}
            </span>
            <span className={`${styles.h2} font-extrabold text-[#18436E]`}>
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
