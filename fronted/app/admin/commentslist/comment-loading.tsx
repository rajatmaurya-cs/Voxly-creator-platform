import React from "react";
import { MessageSquare } from "lucide-react";

export function CommentModerationSkeleton() {
  return (
    <div className="flex-1 w-full min-w-0 bg-[#050816] text-[#f3f4f6] px-6 py-10 font-sans antialiased flex flex-col h-full animate-pulse">

      {}
      <div className="mb-10 flex flex-col justify-between gap-6 border-b border-white/15 pb-8 md:flex-row md:items-center">

        <div>

          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">

            <MessageSquare className="h-3.5 w-3.5 stroke-[2] text-white/40" />

            <div className="h-3 w-32 rounded bg-white/20" />

          </div>


          <div className="h-8 w-64 rounded-lg bg-white/20 mt-2" />

          <div className="h-4 w-96 rounded bg-white/10 mt-2" />

        </div>



        {}
        <div className="
          flex items-center gap-1.5 
          rounded-2xl border border-white/15 
          bg-white/10 p-1 
          self-start md:self-center 
          shrink-0 w-64 h-10
        " />

      </div>





      {}
      <div className="
        relative flex flex-1 flex-col 
        overflow-hidden rounded-3xl 
        border border-white/15 
        bg-white/[0.06]
      ">

        <div className="relative w-full min-w-0 flex-1 overflow-x-auto">


          <table className="min-w-[900px] w-full border-collapse text-left">

            <thead>

              <tr className="
                text-[10px] font-semibold uppercase 
                tracking-[0.18em] text-white/50 
                border-b border-white/15 
                bg-white/[0.08]
              ">

                <th className="w-[5%] px-5 py-4">ID</th>

                <th className="w-[18%] px-5 py-4">
                  Origin Profile
                </th>

                <th className="w-[42%] px-5 py-4">
                  Transmission Payload
                </th>

                <th className="w-[15%] px-5 py-4">
                  Timestamp
                </th>

                <th className="w-[10%] px-5 py-4">
                  Index Flag
                </th>

                <th className="w-[5%] px-5 py-4 text-center">
                  Action
                </th>

                <th className="w-[5%] px-5 py-4 text-center">
                  Purge
                </th>

              </tr>

            </thead>




            <tbody className="divide-y divide-white/15">


              {[...Array(5)].map((_, i) => (

                <tr key={i} className="align-middle">


                  <td className="px-5 py-5">
                    <div className="h-3 w-4 rounded bg-white/20" />
                  </td>



                  <td className="px-5 py-5">
                    <div className="h-3 w-28 rounded bg-white/20" />
                  </td>



                  <td className="px-5 py-5 font-sans">

                    <div className="space-y-2">

                      <div className="h-3 w-full rounded bg-white/20" />

                      <div className="h-3 w-2/3 rounded bg-white/10" />

                    </div>

                  </td>





                  <td className="px-5 py-5">

                    <div className="h-3 w-16 rounded bg-white/10" />

                  </td>





                  <td className="px-5 py-5">

                    <div className="h-5 w-16 rounded-md bg-white/20" />

                  </td>





                  <td className="px-5 py-5">

                    <div className="mx-auto h-7 w-20 rounded-lg bg-white/10" />

                  </td>





                  <td className="px-5 py-5">

                    <div className="mx-auto h-7 w-7 rounded-lg bg-white/10" />

                  </td>


                </tr>

              ))}


            </tbody>


          </table>


        </div>


      </div>


    </div>
  );
}