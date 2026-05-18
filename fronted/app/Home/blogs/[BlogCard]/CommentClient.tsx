import Moment from "moment";

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
  createdAt: string;
};

type Props = {
  comments: Comment[];
};

const CommentClient = ({ comments }: Props) => {
  return (
    <section className="max-w-5xl mx-auto relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#060816] via-[#0a1020] to-[#071425] p-6 md:p-8 shadow-[0_0_60px_rgba(0,140,255,0.08)]">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,180,255,0.08),transparent_35%)] pointer-events-none" />

      {/* Heading */}
      <div className="relative flex items-start justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Comments ({comments.length})
          </h2>

          <p className="text-zinc-400 mt-1 text-sm">
            Community discussion on this article
          </p>
        </div>

        <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-6 h-6 text-cyan-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 8.25h9m-9 3h6m-9 8.25h15A2.25 2.25 0 0021.75 17.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5z"
            />
          </svg>
        </div>
      </div>

      {/* Comments */}
      <div className="relative space-y-4">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="rounded-[1.8rem] border border-white/10 bg-gradient-to-r from-white/[0.03] to-white/[0.015] p-5 md:p-6 backdrop-blur-xl"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-md" />

                <img
                  src={comment.createdBy.avatar}
                  alt={comment.createdBy.fullName}
                  className="relative w-12 h-12 rounded-full object-cover border-2 border-white/10"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-[18px] leading-none">
                  {comment.createdBy.fullName}
                </h3>

                <p className="text-sm text-zinc-500 mt-1">
                  {Moment(comment.createdAt).fromNow()}
                </p>

                <p className="mt-5 text-zinc-300 text-[15px] leading-7 break-words">
                  {comment.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CommentClient;