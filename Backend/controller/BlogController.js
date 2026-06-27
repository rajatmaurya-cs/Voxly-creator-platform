import Blog from '../Models/Blog.js'
import fs from 'fs'
import imageKit from '../Config/imagekit.js'
import { convertHtmlToText } from '../utils/htmlToPlainText.js'
import { analyzeContent } from "../utils/contentAnalyzer.js";

export const addBlog = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Login required",
      });
    }

    let blogData;
    try {
      blogData = JSON.parse(req.body.blog);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog data format",
      });
    }


    const {
      title,
      subTitle,
      content,
      category,
      isPublished,
      aiAnalysis,
      contentSource,
    } = blogData;


    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Blog image is required",
      });
    }


    const fileBuffer = fs.readFileSync(req.file.path);

    const uploadResponse = await imageKit.upload({
      file: fileBuffer,
      fileName: `${Date.now()}-${req.file.originalname}`,
      folder: "/VEYRA-Blogs",
    });

    if (!uploadResponse?.url) {
      throw new Error("Image upload failed");
    }


    await Blog.create({
      title,
      subTitle,
      content,
      category,
      image: uploadResponse.url,

      isPublished: Boolean(isPublished),

      createdBy: req.user.id,

      contentSource: contentSource || "human",

      aiAnalysis: aiAnalysis || null,
    });

    return res.status(201).json({
      success: true,
      message: "Blog added successfully",
    });
  } catch (error) {
    console.error("AddBlog Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};



export const getallblog = async (req, res) => {
  try {


    const page = Math.max(parseInt(req.query.page || "1", 10), 1);

    const limit = Math.min(Math.max(parseInt(req.query.limit || "8", 10), 1), 50);

    const skip = (page - 1) * limit;

    const category = req.query.category;


    const filter = {};


    if (category && category !== "All") filter.category = category;


    filter.isPublished = true;

    const blogs = await Blog.find(filter)
      .select("-content -aiAnalysis -subTitle")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("moderatedBy", "fullName")
      .populate("createdBy", "fullName avatar")
      .lean();

    const total = await Blog.countDocuments(filter);

    const hasMore = skip + blogs.length < total;

    return res.json({
      success: true,
      blogs,
      hasMore,
      nextPage: hasMore ? page + 1 : null,
      page,
      limit,
      total,
    });




  } catch (error) {
    console.error("GET ALL BLOG ERROR ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const BlogUserDashboard = async (req, res) => {




await new Promise(resolve => setTimeout(resolve, 3000));

  const page = parseInt(req.query.page, 10) || 1;

  const limit = parseInt(req.query.limit, 10) || 10;

  const skip = (page - 1) * limit;


  const filter = {
    createdBy: req.user.id,
  };

  const total = await Blog.countDocuments(filter);

  const blogs = await Blog.find(filter)
    .select("-content -aiAnalysis -subTitle")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("moderatedBy", "fullName")
    .populate("createdBy", "fullName email")
    .lean();

  const hasMore = skip + blogs.length < total;

  return res.json({
    success: true,
    blogs,
    hasMore,
    nextPage: hasMore ? page + 1 : null,
    page,
    limit,
    total,
  });
};





export const getblogbyid = async (req, res) => {
  try {


    const { blogId } = req.params;

    console.log("Entered in blogbyId: ", blogId)



    const blog = await Blog.findById(blogId).populate("createdBy", "fullName email avatar");





    if (!blog) return res.json({ success: false, message: "Blog not found" })

    res.json({
      success: true,
      blog,
    });

  }
  catch (error) {
    res.json({ success: false, message: error.message })

  }
}




export const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.body;

   await new Promise(resolve => setTimeout(resolve, 5000));

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });


    const deletedBlog = await Blog.findByIdAndDelete(blogId);

    if (!deletedBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};




export const toggleblogpublish = async (req, res) => {
  try {






    console.log("Entered in toggleblegpublish")


    const { blogId } = req.body;


    const blog = await Blog.findById(blogId);

    console.log("The blog that has to be delete : ", blog.title)


    if (!blog) {
      return res.json({
        success: false,
        message: "Blog not found with this ID"
      });
    }

    console.log("The current Status of blog is: ", blog.isPublished)

    blog.isPublished = !blog.isPublished;



    await blog.save();

    console.log("Now after the current status blog: ", blog.isPublished)

    res.json({ success: true, message: "Blog updated status successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};





export const GenerateReport = (req, res) => {

  if (!req.user) {
    return res.status(404).json({
      success: false,
      message: "Please Login"
    })
  }



  const { data } = req.body;

  const plaintextcontent = convertHtmlToText(data);

  const analysis = analyzeContent(plaintextcontent)
  console.log(analysis)
  res.json({
    success: true,
    Report: analysis
  })

}


export const toggleLikeBlog = async (req, res) => {
  try {
    const blogId = req.params.id;

    const userId = req.user.id;

    const blog = await Blog.findById(blogId);

    if (!blog) return res.status(404).json({ message: "Blog not found" });


    const likesArray = blog.likes || [];
    const hasLiked = likesArray.some(id => id.toString() === userId.toString());

    if (hasLiked) {

      await Blog.findByIdAndUpdate(blogId, { $pull: { likes: userId } });
      return res.status(200).json({ liked: false, message: "Unliked successfully" });

    } else {

      await Blog.findByIdAndUpdate(blogId, { $addToSet: { likes: userId } });

      return res.status(200).json({ liked: true, message: "Liked successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
