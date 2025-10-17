import { MapPinIcon } from "@heroicons/react/16/solid";
import Image from "next/image";

type TitleProps = {
  text: string;
};

export const Title = ({ text }: TitleProps) => {
  return (
    <header className=" hover:scale-110 hover:rounded-3xl hover:border-b-3 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] container mx-auto rounded-2xl bg-white/20 backdrop-blur-md p-6 border-b-2 border-white/30 shadow-lg">
      <div
        className="flex items-center justify-center gap-x-3"
        onClick={() => {}}
      >
        <MapPinIcon className="h-7 w-7 text-black" />
        <h1 className="m-0 text-2xl font-bold">{text}</h1>
      </div>
    </header>
  );
};
