export default function BtnBlue({ text, myClass, onClick, disabled, type = "submit" }) {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`bg-[#18436E] py-2 px-10 text-lg font-medium cursor-pointer hover:bg-[#18436E]/80 hover:text-white text-white transition-all duration-200 active:bg-[#18436E]/80 focus:bg-[#18436E]/80 focus:text-white disabled:opacity-50 disabled:cursor-not-allowed ${myClass}`}
    >
      {text}
    </button>
  );
}
