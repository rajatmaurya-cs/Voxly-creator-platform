'use client';

import React, {
  useState,
  Suspense,
  lazy,
  useMemo,
  useEffect,
} from "react";

import dynamic from "next/dynamic";

import EditorLoader from '@/app/Animations/EditorLoader'



import Loader from "@/app/Animations/Loader";

import AIButton from "@/app/Animations/AIButton";

import { Listbox } from '@headlessui/react'

import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";




import { blogCategories } from "@/app/assets/assets";

import Image from "next/image";

import BlogReport from "@/app/pop-up/blogreport/page";

import { ImagePlus, X } from "lucide-react";

import { apiFetch } from "@/lib/apiFetch";

// ---------------- TYPES ----------------

type Analysis = {
  avgSentenceLength: string;
  paragraphs: number;
  sentences: number;
  totalScore: number;
  verdict: "Good" | "Average" | "Poor" | string;
  words: number;
};

type ContentType = "ai" | "human";

const Button = dynamic(() => import("@/app/Animations/AIButton"), {
  ssr: false,
});


const editorConfig = {
  height: 600,

  menubar: false,
  statusbar: false,
  branding: false,

  skin: "oxide-dark",
  content_css: "dark",

  plugins: [
    "advlist",
    "autolink",
    "lists",
    "link",
    "charmap",
    "preview",
    "anchor",
    "searchreplace",
    "visualblocks",
    "code",
    "fullscreen",
    "insertdatetime",
    "table",
    "help",
    "wordcount",
    "codesample",
  ],

  toolbar: `
    undo redo |
    blocks fontfamily fontsize |
    bold italic underline strikethrough |
    forecolor backcolor |
    alignleft aligncenter alignright alignjustify |
    bullist numlist outdent indent |
    table blockquote codesample |
    link charmap |
    removeformat |
    fullscreen preview code
  `,

  toolbar_mode: "wrap",

  content_style: `
    body {
      background: #11141a;
      color: #f3f4f6;
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      line-height: 1.8;
      padding: 1rem;
    }
  `,
};

const models = [
  { id: 'llama-3.1-8b-instant', name: 'Meta 3.2', desc: 'Fast' },
  { id: 'groq/compound', name: 'Claude', desc: 'Advanced code & Debugging' },
  { id: 'llama-3.3-70b-versatile', name: 'Copilot', desc: 'Advanced Math Problems' },
  { id: 'openai/gpt-oss-120b', name: 'ChatGPT 5.1', desc: 'Tough Reasoning' },
]

const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] flex items-center justify-center rounded-xl border border-zinc-800">
        <EditorLoader size={90} border={10} />
      </div>
    ),
  }
);

const AddBlog = () => {

  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [subTitle, setSubTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("startup");
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [contentType, setContentType] = useState<ContentType>("human");

  const [model , setModel] = useState<string>(models[0].id)

  const selectedModel = models.find((m) => m.id === model);


  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [showReport, setShowReport] = useState<boolean>(false);

  // ---------------- IMAGE PREVIEW ----------------
  const previewUrl = useMemo(() => {
    return image ? URL.createObjectURL(image) : null;
  }, [image]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // ---------------- AI CONTENT ----------------
  const generateContentMutation = useMutation({
    mutationFn: async ({
      title,
      subTitle,

    }: {
      title: string;
      subTitle: string;
    }) => {
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ai/Generatecontent`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ title, subTitle , model , }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "AI generation failed");
      }

      return String(data.content ?? "");
    },

    onSuccess: (html: string) => {
      setContent(html.trim());
      setContentType("ai");
      toast.success("AI content generated");
    },

    onError: (err: any) => {
      toast.error(err?.message || "AI generation failed");
    },
  });

  // ---------------- REPORT ----------------
  const generateReportMutation = useMutation({
    mutationFn: async (htmlContent: string) => {
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/blog/Report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: htmlContent }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Report failed");
      }

      return data.Report as Analysis;
    },

    onSuccess: (report: Analysis) => {
      setAnalysis(report);
      setShowReport(true);
      console.log(report)
      toast.success("Report generated");
    },

    onError: (err: any) => {
      toast.error(err?.message || "Report failed");
    },
  });

  // ---------------- ADD BLOG ----------------
  const addBlogMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/blog/addblog`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Upload failed");
      }

      return data;
    },

    onSuccess: () => {
      toast.success("Blog added successfully");

      queryClient.invalidateQueries({ queryKey: ["blogs"] });

      setTitle("");
      setSubTitle("");
      setCategory("startup");
      setIsPublished(false);
      setContent("");
      setImage(null);
      setContentType("human");
      setAnalysis(null);
      setShowReport(false);
    },

    onError: (err: any) => {
      toast.error(err?.message || "Upload failed");
    },
  });

  // ---------------- HANDLERS ----------------
  const handleGenerateContent = () => {
    if (!title.trim()) return toast.error("Title required");
    if (!subTitle.trim()) return toast.error("Subtitle required");
    if (!image) return toast.error("Image Thumbnail is Missing");



    generateContentMutation.mutate({
      title,
      subTitle,
    });
  };

  const handleGenerateReport = () => {
    if (!content.trim()) return toast.error("Write content first");

    generateReportMutation.mutate(content);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!analysis) return toast.error("Generate report first");
    if (!image) return toast.error("Image required");

    const blog = {
      title,
      subTitle,
      content,
      category,
      isPublished,
      aiAnalysis: analysis,
      contentSource: contentType,
    };

    const formData = new FormData();
    formData.append("blog", JSON.stringify(blog));
    formData.append("image", image);

    addBlogMutation.mutate(formData);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB");
      return;
    }

    setImage(file);
  };

  // ---------------- RENDER ----------------
  return (
    <div className="min-h-screen bg-[#0b0d11] text-[#f3f4f6]">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-8 py-4 sm:py-8">

        {/* TOP BAR */}
        <div
          className="
        mb-5 sm:mb-8
        flex flex-col gap-4
        rounded-3xl
        border border-[#1b1f27]
        bg-[#11141a]
        p-5 sm:p-7
      "
        >
          <div className="flex items-start justify-between gap-4">

            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                Create New Blog
              </h1>

              <p className="mt-2 text-sm sm:text-[15px] text-[#8b90a0] max-w-xl leading-relaxed">
                Draft, review and publish articles with AI-powered assistance.
              </p>
            </div>

          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5"
        >

          {/* LEFT SIDE */}
          <div className="space-y-5">

            {/* TITLE + SUBTITLE */}
            <div
              className="
            rounded-3xl
            border border-[#1b1f27]
            bg-[#11141a]
            p-4 sm:p-6
            space-y-5
          "
            >

              <div>
                <label className="mb-2 block text-sm text-[#9ca3af]">
                  Blog Title
                </label>

                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter blog title..."
                  className="
                h-12 sm:h-14
                w-full
                rounded-2xl
                border border-[#222733]
                bg-[#171b22]
                px-4
                text-[15px]
                text-white
                placeholder:text-[#646b7a]
                outline-none
                transition-all
                focus:border-[#3a4252]
              "
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-[#9ca3af]">
                  Subtitle
                </label>

                <textarea
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  placeholder="Write a short subtitle..."
                  rows={3}
                  className="
                w-full
                resize-none
                rounded-2xl
                border border-[#222733]
                bg-[#171b22]
                px-4 py-3
                text-[15px]
                text-white
                placeholder:text-[#646b7a]
                outline-none
                transition-all
                focus:border-[#3a4252]
              "
                />
              </div>

            </div>

            {/* EDITOR */}
            <div
              className="
            overflow-hidden
            rounded-3xl
            border border-[#1b1f27]
            bg-[#11141a]
          "
            >

              <div
                className="
              flex items-center justify-between
              border-b border-[#1e232d]
              px-4 sm:px-6 py-4
            "
              >
                <div>
                  <h2 className="text-[15px] font-medium text-[#f3f4f6]">
                    Content Editor
                  </h2>

                  <p className="mt-1 text-sm text-[#7f8696]">
                    Write your article content here
                  </p>
                </div>

                <div
                  className="
                hidden sm:flex
                items-center gap-2
                rounded-xl
                bg-[#171b22]
                px-3 py-2
                text-xs text-[#9ca3af]
              "
                >
                  TinyMCE Editor
                </div>
              </div>

              <div className="relative">

                {mounted ? (
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINYMCE_KEY || ""}
                    value={content}
                    onEditorChange={setContent}
                    init={editorConfig}
                  />
                ) : (<div className="h-[600px] rounded-xl bg-zinc-900 animate-pulse" />)}

                {generateContentMutation.isPending && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0b0d11]/80 backdrop-blur-sm">

                    <Suspense
                      fallback={
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#2b3140] border-t-[#d5d7de]" />
                      }
                    >
                      <Loader data="Generating" />
                    </Suspense>

                  </div>
                )}

              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-5">

            {/* SETTINGS */}
            <div
              className="
            rounded-3xl
            border border-[#1b1f27]
            bg-[#11141a]
            p-5
          "
            >

              <h3 className="text-[15px] font-medium text-white">
                Blog Settings
              </h3>

              <div className="mt-5 space-y-5">

                {/* CATEGORY */}
                <div>
                  <label className="mb-2 block text-sm text-[#9ca3af]">
                    Category
                  </label>

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="
                  h-12
                  w-full
                  rounded-2xl
                  border border-[#222733]
                  bg-[#171b22]
                  px-4
                  text-sm text-white
                  outline-none
                  focus:border-[#3a4252]
                "
                  >
                    {blogCategories.map((c) => (
                      <option
                        key={c}
                        value={c}
                        className="bg-[#171b22]"
                      >
                        {c}
                      </option>
                    ))}
                  </select>
                </div>


                {/* IMAGE */}

                <div>
                  <label className="mb-2 block text-sm text-[#9ca3af]">
                    Cover Image
                  </label>

                  <div className="overflow-hidden rounded-2xl border border-[#232938] bg-[#14181f]">

                    <div className="relative h-52">

                      <label
                        className="
          flex h-full w-full cursor-pointer
          items-center justify-center
          overflow-hidden
          transition hover:bg-[#181d25]
        "
                      >

                        {previewUrl ? (
                          <Image
                            src={previewUrl}
                            alt="Preview"
                            width={1200}
                            height={500}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center">

                            <div
                              className="
                flex h-14 w-14 items-center justify-center
                rounded-2xl
                bg-[#1d2330]
                text-[#d1d5db]
              "
                            >
                              <ImagePlus size={24} />
                            </div>

                            <p className="mt-4 text-sm font-medium text-[#f3f4f6]">
                              Upload cover image
                            </p>

                            <p className="mt-1 text-xs text-[#7c8393]">
                              PNG, JPG, WEBP up to 10MB
                            </p>
                          </div>
                        )}

                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>

                      {previewUrl && (
                        <button
                          type="button"
                          onClick={() => setImage(null)}
                          className="
            absolute right-3 top-3
            flex h-8 w-8 items-center justify-center
            rounded-full
            bg-black/50
            text-white
            transition hover:bg-black/70
          "
                        >
                          <X size={16} />
                        </button>
                      )}

                    </div>

                    {image && (
                      <div className="border-t border-[#1f2430] px-4 py-3">

                        <p className="truncate text-sm text-[#e5e7eb]">
                          {image.name}
                        </p>

                        <p className="mt-1 text-xs text-[#7c8393]">
                          {(image.size / 1024 / 1024).toFixed(2)} MB
                        </p>

                      </div>
                    )}

                  </div>
                </div>


                {/* PUBLISH */}
                <div
                  className="
                rounded-2xl
                border border-[#222733]
                bg-[#171b22]
                p-4
                space-y-3
              "
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">
                        Publish instantly
                      </p>

                      <p className="mt-1 text-xs text-[#7b8190]">
                        Make blog public after upload
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsPublished((prev) => !prev)}
                      className={`
                    relative h-7 w-14 rounded-full transition-all
                    ${isPublished ? "bg-[#314056]" : "bg-[#2a2f3b]"}
                  `}
                    >
                      <span
                        className={`
                      absolute top-1 h-5 w-5 rounded-full bg-white transition-all
                      ${isPublished ? "left-8" : "left-1"}
                    `}
                      />
                    </button>
                  </div>

                  {/* Status Indicator Bar */}
                  <div className="flex items-center gap-2 rounded-xl bg-[#0b0d11] border border-[#222733]/60 px-3 py-2 text-xs">
                    <div
                      className={`
                    h-2 w-2 rounded-full
                    ${isPublished ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)] animate-pulse" : "bg-zinc-500"}
                  `}
                    />
                    <span className="text-[#8b90a0] font-medium">Status:</span>
                    <span className={`font-semibold ${isPublished ? "text-green-400" : "text-zinc-400"}`}>
                      {isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>

              </div>

            </div>

            {/* ACTIONS */}
            <div
              className="
            rounded-3xl
            border border-[#1b1f27]
            bg-[#11141a]
            p-5
            space-y-4
          "
            >
              {/* AI MODEL SELECTOR */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#7b8190]">
                  AI Model
                </label>
                
                <div className="flex items-center gap-3">
                  {/* Selected Model Logo */}
                  <div className="flex-shrink-0 h-12 w-12 rounded-2xl border border-[#222733] bg-[#171b22] flex items-center justify-center p-2">
                    {model === 'llama-3.3-70b-versatile' && <Image src="/copilot.png" className="object-contain" width={32} height={32} alt="Copilot" />}
                    {model === 'llama-3.1-8b-instant' && <Image src="/meta.png" className="object-contain" width={32} height={32} alt="Meta" />}
                    {model === 'groq/compound' && <Image src="/claude.png" className="object-contain" width={32} height={32} alt="Claude" />}
                    {model === 'openai/gpt-oss-120b' && <Image src="/chatgpt.png" className="object-contain" width={32} height={32} alt="ChatGPT" />}
                  </div>

                  {/* Listbox Dropdown */}
                  <div className="flex-1 relative">
                    <Listbox value={model} onChange={setModel}>
                      <div className="relative">
                        <Listbox.Button className="h-12 w-full rounded-2xl border border-[#222733] bg-[#171b22] px-4 text-left text-sm text-white font-medium focus:border-[#3a4252] outline-none flex items-center justify-between transition-all hover:border-zinc-700">
                          <span>{selectedModel?.name || "Select Model"}</span>
                          <span className="text-[#7b8190] text-xs">▼</span>
                        </Listbox.Button>

                        <Listbox.Options className="absolute bottom-full mb-2 right-0 left-0 w-full bg-[#171b22] rounded-2xl border border-[#222733] z-50 max-h-60 overflow-y-auto shadow-2xl focus:outline-none divide-y divide-[#1f2430]">
                          {models.map((item) => (
                            <Listbox.Option
                              key={item.id}
                              value={item.id}
                              className={({ active, selected }) => `
                                px-4 py-3 text-sm cursor-pointer transition-all flex flex-col gap-0.5
                                ${active ? "bg-[#1d2430] text-white" : "text-[#d1d5db]"}
                                ${selected ? "bg-[#1d2430]/60 text-indigo-400 font-bold" : ""}
                              `}
                            >
                              <span className="font-semibold text-white">{item.name}</span>
                              <span className="text-xs text-[#7b8190]">{item.desc}</span>
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateContent}
              >
                {generateContentMutation.isPending
                  ? "Generating..."
                  : <AIButton />}
              </button>

              {!analysis ? (
                <button
                  type="button"
                  onClick={handleGenerateReport}
                  disabled={
                    generateReportMutation.isPending || !content
                  }
                  className="
                flex h-12 w-full items-center justify-center
                rounded-2xl
                border border-[#262c37]
                bg-[#171b22]
                text-sm font-medium text-[#d1d5db]
                transition-all
                hover:bg-[#1d2129]
                disabled:opacity-50
              "
                >
                  {generateReportMutation.isPending
                    ? "Analyzing..."
                    : "Review Content"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowReport(true)}
                  className="
                flex h-12 w-full items-center justify-center
                rounded-2xl
                border border-[#2d3a32]
                bg-[#18211b]
                text-sm font-medium text-[#c7e0cf]
              "
                >
                  View Review Report
                </button>
              )}

              <button
                type="submit"
                disabled={addBlogMutation.isPending}
                className={`mt-2 flex h-12 w-full items-center justify-center rounded-2xl text-sm font-semibold text-white transition-all duration-200 ${addBlogMutation.isPending
                  ? "bg-transparent cursor-not-allowed"
                  : "bg-[#1d2430] hover:bg-[#252d3a]"
                  }`}
              >
                {addBlogMutation.isPending ? (
                  <EditorLoader size={40} border={8} />
                ) : (
                  "Submit Blog"
                )}
              </button>

            </div>

          </div>

        </form>

        {/* REPORT MODAL */}
        {showReport && analysis && (
          <BlogReport
            analysis={analysis}
            type={contentType}
            onClose={() => setShowReport(false)}
          />
        )}

      </div>
    </div>
  );
};

export default AddBlog;