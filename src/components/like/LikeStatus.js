import { useDetailContext } from "../../store/datail-context";
import { FaRegThumbsUp } from "react-icons/fa";
import { FaThumbsUp } from "react-icons/fa";

const LikeStatus = ({ userId }) => {
  const { likes } = useDetailContext();

  if (likes?.length > 0) {
    return likes.find((id) => id === userId) ? (
      <>
        <FaRegThumbsUp />
        &nbsp;{likes.length} Lubię to!
      </>
    ) : (
      <>
        <FaThumbsUp />
        &nbsp;{likes.length} Lubię to!
      </>
    );
  }
  return (
    <>
      <FaRegThumbsUp />
      &nbsp;Lubię to!
    </>
  );
};

export default LikeStatus;
