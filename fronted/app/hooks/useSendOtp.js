
import { apiFetch } from "@/lib/apiFetch";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import toast from "react-hot-toast";

export default function useSendOtp(purpose) {
    const [otpSent, setOtpSent] = useState(false);

    const mutation = useMutation({

        mutationFn: async ({ email }) => {

            const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sendotp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    purpose,
                }),
            });

            const data = await res.json();

            return data;

        },

        onSuccess: (data) => {
            if (data?.success) {
                toast.success(data.message || "OTP sent successfully");
                setOtpSent(true);
            } else {
                toast.error(data?.message || "Failed to send OTP");
            }
        },
        onError: (err) => {
            console.log(err.response.message)
            toast.error(err?.response?.data?.message || err.message || "Failed to Send OTP");
        },
    });

    return {
        sendOtp: (email) => mutation.mutate({ email }),

        sending: mutation.isPending,

        otpSent,
        
        setOtpSent,
    };
}
