interface ResetButtonProps {
  onClick: () => void;
  isResetting: boolean;
}

const ResetButton = ({ onClick, isResetting }: ResetButtonProps) => (
  <button
    onClick={onClick}
    disabled={isResetting}
    className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 disabled:bg-gray-400"
  >
    {isResetting ? "リセット中..." : "リセット"}
  </button>
);

export default ResetButton;
