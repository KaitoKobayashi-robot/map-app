import { MapPinIcon } from "@heroicons/react/16/solid";

type TitleProps = {
  text: string;
};

export const Title = ({ text }: TitleProps) => {
  return (
    <header className="bg-gray-50 p-4 border-b border-gray-200 z-10">
      <div className="flex items-center justify-center gap-x-3">
        <MapPinIcon className="h-7 w-7 text-blue-500" />
        <h1 className="m-0 text-2xl font-bold text-gray-800 tracking-tight">
          {text}
        </h1>
      </div>
    </header>
  );
};
