import { Link, useNavigate } from "react-router-dom";
import React, { useRef, useState } from "react";
import axios from "axios";

export default function CreateProfile({ handleShowToast }) {
  const [banner, setBanner] = useState();
  const [profilePict, setProfilePict] = useState();
  const [previewBanner, setPreviewBanner] = useState(null);
  const [previewProfilePict, setPreviewProfilePict] = useState();
  const navigate = useNavigate();
  const displayName = useRef(null);
  const bio = useRef(null);
  const loc = useRef(null);
  const handleCreate = async (displayName, bio = "", location = "") => {
    try {
      if (displayName > 20) {
        handleShowToast("error", "Display name is too long");
        return;
      }
      if (location > 25) {
        handleShowToast("error", "Maximal character location is 25");
        return;
      }

      const user = {
        _id: localStorage.getItem("user"),
        displayName,
        bio,
        location,
      };

      await axios
        .post("http://localhost:3001/api/users/createUserProfile", user, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          handleShowToast(res.data.status, res.data.msg);
          if (res.data.status === "success") {
            navigate("/home", { replace: true });
          }
        })
        .catch((res) => {
          console.error(res.response.data);
          handleShowToast(res.response.data.status, res.response.data.msg);
        });
    } catch (err) {
      console.error(err);
      handleShowToast("error", "Something went wrong, please try again later!");
    }
  };

  const uploadBanner = async () => {
    try {
      const formData = new FormData();
      formData.append("banner", banner);
      formData.append("_id", localStorage.getItem("user"));
      axios
        .post("http://localhost:3001/api/users/upload-banner", formData)
        .then((res) => {})
        .catch((err) => {
          handleShowToast("error", err.message);
          console.log(err);
        });
    } catch (err) {
      console.error(err);
      handleShowToast("error", "Something went wrong, please try again later!");
    }
  };

  const uploadProfilePict = async () => {
    try {
      const formData = new FormData();
      formData.append("profilePict", profilePict);
      formData.append("_id", localStorage.getItem("user"));
      axios
        .post("http://localhost:3001/api/users/upload-profile-pict", formData)
        .then((res) => {
          localStorage.setItem("picturePath", res.data.picturePath);
        })
        .catch((err) => {
          handleShowToast("error", err.response.data.msg);
          console.error(err);
        });
    } catch (err) {
      console.error(err);
      handleShowToast("error", "Something went wrong, please try again later!");
    }
  };

  return (
    <>
      <form
        action="POST"
        onSubmit={async (e) => {
          e.preventDefault();
          localStorage.setItem("picturePath", "");
          if (profilePict) {
            await uploadProfilePict();
          }
          if (banner) {
            await uploadBanner();
          }
          handleCreate(
            displayName.current.value,
            bio.current.value,
            loc.current.value
          );
        }}
      >
        <input
          type="file"
          name="banner"
          accept=".jpg, .jpeg, .png"
          id="banner"
          className="hidden"
          onChange={(e) => {
            if (e.target.files[0].size > 2097152) {
              handleShowToast("error", "Maximum file size is 2MB");
            } else if (
              !["image/jpg", "image/jpeg", "image/png"].includes(
                e.target.files[0].type
              )
            ) {
              handleShowToast(
                "error",
                "File format must be .jpg, .jpeg or .png"
              );
            } else {
              setPreviewBanner(URL.createObjectURL(e.target.files[0]));
              setBanner(e.target.files[0]);
            }
          }}
        />
        <input
          type="file"
          name="profile-pict"
          accept=".jpg, .jpeg, .png"
          id="profile-pict"
          className="hidden"
          onChange={(e) => {
            if (e.target.files[0].size > 2097152) {
              handleShowToast("error", "Maximum file size is 2MB");
            } else if (
              !["image/jpg", "image/jpeg", "image/png"].includes(
                e.target.files[0].type
              )
            ) {
              handleShowToast(
                "error",
                "File format must be .jpg, .jpeg or .png"
              );
            } else {
              setPreviewProfilePict(URL.createObjectURL(e.target.files[0]));
              setProfilePict(e.target.files[0]);
            }
          }}
        />
        <div className="w-screen h-screen overflow-hidden flex items-center justify-center shadow-lg relative">
          <div className="flex flex-col lg:w-3/5 bg-d-primary rounded-lg overflow-hidden items-center justify-center w-[90%]">
            <div className="w-full h-32 bg-d-text rounded-lg relative group md:h-[168px] md:rounded-xl ">
              <label
                htmlFor="banner"
                id="bannerLabel"
                className={`w-full h-full relative bg-d-secondary rounded-lg lg:rounded-xl text-d-text lg:text-5xl text-2xl flex justify-center items-center transition-all duration-300 cursor-pointer box-border  ${
                  previewBanner
                    ? "opacity-100"
                    : "opacity-0  group-hover:opacity-80"
                }`}
              >
                <div
                  className={`absolute w-full h-full ${
                    previewBanner ? "block" : "hidden"
                  }`}
                >
                  <img
                    src={previewBanner}
                    className="w-full h-full object-cover object-center"
                    id="bannerImage"
                  />
                </div>
                Upload Banner
              </label>
              <label
                htmlFor="profile-pict"
                className="rounded-full bg-d-text w-7 h-7 lg:w-10 lg:h-10 flex items-center justify-center bg-cover absolute lg:-bottom-5 lg:right-4 -bottom-4 right-2 backdrop:cursor-pointer transition-all duration-300 hover:bg-d-secondary shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.15)]"
              >
                <img
                  src="./icons/pencil.svg"
                  alt="upload"
                  className="lg:w-8 lg:h-8 w-5 h-5"
                />
              </label>
            </div>
            <div className="rounded-full lg:w-24 lg:h-24 w-16 h-16 bg-d-text -translate-y-1/2 shadow-inner ring-2 ring-d-primary group bg-cover cursor-pointer">
              <label htmlFor="profile-pict">
                <img
                  src={
                    previewProfilePict
                      ? previewProfilePict
                      : "./images/default-profile-picture.png"
                  }
                  alt=""
                  className="bg-cover rounded-full w-full h-full"
                />
              </label>
              <label
                htmlFor="profile-pict"
                className="rounded-full bg-d-text lg:w-8 lg:h-8 w-6 h-6 flex items-center justify-center bg-cover absolute -bottom-2 right-0 cursor-pointer transition-all duration-300 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.15)] hover:bg-d-secondary"
              >
                <img
                  src="./icons/pencil.svg"
                  alt="upload"
                  className="lg:w-6 lg:h-6 w-4 h-4"
                />
              </label>
            </div>
            <section className="flex flex-col lg:w-1/2 w-3/4 h-80 items-center justify-between lg:-mt-8 -mt-4 py-4 lg:py-2">
              <div className="container lg:mb-2">
                <label
                  htmlFor="displayName"
                  className="text-d-text lg:py-2 py-1 font-bold font-open-sans cursor-pointer lg:text-lg text-base after:content-['*'] after:text-red-500"
                >
                  Display Name
                </label>
                <input
                  type="textarea"
                  name="displayName"
                  id="displayName"
                  ref={displayName}
                  required
                  autoComplete="off"
                  placeholder="max character 20"
                  className="text-d-text lg:my-1 my-2 lg:px-4 lg:py-2 py-3 px-3 font-medium font-open-sans lg:text-base text-sm bg-d-secondary rounded-lg w-full outline-none focus:ring-2 focus:ring-d-accent transition-all duration-300"
                />
              </div>
              <div className="container">
                <label
                  htmlFor="bio"
                  className="text-d-text py-1 mt-1 font-bold font-open-sans cursor-pointer lg:text-lg text-base"
                >
                  Bio
                </label>

                <textarea
                  name="bio"
                  id="bio"
                  cols="30"
                  rows="4"
                  ref={bio}
                  className="text-d-text lg:py-2 lg:px-4 py-1 px-2 my-2 lg:my-1 font-medium lg:text-base text-sm font-open-sans bg-d-secondary rounded-lg w-full outline-none focus:ring-2 focus:ring-d-accent transition-all duration-300 resize-none"
                  placeholder="(optional)"
                ></textarea>
              </div>
              <div className="container lg:mt-2">
                <label
                  htmlFor="location"
                  className="text-d-text mt-1 lg:py-2 py-1 font-bold lg:text-lg text-base font-open-sans cursor-pointer"
                >
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  ref={loc}
                  placeholder="(optional)"
                  className="text-d-text lg:px-4 py-3 px-3 my-2 lg:my-1 lg:text-base text-sm font-medium font-open-sans bg-d-secondary rounded-lg w-full outline-none focus:ring-2 focus:ring-d-accent transition-all duration-300"
                />
              </div>
            </section>
            <div className="flex justify-between w-full my-2">
              <div className="group">
                <div className="w-[365px] h-[365px] rounded-full bg-red-800 absolute -bottom-[200px] -left-[300px] lg:-left-[200px] blur-[256px] -z-10 animate-bounce-slow group-hover:-bottom-[125px] group-hover:bg-[#d32a2a] transition-all"></div>
                <Link to="/login">
                  <button
                    type="button"
                    className="lg:w-24 w-20 bg-red-700 lg:p-[6px] p-2 lg:rounded-lg rounded-md font-semibold text-d-text ml-2 lg:text-base text-sm transition-all duration-300 hover:bg-[#d32a2a]"
                  >
                    <p className="w-full h-full rounded-[inherit]">Back</p>
                  </button>
                </Link>
              </div>
              <div className="group">
                <div className="w-[365px] h-[365px] rounded-full bg-d-accent absolute -bottom-[200px] -right-[350px] lg:-right-[200px] blur-[256px] -z-10 animate-bounce-slow group-hover:-bottom-[125px] transition-all group-hover:bg-[#1070ed]"></div>
                <button
                  type="submit"
                  className="lg:w-24 w-20 bg-d-accent lg:p-[6px] p-2 lg:rounded-lg rounded-md font-semibold text-d-text mr-2 lg:text-base text-sm transition-all duration-300 hover:bg-[#1070ed]"
                >
                  <p className="w-full h-full rounded-[inherit]">Next</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
