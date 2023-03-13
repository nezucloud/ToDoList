import { DELETE, GET } from "../helpers/api-service";

export const USER_LOGOUT = () => {
  return DELETE("auth/logout");
};

export const USER_SHOW = () => {
  return GET("auth/show");
};
