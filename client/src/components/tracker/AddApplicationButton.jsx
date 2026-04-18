const AddApplicationButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center text-2xl z-40"
      title="Add new application"
    >
      +
    </button>
  );
};

export default AddApplicationButton;
