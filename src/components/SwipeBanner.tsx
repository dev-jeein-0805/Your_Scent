import { useState } from "react";
import banner1 from "../utils/bannerImage/banner1.webp";
import banner2 from "../utils/bannerImage/banner2.webp";
import banner3 from "../utils/bannerImage/banner3.webp";
import banner4 from "../utils/bannerImage/banner4.webp";
import Swipe from "react-easy-swipe";

const postData = {
  boardImageUrl: [banner1, banner2, banner3, banner4],
};

const SwipeBanner = () => {
  const [positionx, setPositionx] = useState<number>(0);
  const [imgCount, setImgCount] = useState<number>(1);
  const [endSwipe, setEndSwipe] = useState<boolean>(false);

  const onSwipeMove = (position: { x: number }) => {
    setEndSwipe(false);
    if (postData.boardImageUrl.length === 1) {
      return;
    }
    if (imgCount === 1 && position.x < 0) {
      setPositionx(() => position.x);
      return;
    }
    if (imgCount > 1 && imgCount < postData.boardImageUrl.length) {
      setPositionx(() => position.x);
      return;
    }
    if (imgCount === postData.boardImageUrl.length && position.x > 0) {
      setPositionx(() => position.x);
      return;
    }
  };

  const onSwipeEnd = () => {
    if (positionx < -20) {
      setImgCount((imgCount) => imgCount + 1);
    }
    if (positionx > 20) {
      setImgCount((imgCount) => imgCount - 1);
    }
    setPositionx(() => 0);
    setEndSwipe(true);
  };

  return (
    <div className="w-330 mx-auto">
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="relative overflow-hidden">
          <Swipe onSwipeEnd={onSwipeEnd} onSwipeMove={onSwipeMove}>
            <div
              className={`flex w-full h-full transition-transform ${endSwipe ? "duration-200" : "duration-0"}`}
              style={{
                transform: `translateX(${positionx}px + ${-100 * (imgCount - 1)}%)`,
              }}
            >
              {postData.boardImageUrl.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ))}
            </div>
          </Swipe>
        </div>
        {postData.boardImageUrl.length > 1 && (
          <div className="flex justify-center items-center mb-4 mt-4">
            {postData.boardImageUrl.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 bg-${index === imgCount - 1 ? "blue-600" : "gray-400"} rounded-full ${index !== postData.boardImageUrl.length - 1 ? "mr-1" : ""}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SwipeBanner;
