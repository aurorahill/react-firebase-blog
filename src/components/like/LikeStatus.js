import { useDetailContext } from "../../store/datail-context";
import { FaRegThumbsUp } from "react-icons/fa";
import { FaThumbsUp } from "react-icons/fa";

const LikeStatus = ({ userId }) => {
  const { likes } = useDetailContext();

  if (likes?.length > 0) {
    return likes.find((id) => id === userId) ? (
      <>
        <FaRegThumbsUp />
        &nbsp;{likes.length} {likes.length === 1 ? "Like" : "Likes"}
      </>
    ) : (
      <>
        <FaThumbsUp />
        &nbsp;{likes.length} {likes.length === 1 ? "Like" : "Likes"}
      </>
    );
  }
  return (
    <>
      <FaRegThumbsUp />
      &nbsp;Like
    </>
  );
};

export default LikeStatus;
