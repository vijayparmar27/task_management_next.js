import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const showToast = (
  title: string,
  icon: "info" | "error" | "success",
  body: string
) => {
  switch (icon) {
    case "info": {
      toast.info(body, {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        closeButton: true,
        hideProgressBar: false,
      });
      break;
    }
    case "error": {
      toast.error(body, {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        closeButton: true,
        hideProgressBar: false,
      });
      break;
    }
    case "success": {
      toast.success(body, {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        closeButton: true,
        hideProgressBar: false,
      });
      break;
    }
    default: {
      toast(body, {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        closeButton: true,
        hideProgressBar: false,
      });
      break;
    }
  }
};

export default showToast;
