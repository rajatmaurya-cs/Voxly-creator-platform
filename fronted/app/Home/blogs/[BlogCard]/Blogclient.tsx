"use client";

import React, { lazy, useState, useRef, useEffect } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Report } from 'notiflix/build/notiflix-report-aio';

import Image from "next/image";

import { useRouter } from "next/navigation";

import { Suspense } from "react";

import toast from "react-hot-toast";

const Loader = dynamic(() => import("@/app/Animations/Loader"))

const SummariseButton = lazy(() => import("../../../Animations/AIButton"))

import { apiFetch } from "@/lib/apiFetch";

import { AuthContext } from "@/app/ContextProvider/AuthProvider";
import { useContext } from "react";

import {
  CalendarDays,
  MessageSquare,
  Sparkles,
  SendHorizonal,
  Clock3,
  FileText,
  FlaskConical
} from "lucide-react";


import dynamic from "next/dynamic";



type Blog = {
  _id?: string;
  title: string;
  subTitle: string;
  content: string;
  category: string;
  image: string;
  isPublished: boolean;
  contentSource: string;
  createdBy?: {
    avatar?: string;
    fullName?: string;
  };
  aiAnalysis: {
    words: number;
    sentences: number;
    paragraphs: number;
    avgSentenceLength: string;
    totalScore: number;
    verdict: string;
  };
  createdAt: string;
  updatedAt: string;
};

type BlogClientProps = {
  blog: Blog;
};

const Blogclient = ({ blog }: BlogClientProps) => {

  const router = useRouter()

  const { loggedIn, setLoggedIn } = useContext(AuthContext);

  const [comment, setComment] = useState("");

  const [Aicontent, setAicontent] = useState("")

  const [showContent, setShowContent] = useState<string>('blog');

  const contentRef = useRef<HTMLDivElement | null>(null);

  const queryClient = useQueryClient();

  const blogId = blog._id;

  const addCommentMutation = useMutation({
    mutationFn: async () => {
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comment/addcomment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: comment,
            blogId,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Comment failed");
      }

      return data;
    },

    onSuccess: (data) => {
      toast.success(data.message || "Comment added");

      setComment("");

      queryClient.invalidateQueries({
        queryKey: ["comments", blogId],
      });
    },

    onError: (err: any) => {
      toast.error(err?.message || "Failed to add comment");
    },
  });


  const summariseMutation = useMutation({


    mutationFn: async () => {
      const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/summarise`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: blog.content }),
      });

      const data = await res.json();
      console.log(data.content)

      if (!data?.success) {
        throw new Error(data?.message || "Summarise failed");
      }

      return data.content;
    },

    onSuccess: (newContent) => {
      setAicontent(newContent)
      setShowContent("AI")
    },

    onError: (err) => {
      const msg =
        err?.message || "Something went wrong";

      if (msg.toLowerCase().includes("limit")) {
        Report.failure(
          "Daily AI Limit Reached",
          "Try again tomorrow",
          "Okay"
        );
      } else {
        toast.error(msg);
      }
    },
  });


  const ailoading = summariseMutation.isPending;


  // const [ailoading, setailoading] = useState(false)

  // const handlerajat = () => {
  //   if (!loggedIn) {
  //     toast.error("Login First")
  //     setTimeout(()=>{router.replace('/auth/login')},3000)
  //     return;
  //   }
  //   setailoading(true)

  //   setTimeout(() => {
  //     setailoading(false)
  //     setAicontent(`
  //       <ul>
  //   <li>Life is comprised of tiny moments that, when accumulated, form the fabric of our reality, significantly impacting our overall satisfaction and engagement.</li>
  //   <li>By intentionally crafting small habits, individuals can transform their lives and create experiences that truly fulfill them.</li>
  //   <li>Morning routines can set the tone for a more intentional life by establishing a sense of calm and clarity.</li>
  //   <li>Engaging in morning practices like meditation, journaling, or stretching can help individuals tackle challenges with greater confidence and resilience.</li>
  //   <li>Fostering connections with others through small habits like sharing meals or engaging in group activities can lead to a greater sense of joy and belonging.</li>
  //   <li>Intentionally prioritizing time with loved ones can lead to a greater sense of fulfillment and happiness, even in the smallest interactions.</li>
  //   <li>Engaging in creative activities can bring a sense of joy and flow into one's life.</li>
  //   <li>Cultivating a growth mindset through small habits like reading books or taking online courses can foster a deeper love for learning and personal growth.</li>
  //   <li>Practicing gratitude through small habits like keeping a gratitude journal or sharing thank-you notes can profoundly shift one's perspective and cultivate a more positive outlook on life.</li>
  //   <li>Intentionally crafting small habits and incorporating them into daily life can transform experiences and create a life that truly fulfills.</li>
  // </ul>

  //         `)
  //     setShowContent('AI')
  //   }, 5000)
  // }

  useEffect(() => {
    if (Aicontent && !ailoading) {
      contentRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [showContent]);


  return (
    <div className="min-h-screen bg-[#050816] text-white relative overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-violet-600/20 blur-[140px] rounded-full" />

        <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-cyan-500/10 blur-[140px] rounded-full" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">

        {/* HERO */}
        <div className="mb-10">

          {/* CATEGORY */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">

            <span className="px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 text-sm font-medium backdrop-blur-xl shadow-lg shadow-cyan-500/10">
              {blog.category}
            </span>



          </div>

          {/* TITLE */}
          <h1 className="text-4xl md:text-6xl font-semibold leading-[1.08] tracking-tight mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-500 text-transparent bg-clip-text">
            {blog.title}
          </h1>

          {/* SUBTITLE */}
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-4xl mb-8">
            {blog.subTitle}
          </p>

          {/* META */}
          <div className="flex flex-wrap items-center gap-5">

            <div className="flex items-center gap-3">

              <div className="relative">

                {/* GLOW */}
                <div className="absolute inset-0 bg-violet-500 blur-xl opacity-40 rounded-full" />

                {/* WHITE OUTER RING */}
                <div className="relative p-[3px] rounded-full bg-gradient-to-br from-white via-gray-200 to-white shadow-[0_0_30px_rgba(255,255,255,0.18)]">

                  {/* INNER IMAGE */}
                  <div className="rounded-full overflow-hidden border border-white/10 bg-[#0B1120]">

                    <Image
                      src={blog?.createdBy?.avatar || '/man.png'}
                      alt="Author"
                      width={56}
                      height={56}
                      priority
                      className="rounded-full object-cover"
                    />

                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-300 font-medium">
                  {blog.createdBy?.fullName || "Unknown Author"}
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CalendarDays size={14} />

                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>

            {/* STATS */}
            <div className="flex items-center gap-3 flex-wrap">

              <div className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <FileText size={15} />
                  {blog.aiAnalysis.words} Words
                </div>
              </div>

              <div className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Clock3 size={15} />
                  {Math.ceil(blog.aiAnalysis.words / 200)} min read
                </div>
              </div>


            </div>
          </div>
        </div>

        {/* IMAGE FIXED */}
        <div className="relative mb-16 group">

          {/* Glow */}
          <div className="absolute -inset-2 rounded-[36px] bg-gradient-to-r from-violet-600/40 via-cyan-500/30 to-fuchsia-600/40 blur-2xl opacity-60 group-hover:opacity-90 transition duration-700" />

          {/* White Premium Border */}
          <div className="relative rounded-[36px] p-[2px] bg-white/20 shadow-[0_0_50px_rgba(255,255,255,0.08)]">

            <div className="relative h-[300px] md:h-[700px] overflow-hidden rounded-[34px] border border-white/10 bg-black">

              {/* Main Image */}
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

              {/* Elegant White Border Line */}
              <div className="absolute inset-0 rounded-[34px] ring-1 ring-white/30 ring-inset pointer-events-none" />

              {/* Top Light Reflection */}
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

            </div>

          </div>

        </div>

        {/* CONTENT */}
        <div className="max-w-5xl mx-auto">

          {/* BLOG CONTENT */}
          <div ref={contentRef}
            className="relative mb-10">

            <div
              className="absolute inset-0 bg-white/[0.03] backdrop-blur-2xl rounded-[30px] border border-white/10" />

            {ailoading && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/20 backdrop-blur-md transition-all">

                <Suspense fallback={<div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />}>
                  <Loader />
                </Suspense>


              </div>
            )}

            <div className="relative p-6 md:p-10">

              {showContent === "blog" ?
                (<div ref={contentRef}
                  className="
                  rich-text
                  prose prose-invert
                  prose-p:text-gray-300
                  prose-headings:text-white
                  prose-strong:text-white
                  prose-a:text-cyan-400
                  prose-img:rounded-2xl
                  max-w-none
                "
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />)
                :
                (<div
                  ref={contentRef}
                  className="ai-summary max-w-none"
                  dangerouslySetInnerHTML={{ __html: Aicontent }}
                />)


              }


            </div>

          </div>


          <div className="w-full flex items-center justify-center mb-10">




            {!ailoading && !Aicontent && (
              <div
                onClick={() => {
                  console.log("The user is: ", loggedIn)
                  if (!loggedIn) {
                    toast.error("Login First");
                    setTimeout(() => { router.replace('/auth/login') }, 2000);
                    return;
                  }
                  summariseMutation.mutate();
                }}
              >
                <SummariseButton data="Summarise with AI" />
              </div>
            )}

            {!ailoading && Aicontent && showContent === "AI" && (
              <button
                onClick={() => setShowContent("blog")}
                className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border border-white/10
        bg-white/[0.05]
        backdrop-blur-xl
        px-7 py-3.5
        text-sm md:text-base
        font-semibold
        text-gray-200
        transition-all duration-300
        hover:bg-white/[0.08]
        hover:border-violet-500/30
        hover:text-white
        hover:scale-[1.03]
        hover:shadow-2xl hover:shadow-violet-500/20
        active:scale-[0.98]
      "
              >
                <span className="flex items-center gap-2">
                  <FileText size={18} />
                  Move To Original Content
                </span>
              </button>
            )}

            {!ailoading && Aicontent && showContent === "blog" &&

              (<button
                className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border border-white/10
        bg-white/[0.05]
        backdrop-blur-xl
        px-7 py-3.5
        text-sm md:text-base
        font-semibold
        text-gray-200
        transition-all duration-300
        hover:bg-white/[0.08]
        hover:border-violet-500/30
        hover:text-white
        hover:scale-[1.03]
        hover:shadow-2xl hover:shadow-violet-500/20
        active:scale-[0.98]
      "

                onClick={() => setShowContent('AI')}>
                  
                  <span className="flex items-center gap-2">
                    <FlaskConical size = {18} />
                    Move to AI Content
                    </span>

                </button>)


            }




          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 md:p-8 mb-10">
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="text-violet-400" size={22} />
              <h3 className="text-2xl font-semibold">AI Analysis</h3>
            </div>

            <div className="flex flex-wrap md:flex-nowrap justify-between gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex-1 min-w-">
                <p className="text-sm text-gray-400 mb-2">Words</p>
                <h4 className="text-2xl font-bold text-white">
                  {blog.aiAnalysis.words}
                </h4>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex-1 min-w-">
                <p className="text-sm text-gray-400 mb-2">Sentences</p>
                <h4 className="text-2xl font-bold text-white">
                  {blog.aiAnalysis.sentences}
                </h4>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex-1 min-w-">
                <p className="text-sm text-gray-400 mb-2">Paragraphs</p>
                <h4 className="text-2xl font-bold text-white">
                  {blog.aiAnalysis.paragraphs}
                </h4>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex-1 min-w-">
                <p className="text-sm text-gray-400 mb-2">Avg Length</p>
                <h4 className="text-lg font-semibold text-white">
                  {Math.round(Number(blog.aiAnalysis.avgSentenceLength))} Words
                </h4>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 md:p-8">

            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="text-cyan-400" size={22} />

              <h2 className="text-2xl font-semibold">
                Add Your Comment
              </h2>
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts on this article..."
              className="
                w-full
                min-h-[180px]
                rounded-[24px]
                bg-white/[0.04]
                border border-white/10
                p-5
                text-gray-200
                placeholder:text-gray-500
                outline-none
                resize-none
                focus:border-cyan-500/50
                focus:bg-white/[0.06]
                transition-all duration-300
              "
            />

            <button
              onClick={() => addCommentMutation.mutate()}
              disabled={addCommentMutation.isPending}
              className="
    mt-6

    flex items-center justify-center gap-2

    rounded-2xl
    border border-white/10
    bg-white/[0.06]

    px-6 py-3

    text-sm font-medium
    tracking-wide
    text-white

    backdrop-blur-xl
    transition-all duration-300

    hover:bg-white/[0.09]
    hover:border-white/20
    hover:-translate-y-[1px]

    active:scale-[0.98]

    disabled:opacity-50
    disabled:cursor-not-allowed
    disabled:hover:translate-y-0
  "
            >
              {addCommentMutation.isPending ? (
                "Posting..."
              ) : (
                <>
                  <span>Post Comment</span>

                  <SendHorizonal
                    size={16}
                    className="opacity-80"
                  />
                </>
              )}

              {/* subtle inner border */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 pointer-events-none" />
            </button>

            <div
              className="
    mt-6
    flex items-start gap-4
    rounded-2xl
    border border-amber-500/20
    bg-amber-500/5
    backdrop-blur-xl
    px-5 py-4
  "
            >

              {/* ICON */}
              <div
                className="
      shrink-0
      w-10 h-10
      rounded-xl
      bg-amber-500/10
      border border-amber-500/20
      flex items-center justify-center
    "
              >
                <Sparkles
                  size={18}
                  className="text-amber-300"
                />
              </div>


              <div>

                <h3 className="text-sm md:text-base font-semibold text-amber-200 mb-1">
                  AI Moderated Comments
                </h3>

                <p className="text-sm leading-6 text-amber-100/70">
                  Comments are automatically reviewed by our AI moderation system.
                  Spam, abusive, toxic, or inappropriate comment will be rejected
                  instantly.
                </p>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogclient;







// const summariseMutation = useMutation({

//   mutationFn: async () => {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/summarise`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ content: blog.content }),
//     });

//     const data = await res.json();
//     console.log(data.content)

//     if (!data?.success) {
//       throw new Error(data?.message || "Summarise failed");
//     }

//     return data.content;
//   },

//   onSuccess: (newContent) => {
//     setAicontent(newContent)
//     setShowContent("AI")
//   },

//   onError: (err) => {
//     const msg =
//       err?.message || "Something went wrong";

//     if (msg.toLowerCase().includes("limit")) {
//       Report.failure(
//         "Daily AI Limit Reached",
//         "Try again tomorrow",
//         "Okay"
//       );
//     } else {
//       toast.error(msg);
//     }
//   },
// });


// const ailoading = summariseMutation.isPending;