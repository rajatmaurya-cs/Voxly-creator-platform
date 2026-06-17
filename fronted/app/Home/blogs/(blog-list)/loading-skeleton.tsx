import React from "react";
export function BlogGridSkeleton() {
  return (
    <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3 animate-pulse">

      {[...Array(3)].map((_, i) => (

        <div
          key={i}
          className="
          overflow-hidden rounded-3xl 
          border border-white/15 
          bg-white/[0.07] 
          backdrop-blur-xl
          "
        >

          {/* IMAGE SKELETON */}
          <div className="
            relative h-60 w-full 
            bg-white/[0.10] 
            overflow-hidden
          ">

            <div
              className="
              absolute left-4 top-4 
              rounded-full 
              border border-white/15 
              bg-white/[0.08] 
              px-3 py-1 
              w-20 h-6
              "
            />

          </div>





          {/* CONTENT SKELETON */}
          <div className="space-y-5 p-5">


            <div className="space-y-2">

              <div className="
                h-6 bg-white/20 
                rounded-lg w-11/12
              " />

              <div className="
                h-6 bg-white/20 
                rounded-lg w-2/3
              " />

            </div>


            {/* AUTHOR SKELETON */}
            <div className="
              flex items-center justify-between gap-3 
              border-t border-white/15 
              pt-4
            ">


              <div className="flex items-center gap-3">


                <div
                  className="
                  rounded-full 
                  border-2 border-white/15 
                  p-1 
                  w-12 h-12 
                  bg-white/20
                  "
                />


                <div className="space-y-2">


                  <div className="
                    h-4 bg-white/15 
                    rounded w-24
                  " />


                  <div className="
                    h-3 bg-white/10 
                    rounded w-16
                  " />


                </div>


              </div>




              <div
                className="
                rounded-full 
                border border-white/15 
                bg-white/[0.10] 
                w-12 h-6
                "
              />


            </div>


          </div>


        </div>

      ))}

    </div>
  );
}