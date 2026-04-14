import { styles } from "@/styles/styles";

const data = [
  {
    id: 1,
    image: "/click-logo.png",
  },
  {
    id: 2,
    image: "/payme-logo.png",
  },
  {
    id: 3,
    image: "/oson.png",
  },
  {
    id: 4,
    image: "/paynet-logo.png",
  },
];

export default function Payment() {
  return (
    <div className={`${styles.paddingCont}`}>
      <h2 className={`${styles.h2} mb-10`}>To'lov tizimlari</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {data.map((item) => (
          <div key={item.id} className="flex flex-col items-center gap-2">
            <img className="sm:w-44 w-32" src={item.image} alt={item.title} />
          </div>
        ))}
      </div>
    </div>
  );
}
