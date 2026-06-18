'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OtpInput from "react-otp-input";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";


// import useSendOtp from '@/app/hooks/useSendotp'
// import useVerifyOtp from '@/app/hooks/useVeriyOtp'

import useSendOtp from '@/app/hooks/useSendOtp'
import useVerifyOtp from '@/app/hooks/useVeriyOtp'

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");

  const router = useRouter();


  const { sendOtp, sending, otpSent, setOtpSent } = useSendOtp("forgetPassword");

  const { verifyOtp, isVerifying, isVerified, setIsVerified } = useVerifyOtp("forgetPassword");


  const resetPasswordMutation = useMutation({
    mutationFn: async ({ email, newpassword }) => {

      // const res = await API.post("/auth/reset-password", {
      //   email,
      //   newpassword,
      // });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            newpassword,
          }),
        }
      );

      const data = await res.json();

      return data;

    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.message || "Password reset successful");
        router.push("/auth/login");
      } else {
        toast.error(data?.message || "Reset failed");
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message || "Reset failed");
    },
  });


  useEffect(() => {
    if (otp.length === 6 && !isVerifying && !isVerified) {
      verifyOtp(email, otp);
    }
  }, [otp]);


  useEffect(() => {
    if (isVerified) {
      setOtp("");
      setOtpSent(false);
    }
  }, [isVerified, setOtpSent]);


  const handleResetPassword = (e) => {
    e.preventDefault();

    resetPasswordMutation.mutate({
      email,
      newpassword: newPassword,
    });
  };


  useEffect(() => {

    const checkEmailVerification = async () => {

      try {

        const savedEmail = sessionStorage.getItem("forgetEmail");

        if (!savedEmail) return;

        const res = await API.post('/auth/verifyemail', { email: savedEmail })

        if (res.data.success) {
          setEmail(savedEmail);
          setIsVerified(true);
          toast.success("Email verified Again")
        }

      } catch (error) {
        toast.error("Email Verification Failed")
      }
    };

    checkEmailVerification();

  }, []);


  return (
  <div
    className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-[#0b0d11]
      px-4
      relative
      overflow-hidden
    "
  >

    {/* Background Glow */}

    <div className="absolute top-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-[#1a1f27] blur-3xl opacity-40" />

    <div className="absolute bottom-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[#151922] blur-3xl opacity-40" />

    {/* Main Container */}

    <div
      className="
        relative
        z-10
        w-full
        max-w-md
        rounded-[32px]
        border
        border-[#20242c]
        bg-[#111418]
        p-8
        shadow-[0_0_60px_rgba(0,0,0,0.45)]
      "
    >

      {/* ---------- HEADER ---------- */}

      <div className="mb-8 text-center">

        <div
          className="
            mx-auto
            mb-5
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-3xl
            border
            border-[#2a2f3a]
            bg-[#1a1f27]
          "
        >
          <span className="text-2xl">🔑</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-[#f3f4f6]">
          Reset Password
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-[#7d8590]">
          Securely recover your Veyra account using OTP verification.
        </p>

      </div>

      {/* ---------- FORM ---------- */}

      <form onSubmit={handleResetPassword} className="space-y-5">

        <div className="space-y-4">

          {/* EMAIL + OTP BUTTON */}

          <div className="flex gap-3">

            <input
              type="email"
              placeholder="name@example.com"
              className="
                w-full
                rounded-2xl
                border
                border-[#2a2f3a]
                bg-[#171b22]
                px-4
                py-3.5
                text-sm
                font-medium
                text-[#f3f4f6]
                outline-none
                transition-all
                placeholder:text-[#6b7280]
                focus:border-[#3b4250]
                focus:bg-[#1b2028]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
              value={email}
              disabled={isVerified}
              onChange={(e) => {
                const value = e.target.value;
                setEmail(value);
                sessionStorage.setItem("forgetEmail", value);
              }}
              required
            />

            {!isVerified && email !== "" && (
              <button
                type="button"
                disabled={sending}
                onClick={() => sendOtp(email)}
                className="
                  flex-shrink-0
                  rounded-2xl
                  border
                  border-[#2a2f3a]
                  bg-[#1b2028]
                  px-5
                  py-3.5
                  text-sm
                  font-semibold
                  text-[#e5e7eb]
                  transition-all
                  hover:border-[#3b4250]
                  hover:bg-[#20252e]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {sending ? "Sending..." : "Send OTP"}
              </button>
            )}

          </div>

          {/* OTP SECTION */}

          {otpSent && !isVerified && (
            <div
              className="
                rounded-3xl
                border
                border-[#232833]
                bg-[#151920]
                p-6
                animate-in
                slide-in-from-top-2
                duration-300
              "
            >

              <p className="mb-5 text-center text-sm font-medium text-[#c4c9d4]">
                Enter validation code
              </p>

              <div className="flex justify-center">

                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  disabled={isVerifying}
                  containerStyle={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px"
                  }}
                  inputStyle={{
                    width: "46px",
                    height: "54px",
                    borderRadius: "18px",
                    border: "1px solid #2a2f3a",
                    backgroundColor: "#1a1f27",
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#f3f4f6",
                    textAlign: "center",
                    outline: "none",
                    transition: "all 0.2s ease"
                  }}
                  renderInput={(props) => (
                    <input
                      {...props}
                      className="
                        focus:border-[#3b4250]
                        focus:bg-[#20252e]
                      "
                    />
                  )}
                />

              </div>

              <p className="mt-5 text-center text-xs text-[#7d8590]">
                {isVerifying
                  ? "Verifying code..."
                  : "Check spam folder if not received."}
              </p>

            </div>
          )}

          {/* PASSWORD SECTION */}

          {isVerified && (
            <div className="space-y-4 animate-in fade-in duration-500">

              <input
                type="password"
                placeholder="Enter new password"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-[#2a2f3a]
                  bg-[#171b22]
                  px-4
                  py-3.5
                  text-sm
                  font-medium
                  text-[#f3f4f6]
                  outline-none
                  transition-all
                  placeholder:text-[#6b7280]
                  focus:border-[#3b4250]
                  focus:bg-[#1b2028]
                "
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <button
                type="submit"
                disabled={resetPasswordMutation.isPending}
                className="
                  w-full
                  rounded-2xl
                  border
                  border-[#2a2f3a]
                  bg-[#f3f4f6]
                  py-3.5
                  text-sm
                  font-semibold
                  text-[#111418]
                  transition-all
                  duration-300
                  hover:opacity-90
                  active:scale-[0.99]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {resetPasswordMutation.isPending
                  ? "Validating..."
                  : "Update Password"}
              </button>

            </div>
          )}

        </div>

      </form>

      {/* ---------- FOOTER ---------- */}

      <div
        className="
          mt-8
          border-t
          border-[#20242c]
          pt-6
          text-center
        "
      >

        <button
          onClick={() => router.push("/auth/login")}
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-[#8b93a7]
            transition-colors
            hover:text-[#d1d5db]
          "
        >

          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>

          Return to login

        </button>

      </div>

    </div>

  </div>
);
};

export default ForgetPassword;
