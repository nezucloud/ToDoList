import "iziToast";

export const toastSuccess = (message) => {
  iziToast.show({
    title: "Success",
    message: message,
    color: "green",
    position: "topRight",
  });
};
