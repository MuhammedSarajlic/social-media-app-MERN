import { Link } from "react-router-dom";

const Friend = ({ friend }) => {
  return (
    <Link
      to={`/${friend?.username}`}
      className="flex items-center py-1 px-4 space-x-4 bg-white hover:bg-[#f0f2f5] rounded-lg"
    >
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <img src={friend?.imageUrl} alt="" className="w-full h-full" />
      </div>
      <div>
        <p className="font-bold hover:cursor-pointer">
          {`${friend?.firstName} ${friend?.lastName}`}
        </p>
        <p className="text-gray-600 ">{`@${friend?.username}`}</p>
      </div>
    </Link>
  );
};

export default Friend;
