'use client'
import React from 'react'
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
const page = () => {

  const router = useRouter();

  return (
    <div className='min-w-full min-h-screen flex border-4 border-green-500 justify-center items-center flex-col space-y-5'>

      <button onClick={() => {
        toast.success("Login successfull")
      }}
        className='bg-gray-200 text-black px-4 py-2 rounded-full ' >Success</button>

      <button onClick={() => {
        toast.error("Solve this Issue")
      }}
        className='bg-gray-200 text-black px-4 py-2 rounded-full '  >Error</button>

      <button onClick={() => {
        toast("Your Plan limit reached", {
          description: `Your limit will reset at ${new Date(
            Date.now() + 12 * 60 * 60 * 1000
          ).toLocaleString("en-IN", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}`,
          action: {
            label: "Upgrade",
            onClick: () => router.push("/plans"),
          },
        })
      }}
        className='bg-gray-200 text-black px-4 py-2 rounded-full ' >Use AI</button>

      <button onClick={() => {
        toast.loading("Initiating payment request...", { id: "payment-toast" });
        setTimeout(() => {
          toast.success("Initiating payment request...", { id: "payment-toast" });
        }, 4000)
      }}
        className='bg-gray-200 text-black px-4 py-2 rounded-full ' >Pay Now</button>





    </div>
  )
}

export default page