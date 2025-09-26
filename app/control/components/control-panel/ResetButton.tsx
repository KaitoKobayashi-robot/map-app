interface ResetButtonProps {
  onClick: () => void;
}

const ResetButton = ({ onClick }: ResetButtonProps) => (
  <button
    onClick={onClick}
    className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600"
  >
    リセット
  </button>
);

export default ResetButton;
