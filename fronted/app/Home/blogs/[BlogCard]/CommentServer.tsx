import CommentClient from "./CommentClient";

type BlogId = {
  Id: string;
};

type CreatedBy = {
  _id: string;
  fullName: string;
  email: string;
  avatar: string;
};

type Comment = {
  _id: string;
  content: string;
  blogId: string;
  createdBy: CreatedBy;
  riskLevel: "SAFE" | "MODERATE" | "HIGH";
  isApproved: boolean;
  moderatedBy: string | null;
  moderatedAt: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type CommentResponse = {
  success: boolean;
  message: string;
  comments: Comment[];
};

const Commentserver = async ({ Id }: BlogId) => {
  const start: number = Date.now();

  
  
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/comment/allcomment/${Id}`,
    {
      method: "GET",
      cache: "no-store", 
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch comments");
  }

  const data: CommentResponse = await res.json();

  const end: number = Date.now();

  console.log(
    "The time taken to fetch the comments:",
    ((end - start) || 0) / 1000
  );

  return (
    <div>
      <CommentClient comments={data.comments} />
    </div>
  );
};

export default Commentserver;