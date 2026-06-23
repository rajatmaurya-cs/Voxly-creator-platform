'use client'
import { useEffect, useState, useRef } from "react";

import { useRouter } from "next/navigation";

import OtpInput from "react-otp-input";

import {toast } from "sonner";

import { useMutation } from "@tanstack/react-query";

import Image from "next/image";

import useSendOtp from '@/app/hooks/useSendOtp'

import useVerifyOtp from "@/app/hooks/useVeriyOtp";
import EditorLoader from "@/app/Animations/EditorLoader";
import AvatarEditor from "react-avatar-editor";

const Page = () => {

  const router = useRouter()

  const [fullName, setFullname] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [avatarFile, setAvatarFile] = useState(null);

  const [avatarPreview, setAvatarPreview] = useState("");

  const [tempImage, setTempImage] = useState(null);

  const [scale, setScale] = useState(1.2);

  const editorRef = useRef(null);

const handleAvatarChange = (e) => {
  
  const file = e.target.files?.[0];

  if (!file) return;

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
     "image/jpg",
  ];

  if (!allowedTypes.includes(file.type)) {
    toast.error(
      "Only JPG, PNG, WEBP images are allowed"
    );
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    toast.error("Image size must be less than 5MB");
    return;
  }

  setTempImage(file);

  e.target.value = "";

};

  const handleSaveCrop = () => {
    if (!editorRef.current) return;

    const canvas = editorRef.current.getImageScaledToCanvas();

    canvas.toBlob((blob) => {
      if (!blob) {
        toast.error("Failed to crop image");
        return;
      }
      const croppedFile = new File([blob], "avatar.jpg", { type: "image/jpeg" });
      
      setAvatarFile(croppedFile);

      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }

      setAvatarPreview(URL.createObjectURL(croppedFile));
      setTempImage(null);
      setScale(1.2);
    }, "image/jpeg");
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

    {}
    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#3b82f6]/10 blur-[140px] rounded-full pointer-events-none"></div>
    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#8b5cf6]/10 blur-[140px] rounded-full pointer-events-none"></div>

    {}
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

      {}
      <div className="text-center space-y-3 mb-8">

        {}
        <div className="flex items-center justify-center  mb-4">
          <div className="relative w-25 h-25 shrink-0">
            <Image
              src="/pixel.png"
              alt="Veyra Logo"
              fill
              sizes="100px"
              className="object-contain"
              priority
            />
          </div>
          <span
            className="text-2xl font-bold tracking-widest uppercase bg-gradient-to-r from-indigo-200 via-white to-violet-400 bg-clip-text text-transparent"
            style={{ fontFamily: "var(--font-orbitron)", letterSpacing: "0.18em" }}
          >
            Veyra
          </span>
        </div>

        <h2
          className="
            text-3xl
            font-semibold
            tracking-tight
            text-white
          "
        >
          Create Account 
        </h2>

        <p className="text-sm text-[#8b90a0] leading-relaxed">
          Join the premium AI blog experience.
        </p>
      </div>

      {}
      <form
        onSubmit={handleSignup}
        className="flex flex-col gap-5"
      >

        {}
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

        {}
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

        {}
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

        {}
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

        {}
        {isVerified && (
          <button
            type="submit"
            disabled={isCreating}
            className={
              isCreating
                ? "flex h-14 w-full items-center justify-center bg-transparent border-none pointer-events-none mt-2"
                : `
                  flex
                  h-14
                  w-full
                  items-center
                  justify-center
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
                `
            }
          >
            {isCreating ? <EditorLoader size={40} border={2}/> : "Create Account"}
          </button>
        )}
      </form>

      {}
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
            onChange={(newOtp) => {
              setOtp(newOtp);
              if (newOtp.length === 6 && !isVerifying && !isVerified) {
                verifyOtp(email, newOtp);
              }
            }}
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

      {}
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

      {}
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

      {}
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

    </div>

    {tempImage && (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0b0d11]/80 backdrop-blur-md p-4">
        <div className="bg-[#11141a] border border-[#1b1f27] rounded-[2rem] p-6 max-w-sm w-full flex flex-col items-center gap-5 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)]">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-semibold text-white">Adjust Avatar</h3>
            <p className="text-xs text-[#8b90a0]">Zoom and drag to fit the circle</p>
          </div>
          
          <div className="overflow-hidden rounded-2xl bg-[#171b22] border border-[#222733] p-1 flex items-center justify-center relative w-[240px] h-[240px]">
            <AvatarEditor
              ref={editorRef}
              image={tempImage}
              width={200}
              height={200}
              border={10}
              borderRadius={100}
              color={[17, 20, 26, 0.6]}
              scale={scale}
            />
          </div>

          <div className="w-full space-y-2">
            <div className="flex justify-between text-xs text-[#8b90a0]">
              <span>Zoom</span>
              <span>{scale.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-[#171b22] rounded-lg appearance-none"
            />
          </div>

          <div className="flex gap-3 w-full mt-2">
            <button
              type="button"
              onClick={() => {
                setTempImage(null);
                setScale(1.2);
              }}
              className="flex-1 h-12 rounded-2xl border border-[#222733] bg-[#171b22] text-[#d1d5db] font-medium hover:bg-[#1d2129] transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveCrop}
              className="flex-1 h-12 rounded-2xl bg-[#f3f4f6] text-[#0f1115] font-semibold hover:bg-white transition-all flex items-center justify-center shadow-lg shadow-white/5"
            >
              Save Avatar
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
};
export default Page;
