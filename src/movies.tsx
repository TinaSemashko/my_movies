import { InputAdornment, TextField, Typography } from "@mui/material";
import { ChangeEvent, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { APIKey, APIToken } from "./config";
import axios from "axios";
import { MovieData, ReviewsData, RecomendationData, DetailData } from "./types";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Errors } from "./errors";

import * as S from "./movies.styled";

const Movies: React.FC = () => {
  const [searchMovie, setSearchMovie] = useState("");
  const [movieData, setMovieData] = useState<MovieData[]>([]);
  const [idMovie, setIdMovie] = useState(0);
  const [detailData, setDetailData] = useState<DetailData>();
  const [reviewsData, setReviewsData] = useState<ReviewsData[]>([]);
  const [recomendationData, setRecomendationData] = useState<
    RecomendationData[]
  >([]);
  const [isError, setIsError] = useState(false);
  const [errorStatus, setErrorStatus] = useState("");
  const [errorMessage, setIsErrorMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [idOpen, setIdOpen] = useState(0);

  const APIUrl = `https://api.themoviedb.org/3/search/movie?query=${searchMovie}&include_adult=false&language=en-US&page=1`;
  const APIReviews = `https://api.themoviedb.org/3/movie/${idMovie}/reviews?language=en-US&page=1`;
  const APIRecomendation = `https://api.themoviedb.org/3/movie/${idMovie}/recommendations?language=en-US&page=1`;

  const headers = {
    accept: "application/json",
    Authorization: `Bearer ${APIToken}`,
  };

  const showError = (status: number, message: string) => {
    if (status >= 400) {
      setIsError(true);
      setErrorStatus(Errors(status));
      setIsErrorMessage(message);
    } else setIsError(false);
  };

  const fetchGet = async () => {
    await axios
      .get(APIUrl, { headers: headers })
      .then((response) => {
        setMovieData(response.data.results as MovieData[]);
      })
      .catch((err) => {
        showError(err.response.status, err.response.data.status_message);
      });
  };
  const fetchGetReviews = async () => {
    await axios
      .get(APIReviews, { headers: headers })
      .then((response) => {
        setReviewsData(response.data.results as ReviewsData[]);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const fetchGetRecomendation = async () => {
    await axios
      .get(APIRecomendation, { headers: headers })
      .then((response) => {
        setRecomendationData(response.data.results as RecomendationData[]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleClick = () => {
    showError(200, "message");
    fetchGet();
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setSearchMovie(event.target.value);
  };

  const showDetails = (event: React.MouseEvent<HTMLTextAreaElement>) => {
    const film_id = Number((event.target as HTMLTextAreaElement).id);

    if (idOpen === film_id) setIsOpen(false);
    else setIsOpen(true);
    setIdOpen(film_id);

    setIdMovie(movieData[film_id].id);
    fetchGetReviews();
    fetchGetRecomendation();
    setDetailData({
      adult: movieData[film_id].adult,
      backdrop_path: movieData[film_id].backdrop_path,
      genre_ids: movieData[film_id].genre_ids,
      id: movieData[film_id].id,
      original_language: movieData[film_id].original_language,
      original_title: movieData[film_id].original_title,
      overview: movieData[film_id].overview,
      popularity: movieData[film_id].popularity,
      poster_path: movieData[film_id].poster_path,
      release_date: movieData[film_id].release_date,
      title: movieData[film_id].title,
      video: movieData[film_id].video,
      vote_average: movieData[film_id].vote_average,
      vote_count: movieData[film_id].vote_count,
      reviews: [...reviewsData],
      recomendations: [...recomendationData],
    });
  };

  return (
    <S.MainContainer>
      <Typography variant="h3" fontFamily="Handlee, cursive" color="yellow">
        Choisissez un film
      </Typography>
      <TextField
        id="search"
        type="search"
        label="Search"
        value={searchMovie}
        onChange={handleChange}
        sx={{ width: "50vw", input: { color: "red" } }}
        InputProps={{
          endAdornment: (
            <InputAdornment
              position="end"
              sx={{ color: "white", cursor: "pointer" }}
            >
              <SearchIcon onClick={() => handleClick()} />
            </InputAdornment>
          ),
        }}
      />

      <S.ContainerList>
        <S.List>
          {movieData.map((item, index) => (
            <div>
              <Typography
                variant="h6"
                color="secondary"
                id={`${index}`}
                key={item.id}
                onClick={showDetails}
              >
                {item.title}
              </Typography>
              {item.id === detailData?.id && isOpen ? (
                <S.Details>
                  <Typography variant="h5" color="primary">
                    {detailData?.title}
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {detailData
                      ? `original title: ${detailData?.original_title}`
                      : ""}
                  </Typography>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${detailData?.poster_path}`}
                    alt=""
                    width="200px"
                  />
                  <Typography variant="body1" color="primary">
                    {detailData
                      ? `release date: ${detailData?.release_date}`
                      : ""}
                  </Typography>
                  <Typography variant="body1" color="primary">
                    {detailData?.overview}
                  </Typography>
                  <br />
                  <Typography variant="h5" color="white">
                    {detailData?.reviews.length ? `Reviews:` : ""}
                  </Typography>
                  {detailData?.reviews.map((item, index) => (
                    <div key={item.id}>
                      <Typography variant="h6" color="yellow">
                        {detailData ? `${item?.author}:` : ""}
                      </Typography>
                      <Typography variant="body1" color="green">
                        {detailData ? item?.content : ""}
                      </Typography>
                    </div>
                  ))}
                  <br />
                  <Typography variant="h5" color="white">
                    {detailData?.recomendations.length ? `Recomendations:` : ""}
                  </Typography>
                  {detailData?.recomendations.map((item, index) => (
                    <div key={item.id}>
                      <Typography variant="h6" color="red">
                        {detailData ? `${item?.title}:` : ""}
                      </Typography>
                      <Typography variant="body1" color="orange">
                        {detailData ? item?.overview : ""}
                      </Typography>
                    </div>
                  ))}
                </S.Details>
              ) : (
                ""
              )}
            </div>
          ))}
        </S.List>

        {isError ? (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            <Typography variant="h6" color="red">
              Status: {errorStatus}
            </Typography>
            <Typography variant="h6">{errorMessage}</Typography>
          </Alert>
        ) : (
          ""
        )}
      </S.ContainerList>
      <footer>
        <p className="text-center mt-5">
          <em>
            This website was coded by Tina Semashko, and is&nbsp;
            <a
              href="https://github.com/TinaSemashko/my_movies"
              target="_blank"
              title="github link that project"
            >
              open-sourced
            </a>
          </em>
        </p>
      </footer>
    </S.MainContainer>
  );
};
export default Movies;
