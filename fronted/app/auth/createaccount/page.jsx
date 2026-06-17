'use client'
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";


import OtpInput from "react-otp-input";

import toast from "react-hot-toast";

import { useMutation } from "@tanstack/react-query";

import Image from "next/image";


import useSendOtp from '@/app/hooks/useSendOtp'

import useVerifyOtp from "@/app/hooks/useVeriyOtp";


const Page = () => {

  const router = useRouter()

  const [fullName, setFullname] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [avatarFile, setAvatarFile] = useState(null);

  const [avatarPreview, setAvatarPreview] = useState("");

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const [otp, setOtp] = useState("");




  const { sendOtp, sending, otpSent, setOtpSent } = useSendOtp("signup");

  const { verifyOtp, isVerifying, isVerified, setIsVerified } = useVerifyOtp("signup");



  const signupMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("password", password);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Signup failed");
      }
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Signup failed");
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success("Signup successful");
      router.replace("/auth/login");
    },
    onError: (err) => {
      console.log(err.message);
      toast.error(err.message);
    },
  });

  const handleSignup = (e) => {
    e.preventDefault();
    if (signupMutation.isPending) return;

    if (!fullName.trim()) return toast.error("Name is required");
    if (!email.trim()) return toast.error("Email is required");
    if (!password.trim()) return toast.error("Password is required");
    if (!avatarFile) return toast.error("profilePicture is required");

    signupMutation.mutate();
  };


  useEffect(() => {
    if (otp.length === 6 && !isVerifying && !isVerified) {
      verifyOtp(email, otp);
    }
  }, [otp, isVerifying, isVerified, email, verifyOtp]);


  useEffect(() => {
    if (isVerified) {
      setOtp("");
      setOtpSent(false);
    }
  }, [isVerified, setOtpSent]);


  useEffect(() => {
    const checkEmailVerification = async () => {
      try {
        const savedEmail = sessionStorage.getItem("signupEmail");
        if (!savedEmail) return;

        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verifyemail`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: savedEmail,
          }),
        });

        const data = await res.json()

        if (data.success) {
          setEmail(savedEmail);
          setIsVerified(true);
          toast.success("Email verified again");
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || error?.message || "Verify email failed"
        );
      }
    };

    checkEmailVerification();
  }, [setIsVerified]);



const isCreating = signupMutation.isPending;

return (
  <div className="min-h-screen bg-[#0b0d11] text-[#f3f4f6] relative overflow-hidden flex items-center justify-center px-4 py-10">

    {/* BACKGROUND GLOW */}
    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#3b82f6]/10 blur-[140px] rounded-full pointer-events-none"></div>
    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#8b5cf6]/10 blur-[140px] rounded-full pointer-events-none"></div>

    {/* CARD */}
    <div
      className="
        relative
        z-10
        w-full
        max-w-md
        rounded-[2rem]
        border
        border-[#1b1f27]
        bg-[#11141a]/95
        backdrop-blur-2xl
        shadow-[0_20px_80px_-20px_rgba(0,0,0,0.7)]
        p-8
        sm:p-10
      "
    >

      {/* HEADER */}
      <div className="text-center space-y-3 mb-8">
        <h2
          className="
            text-3xl
            font-semibold
            tracking-tight
            text-white
          "
        >
          Create Account ✨
        </h2>

        <p className="text-sm text-[#8b90a0] leading-relaxed">
          Join the premium AI blog experience.
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSignup}
        className="flex flex-col gap-5"
      >

        {/* AVATAR UPLOAD */}
        {isVerified && (
          <div className="flex flex-col items-center justify-center gap-3 my-2">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full border border-dashed border-[#3a4252] bg-[#171b22] flex items-center justify-center overflow-hidden cursor-pointer hover:border-zinc-500 transition-all">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl select-none">📷</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
            <span className="text-xs text-[#7c8393]">
              Upload profile picture (optional)
            </span>
          </div>
        )}

        {/* FULL NAME */}
        {isVerified && (
          <div className="relative group">

            <div
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-[#7c8393]
                group-focus-within:text-white
                transition-all
              "
            >
              👤
            </div>

            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullname(e.target.value)}
              required
              className="
                w-full
                h-14
                rounded-2xl
                border
                border-[#222733]
                bg-[#171b22]
                pl-12
                pr-4
                text-white
                placeholder:text-[#7c8393]
                outline-none
                transition-all
                focus:border-[#3a4252]
              "
            />
          </div>
        )}

        {/* EMAIL + OTP */}
        <div className="flex gap-3">

          <div className="relative group flex-1">

            <div
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-[#7c8393]
                group-focus-within:text-white
                transition-all
              "
            >
              📧
            </div>

            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              disabled={isVerified}
              onChange={(e) => {
                const value = e.target.value;
                setEmail(value);
                sessionStorage.setItem("signupEmail", value);
              }}
              required
              className="
                w-full
                h-14
                rounded-2xl
                border
                border-[#222733]
                bg-[#171b22]
                pl-12
                pr-4
                text-white
                placeholder:text-[#7c8393]
                outline-none
                transition-all
                focus:border-[#3a4252]
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            />
          </div>

          {!isVerified && email !== "" && (
            <button
              type="button"
              disabled={sending}
              onClick={() => sendOtp(email)}
              className="
                h-14
                px-5
                rounded-2xl
                bg-[#f3f4f6]
                text-[#0f1115]
                font-semibold
                transition-all
                hover:bg-white
                hover:-translate-y-0.5
                disabled:opacity-50
                disabled:hover:translate-y-0
                whitespace-nowrap
                flex
                items-center
                justify-center
                min-w-[120px]
              "
            >
              {sending ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
              ) : (
                "Send OTP"
              )}
            </button>
          )}
        </div>

        {/* PASSWORD */}
        {isVerified && (
          <div className="relative group">

            <div
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-[#7c8393]
                group-focus-within:text-white
                transition-all
              "
            >
              🔒
            </div>

            <input
              type="password"
              placeholder="Set Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="
                w-full
                h-14
                rounded-2xl
                border
                border-[#222733]
                bg-[#171b22]
                pl-12
                pr-4
                text-white
                placeholder:text-[#7c8393]
                outline-none
                transition-all
                focus:border-[#3a4252]
              "
            />
          </div>
        )}

        {/* CREATE ACCOUNT */}
        {isVerified && (
          <button
            type="submit"
            disabled={isCreating}
            className="
              h-14
              rounded-2xl
              bg-[#f3f4f6]
              text-[#0f1115]
              font-semibold
              transition-all
              hover:bg-white
              hover:-translate-y-0.5
              disabled:opacity-50
              disabled:hover:translate-y-0
              mt-2
            "
          >
            {isCreating ? "Creating Account..." : "Create Account"}
          </button>
        )}
      </form>

      {/* OTP BOX */}
      {otpSent && (
        <div
          className="
            mt-7
            rounded-3xl
            border
            border-[#1f2430]
            bg-[#171b22]
            p-6
            flex
            flex-col
            items-center
            gap-5
          "
        >

          <p className="text-sm text-[#c2c7d0] font-medium">
            We sent a 6-digit code to your email
          </p>

          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            disabled={isVerifying}
            containerStyle={{
              display: "flex",
              justifyContent: "center",
              gap: "0.55rem",
              width: "100%",
            }}
            inputStyle={{
              width: "3rem",
              height: "3.5rem",
              borderRadius: "1rem",
              border: "1px solid #2a3140",
              background: "#0f131a",
              color: "#ffffff",
              fontSize: "1.2rem",
              fontWeight: "700",
              outline: "none",
              transition: "all 0.2s",
            }}
            focusStyle={{
              border: "1px solid #4b5563",
              boxShadow: "0 0 0 3px rgba(255,255,255,0.04)",
            }}
            renderInput={(props) => <input {...props} />}
          />

          <div className="text-xs text-[#7c8393]">
            {isVerifying ? (
              <span className="flex items-center gap-2 text-white">
                <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Verifying securely...
              </span>
            ) : (
              "Tip: Check your spam folder if you don't see it."
            )}
          </div>
        </div>
      )}

      {/* DIVIDER */}
      <div className="relative my-8">

        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#222733]"></div>
        </div>

        <div className="relative flex justify-center">
          <span
            className="
              bg-[#11141a]
              px-4
              text-xs
              uppercase
              tracking-[0.3em]
              text-[#7c8393]
            "
          >
            Or
          </span>
        </div>
      </div>

      {/* GOOGLE BUTTON */}
      <button
        type="button"
        onClick={() => {
          window.location.href =
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
        }}
        className="
          w-full
          h-14
          rounded-2xl
          border
          border-[#262c37]
          bg-[#171b22]
          text-[#d1d5db]
          hover:bg-[#1d2129]
          transition-all
          flex
          items-center
          justify-center
          gap-3
          font-medium
          hover:-translate-y-0.5
        "
      >

        <Image
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          width={20}
          height={20}
        />

        <span>Continue with Google</span>
      </button>

      {/* FOOTER */}
      <p className="text-center text-[#8b90a0] mt-8 text-sm">
        Already have an account?{" "}

        <span
          onClick={() => router.replace("/auth/login") }
          className="
            text-white
            font-semibold
            cursor-pointer
            hover:text-[#d1d5db]
            transition-all
          "
        >
          Sign In
        </span>
      </p>

      {/* POWERED BY */}
      <div className="mt-8 pt-6 border-t border-[#1b1f27] text-center">
        <p
          className="
            text-[11px]
            uppercase
            tracking-[0.25em]
            text-[#6b7280]
            font-medium
          "
        >
          Powered by Groq ✨
        </p>
      </div>

    </div>
  </div>
);
};
export default Page;
