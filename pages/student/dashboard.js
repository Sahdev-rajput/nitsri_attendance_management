import React, { useState, useEffect } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";

const subjects = [
  { name: "DBMS", teacher: "Promod Yadav", attendance: 85, link: "/student/dbms" },
  { name: "Mathematics", teacher: "Dr. Sharma", attendance: 90, link: "/student/mathematics" },
  { name: "Science", teacher: "Dr. Kumar", attendance: 75, link: "/student/science" },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // Added state for user
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    if (localStorage.getItem("studentToken")) {
      let token = localStorage.getItem("studentToken");
      const helper = async () => {
        try {
          const res = await fetch("/api/studentapis/getStudent", {
            method: "POST",
            body: JSON.stringify({ token }), // Wrapped token in an object
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await res.json();
          if (!data.Success) {
            localStorage.removeItem("studentToken");
            toast.error(data.ErrorMessage, {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Bounce,
            });
            setTimeout(() => {
              router.push("/login/student");
            }, 2000);
          } else {
            localStorage.setItem('role',"student");
            setUser(data.user);
          }
        } catch (error) {
          console.error(error);
        }
      };
      helper();
    } else {
      router.push("/login/student");
    }
    setLoading(false);
  }, [router]);

  return (
    <div className="dark min-h-screen bg-gray-900 text-gray-100">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
      {loading ? (
        <div className="relative h-custom flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : (
        <div>
          <div className="bg-gray-800 shadow-md rounded-lg p-6 max-w-md w-full mb-6 mx-auto">
            <h1
              className="text-5xl font-bold text-green-500 mb-5"
              style={{
                fontFamily: "Courier New, Courier, monospace",
                color: "rgb(34, 197, 50)", // Fixed incorrect color syntax
              }}
            >
              STUDENT
            </h1>
            <h2 className="text-2xl font-bold mb-4">{user?.name || "Undefined"}</h2>
            <p className="text-gray-400 mb-4">Enrollment: {user?.enrollmentNumber || "Undefined"}</p>
            <p className="text-gray-400 mb-4">Batch: {user?.batch || "Undefined"}</p>
          </div>

          {subjects.map((subject, index) => (
            <div
              key={index}
              className="w-4/5 bg-gray-800 border border-gray-700 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 mb-6 mx-auto"
            >
              <div className="flex justify-end px-4 pt-4"></div>
              <div className="flex flex-col items-center pb-10">
                <h5 className="mb-1 text-xl font-medium text-gray-100">{subject.name}</h5>
                <span className="text-sm text-gray-400">{subject.teacher}</span>
                <span className="text-lg font-semibold text-gray-100 mt-2">
                  Attendance: {subject.attendance}%
                </span>
                <div className="relative pt-1 w-4/5 mt-2">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
                    <div
                      style={{ width: `${subject.attendance}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    ></div>
                  </div>
                </div>
                <button
                  onClick={() => (window.location.href = subject.link)}
                  className="mt-4 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Go to {subject.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
