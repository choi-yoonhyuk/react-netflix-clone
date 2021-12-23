import React, { useState } from "react";
import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import styled from "styled-components";
import { useQuery } from "react-query";
import { getPopularTv, getTopRatedTv, getTv, IGetTv } from "../api";
import { makeImagePath } from "../utils";
import { IoArrowForward } from "react-icons/io5";
import { useMatch, useNavigate } from "react-router-dom";
import Detail from "./Components/Detail";

const noPoster = require("../images/noPosterSmall.png");

const Wrapper = styled.div`
  background-color: black;
  overflow: hidden;
  padding-bottom: 300px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(to left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 50px;
  margin-bottom: 20px;
`;

const OverView = styled.p`
  font-size: 18px;
  width: 50%;
`;

const Slide = styled.div`
  position: relative;
  top: -100px;
`;

const PopSlide = styled.div`
  margin-top: 200px;
  position: relative;
`;
const TopSlide = styled.div`
  margin-top: 300px;
  position: relative;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  box-shadow: 0px 2px 15px 0px rgba(255, 255, 255, 0.22);
  border-radius: 5px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 20px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 14px;
  }
`;
const ArrowBtn = styled.div`
  width: 50px;
  height: 200px;
  background-color: rgba(0, 0, 0, 0.4);
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 50vw;
  height: 80vh;
  background-color: ${(props) => props.theme.black.lighter};
  box-shadow: 0px 2px 15px 0px rgba(255, 255, 255, 0.22);
  overflow-y: scroll;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 10px;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const rowVariants = {
  hidden: { x: window.outerWidth - 5 },
  visible: { x: 0 },
  exit: { x: -window.outerWidth + 5 },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    borderRadius: 15,
    overflow: "hidden",
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};
const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.5,
      type: "tween",
    },
  },
};

const offset = 6;

const TV = () => {
  const { data, isLoading: todayLoading } = useQuery<IGetTv>(
    ["tv", "today"],
    getTv
  );
  const { data: popTvData, isLoading: popTvLoading } = useQuery<IGetTv>(
    ["tv", "popular"],
    getPopularTv
  );
  const { data: topTvData, isLoading: topTvLoading } = useQuery<IGetTv>(
    ["tv", "topRate"],
    getTopRatedTv
  );

  const navigate = useNavigate();
  const bigTvMatch = useMatch("/tv/show/:tvId");

  const [todayIndex, setTodayIndex] = useState(0);
  const [popIndex, setPopIndex] = useState(0);
  const [topIndex, setTopIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const { scrollY } = useViewportScroll();

  const increaseToday = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalTv = data?.results.length - 2;
      const maxIndex = Math.floor(totalTv / offset) - 1;
      setTodayIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const increasePop = () => {
    if (popTvData) {
      if (leaving) return;
      toggleLeaving();
      const totalTv = popTvData?.results.length - 2;
      const maxIndex = Math.floor(totalTv / offset) - 1;
      setPopIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const increaseTop = () => {
    if (topTvData) {
      if (leaving) return;
      toggleLeaving();
      const totalTv = topTvData?.results.length - 2;
      const maxIndex = Math.floor(totalTv / offset) - 1;
      setTopIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onClickBox = (tvId: number) => {
    navigate(`/tv/show/${tvId}`);
  };
  const onOverlayClick = () => {
    navigate(-1);
  };
  const isLoading = todayLoading || popTvLoading || topTvLoading;
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0]?.name}</Title>
            <OverView>{data?.results[0]?.overview}</OverView>
          </Banner>

          <Slide>
            <h1>{`Today Tv Shows (${offset * todayIndex + offset})`}</h1>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={todayIndex}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * todayIndex, offset * todayIndex + offset)
                  .map((tv) => (
                    <Box
                      key={tv.id}
                      whileHover="hover"
                      layoutId={String(tv.id)}
                      initial="normal"
                      onClick={() => onClickBox(tv.id)}
                      variants={boxVariants}
                      transition={{ type: "tween" }}
                      bgphoto={
                        tv.backdrop_path
                          ? makeImagePath(tv.backdrop_path, "w500")
                          : tv.poster_path
                          ? makeImagePath(tv.poster_path, "w500")
                          : noPoster
                      }
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <ArrowBtn onClick={increaseToday}>
              <IoArrowForward style={{ fontSize: 30 }} />
            </ArrowBtn>
          </Slide>
          <PopSlide>
            <h1>{`Popular Tv Shows (${offset * popIndex + offset})`}</h1>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={popIndex}
              >
                {popTvData?.results
                  .slice(2)
                  .slice(offset * popIndex, offset * popIndex + offset)
                  .map((tv) => (
                    <Box
                      key={tv.id}
                      layoutId={String(tv.id)}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      transition={{ type: "tween" }}
                      onClick={() => onClickBox(tv.id)}
                      bgphoto={
                        tv.backdrop_path
                          ? makeImagePath(tv.backdrop_path, "w500")
                          : noPoster
                      }
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <ArrowBtn onClick={increasePop}>
              <IoArrowForward style={{ fontSize: 30 }} />
            </ArrowBtn>
          </PopSlide>
          <TopSlide>
            <h1>{`TopRated Tv Shows (${offset * topIndex + offset})`}</h1>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={topIndex}
              >
                {topTvData?.results
                  .slice(2)
                  .slice(offset * topIndex, offset * topIndex + offset)
                  .map((tv) => (
                    <Box
                      key={tv.id}
                      layoutId={String(tv.id)}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      transition={{ type: "tween" }}
                      onClick={() => onClickBox(tv.id)}
                      bgphoto={
                        tv.backdrop_path
                          ? makeImagePath(tv.backdrop_path, "w500")
                          : require("../images/noPosterSmall.png")
                      }
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <ArrowBtn onClick={increaseTop}>
              <IoArrowForward style={{ fontSize: 30 }} />
            </ArrowBtn>
          </TopSlide>
          <AnimatePresence>
            {bigTvMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{
                    top: scrollY.get() + 100,
                    bottom: scrollY.get() + 100,
                  }}
                  layoutId={bigTvMatch.params.tvId}
                >
                  <Detail />
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
};

export default TV;
