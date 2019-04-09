import Rating from "../models/rating";
export const getDoctorRating = doctorId =>
  Rating.find({ doctorId }).then(ratings => {
    if (ratings.length === 0) {
      return 0;
    }
    const sum = ratings.reduce((total, ratingObj) => total + ratingObj.rating);
    return sum / ratings.length;
  });
