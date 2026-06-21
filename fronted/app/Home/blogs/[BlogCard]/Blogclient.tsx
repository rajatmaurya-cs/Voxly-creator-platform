"use client";

import dynamic from "next/dynamic"; 

import React, { lazy, useState, useRef, useEffect, Suspense, useContext } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Report } from 'notiflix/build/notiflix-report-aio';

import Image from "next/image";

import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import { apiFetch } from "@/lib/apiFetch";

import { AuthContext } from "@/app/ContextProvider/AuthProvider";

import {
  MessageSquare,
  Sparkles,
  SendHorizonal,
  FlaskConical,
  Heart,
  FileText
} from "lucide-react";

const Loader = dynamic(() => import("@/app/Animations/Loader"));

const SummariseButton = lazy(() => import("../../../Animations/AIButton"));



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
    _id?: string;
    avatar?: string;
    fullName?: string;
  };
  likes?: string[];
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

  const authContext = useContext(AuthContext);
  const loggedIn = authContext ? authContext.loggedIn : false;

  const [comment, setComment] = useState("");

  const [Aicontent, setAicontent] = useState("")

  const [showContent, setShowContent] = useState<string>('blog');

  const contentRef = useRef<HTMLDivElement | null>(null);

  const queryClient = useQueryClient();

  const blogId = blog._id;

  const { user, refetchUser } = useContext(AuthContext) as any;

  const [localHasLiked, setLocalHasLiked] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(0);
  const [localIsFollowing, setLocalIsFollowing] = useState(false);

  useEffect(() => {
    if (blog) {
      console.log("The user is:", user)
      setLocalLikesCount(blog.likes?.length || 0);
      if (user && blog.likes) {
        setLocalHasLiked(blog.likes.includes(user.id || user._id));
      }
    }
  }, [blog, user]);

  useEffect(() => {
    if (user && blog.createdBy?._id) {
      setLocalIsFollowing(user.following?.includes(blog.createdBy._id));
    }
  }, [user, blog.createdBy?._id]);

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!loggedIn) {
        toast.error("Please login to like this blog");
        router.push("/auth/login");
        throw new Error("Unauthorized");
      }
      const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/like/${blogId}`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to like blog");
      return data;
    },
    onMutate: async () => {
      setLocalHasLiked((prev) => !prev);
      setLocalLikesCount((prev) => (localHasLiked ? prev - 1 : prev + 1));
    },
    onError: (err) => {
      setLocalHasLiked((prev) => !prev);
      setLocalLikesCount((prev) => (localHasLiked ? prev + 1 : prev - 1));
      toast.error(err.message || "Error liking blog");
    },
    onSuccess: (data) => {
      setLocalHasLiked(data.liked);
      queryClient.invalidateQueries({ queryKey: ["blog", blogId] });
    },
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      if (!loggedIn) {
        toast.error("Please login to follow this author");
        router.push("/auth/login");
        throw new Error("Unauthorized");
      }
      const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/follow/${blog.createdBy?._id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to follow author");
      return data;
    },
    onMutate: async () => {
      setLocalIsFollowing((prev) => !prev);
    },
    onError: (err) => {
      setLocalIsFollowing((prev) => !prev);
      toast.error(err.message || "Error following author");
    },
    onSuccess: () => {
      refetchUser();
    },
  });

  const handleLike = () => {
    if (!loggedIn) {
      toast.error("Please login to like this blog");
      router.push("/auth/login");
      return;
    }
    likeMutation.mutate();
  };

  const handleFollow = () => {
    if (!loggedIn) {
      toast.error("Please login to follow this author");
      router.push("/auth/login");
      return;
    }
    followMutation.mutate();
  };

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
      if (data.message) toast.success("Comment added SuccessFully");
      else if (!data.message) toast.error("Your comment violated our community guidelines and has been sent for moderation");
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
      console.log("\n\n The Result of AI Summariser: ",data.content)
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
          "Try again tomorrow Or Upgrade Your Plan",
          "Okay"
        );
      } else {
        toast.error(msg);
      }
    },
  });


  const ailoading = summariseMutation.isPending;



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

      {}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-violet-600/20 blur-[140px] rounded-full" />

        <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-cyan-500/10 blur-[140px] rounded-full" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">

        {}
        <div className="mb-10">

          {}
          <div className="flex items-center gap-3 mb-6 flex-wrap">

            <span className="px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 text-sm font-medium backdrop-blur-xl shadow-lg shadow-cyan-500/10">
              {blog.category}
            </span>



          </div>

          {}
          <h1 className="text-4xl md:text-6xl font-semibold leading-[1.08] tracking-tight mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-500 text-transparent bg-clip-text">
            {blog.title}
          </h1>

          {}
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-4xl mb-8">
            {blog.subTitle}
          </p>

          {}
          <div className="border-y border-white/5 py-6 mb-10">
            <div className="flex items-start justify-between gap-4">

              {}
              <div className="flex items-center gap-4 min-w-0">

                <div className="relative w-12 h-12 shrink-0">
                  <Image
                    src={blog?.createdBy?.avatar || "/man.png"}
                    alt={blog?.createdBy?.fullName || "Author"}
                    fill
                    sizes="48px"
                    className="rounded-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate">
                    {blog.createdBy?.fullName || "Unknown Author"}
                  </h4>

                  <p className="text-xs text-gray-500 mt-0.5">
                    Author
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-500">
                    <span>
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>

                    <span>•</span>

                    <span>{blog.aiAnalysis.words} words</span>

                    <span>•</span>

                    <span>
                      {Math.ceil(blog.aiAnalysis.words / 200)} min read
                    </span>
                  </div>
                </div>
              </div>

              {}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className={`group flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-200 ${localHasLiked
                    ? "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20"
                    : "bg-white/5 border-white/10 text-gray-300 hover:border-rose-500/40 hover:bg-rose-500/10"
                    }`}
                >
                  <Heart
                    size={16}
                    className={`transition-transform duration-200 ${localHasLiked ? "fill-current scale-110" : "group-hover:scale-110"
                      }`}
                  />
                  <span className="font-medium">{localLikesCount}</span>
                </button>

                {blog?.createdBy?._id && <button
                  onClick={handleFollow}
                  disabled={followMutation.isPending}
                  className={`px-5 py-2.5 rounded-full font-medium transition-all duration-200 ${localIsFollowing
                    ? "bg-white/10 text-white border border-white/10"
                    : "bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/25"
                    }`}
                >
                  {localIsFollowing ? "Following" : "Follow"}
                </button>}
              </div>
            </div>
          </div>

        </div>

        {}
        <div className="relative mb-16 group w-[80vw] max-w-[80vw] left-1/2 -translate-x-1/2">

          {}
          <div className="absolute -inset-2 rounded-[36px] bg-gradient-to-r from-violet-600/40 via-cyan-500/30 to-fuchsia-600/40 blur-2xl opacity-60 group-hover:opacity-90 transition duration-700" />

          {}
          <div className="relative rounded-[36px] p-[2px] bg-white/20 shadow-[0_0_50px_rgba(255,255,255,0.08)]">

            <div className="relative w-full overflow-hidden rounded-[34px] border border-white/10 bg-black">

              {}
              <Image
                src={blog.image}
                alt={blog.title}
                width={0}
                height={0}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="w-full h-auto group-hover:scale-[1.03] transition-transform duration-700"
              />

              {}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

              {}
              <div className="absolute inset-0 rounded-[34px] ring-1 ring-white/30 ring-inset pointer-events-none" />

              {}
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

            </div>

          </div>

        </div>

        {}
        <div className="max-w-5xl mx-auto">

          {}
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
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                  }}
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
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                  }}
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
                  <FlaskConical size={18} />
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
    relative
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

              {}
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

              {}
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


















































