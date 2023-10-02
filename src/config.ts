export const APIKey = process.env.REACT_APP_API_KEY?.replace(
  /['"]+/g,
  ""
).replace(";", "");

export const APIToken = process.env.REACT_APP_API_TOCKEN?.replace(
  /['"]+/g,
  ""
).replace(";", "");
