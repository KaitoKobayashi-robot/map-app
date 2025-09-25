interface SubmitButtonProps {
  isSubmitting: boolean;
  onClick: () => void;
}

const SubmitButton = ({ isSubmitting, onClick }: SubmitButtonProps) => (
  <button
    onClick={onClick}
    disabled={isSubmitting}
    className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
  >
    {isSubmitting ? "更新中..." : "泥棒を出没させる"}
  </button>
);

export default SubmitButton;
