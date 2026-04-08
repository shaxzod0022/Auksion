import { styles } from "@/styles/styles";

const categories = [
  {
    id: 1,
    title:
      "Elektron savdolarni tashkil etish va o‘tkazish tartibi O‘zbekiston Respublikasining mulkni sotish sohasidagi qonunchilik hujjatlariga to‘liq mos keladi.",
    image: "/lot_about1.png",
  },
  {
    id: 2,
    title:
      "Ishonchli va samarali. Barcha auksionlar eng zamonaviy IT-yechimlar bilan himoyalangan. Savdo maydonchasi muntazam yangilanadi va texnik jihatdan qo‘llab-quvvatlanadi.",
    image: "/lot_about2.png",
  },
  {
    id: 3,
    title:
      "Ko‘chmas mulk savdosi bo‘yicha yetakchi internet portallari bilan integratsiya va o‘zaro hamkorlik yo‘lga qo‘yilgan.",
    image: "/lot_about3.png",
  },
  {
    id: 4,
    title:
      "Keng qamrovli ishtirokchilar bazasi: har haftalik yangi lotlar to‘g‘risida elektron pochta orqali muntazam xabarnomalar yuboriladi.",
    image: "/lot_about4.png",
  },
  {
    id: 5,
    title:
      "Dunyoning istalgan nuqtasidan turib savdolarda ishtirok etish imkoniyati.",
    image: "/lot_about6.png",
  },
  {
    id: 6,
    title: "Biz qariyb 30 yillik boy tajribaga egamiz.",
    image: "/lot_about7.png",
  },
  {
    id: 7,
    title:
      "Mulklarni savdoga chiqarishda savdooldi hujjatlarini tayyorlashga yaqindan yordam beramiz.",
    image: "/lot_about8.png",
  },
  {
    id: 8,
    title:
      "Xavfsiz shartnoma. Biz barcha sotuvchilarni va taqdim etilgan hujjatlarni sinchiklab tekshiramiz.",
    image: "/lot_about5.png",
  },
];

export default function AboutUs() {
  return (
    <div className={`${styles.paddingCont}`}>
      <h2 className={`${styles.h2} mb-5`}>
        Biz boshqalardan qanday farq qilamiz?
      </h2>
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-5`}>
        {categories.map((category) => (
          <div
            key={category.id}
            className={`${styles.flex} items-center gap-3`}
          >
            <img
              src={category.image}
              alt={category.title}
              className="w-12 sm:w-20 h-12 sm:h-20 object-contain"
            />
            <p className={`${styles.p}`}>{category.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
