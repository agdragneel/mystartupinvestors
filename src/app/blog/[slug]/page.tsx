import { fetchHashnodePost } from "@/lib/hashnode";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";

export const revalidate = 3600; // Revalidate every hour

interface BlogPostPageProps {
    params: {
        slug: string;
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const post = await fetchHashnodePost(params.slug);

    if (!post) {
        notFound();
    }

    // Format date helper
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <>
            {/* Navbar */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-[rgba(255,255,255,0.95)] border-b border-[rgba(49,55,43,0.12)] backdrop-blur-md px-8 py-4">
                <div className="max-w-[1400px] mx-auto flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/Logo.png"
                            alt="Logo"
                            width={100}
                            height={40}
                            className="h-[38px] w-auto"
                        />
                    </Link>

                    <Link href="/">
                        <button className="bg-[#31372B] text-[#FAF7EE] px-6 py-2 rounded-lg font-bold shadow hover:opacity-90 transition cursor-pointer">
                            Sign In
                        </button>
                    </Link>
                </div>
            </nav>

            <div className="min-h-screen bg-[#FAF7EE] font-[Arial] text-[#31372B]">
                {/* Breadcrumb */}
                <div className="max-w-[900px] mx-auto pt-24 px-6">
                    <div className="flex items-center gap-2 text-sm text-[#717182] mb-6">
                        <Link href="/blog" className="hover:text-[#31372B]">
                            Blog
                        </Link>
                        <span>/</span>
                        <span className="text-[#31372B] line-clamp-1">{post.title}</span>
                    </div>

                    {/* Article Header */}
                    <article className="bg-white border border-[#31372B1F] rounded-2xl overflow-hidden shadow-sm mb-8">
                        {/* Cover Image */}
                        {post.coverImage?.url && (
                            <div className="relative w-full h-[400px] bg-[#F5F5F5]">
                                <Image
                                    src={post.coverImage.url}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-8 md:p-12">
                            {/* Tags */}
                            {post.tags && post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {post.tags.map((tag) => (
                                        <span
                                            key={tag.slug}
                                            className="bg-[#F5F5F5] border border-[#31372B1F] text-[#31372B] text-sm px-3 py-1 rounded-md"
                                        >
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Title */}
                            <h1 className="text-[40px] md:text-[48px] font-bold text-[#31372B] mb-4 leading-tight">
                                {post.title}
                            </h1>

                            {/* Brief */}
                            <p className="text-[#717182] text-lg mb-6 leading-relaxed">
                                {post.brief}
                            </p>

                            {/* Author & Meta */}
                            <div className="flex items-center gap-4 pb-6 mb-8 border-b border-[#31372B1F]">
                                <div className="flex items-center gap-3">
                                    {post.author.profilePicture ? (
                                        <Image
                                            src={post.author.profilePicture}
                                            alt={post.author.name}
                                            width={48}
                                            height={48}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-[#F5F5F5] rounded-full flex items-center justify-center text-lg font-bold">
                                            {post.author.name.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-[#31372B]">
                                            {post.author.name}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-[#717182]">
                                            <span>{formatDate(post.publishedAt)}</span>
                                            <span>•</span>
                                            <span>{post.readTimeInMinutes} min read</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Blog Content */}
                            <div
                                className="prose prose-lg max-w-none
                  prose-headings:text-[#31372B] prose-headings:font-bold
                  prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                  prose-p:text-[#31372B] prose-p:leading-relaxed prose-p:mb-4
                  prose-a:text-[#31372B] prose-a:underline hover:prose-a:text-[#717182]
                  prose-strong:text-[#31372B] prose-strong:font-bold
                  prose-ul:text-[#31372B] prose-ol:text-[#31372B]
                  prose-li:text-[#31372B] prose-li:mb-2
                  prose-blockquote:border-l-4 prose-blockquote:border-[#31372B] 
                  prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-[#717182]
                  prose-code:text-[#31372B] prose-code:bg-[#F5F5F5] 
                  prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                  prose-pre:bg-[#31372B] prose-pre:text-[#FAF7EE]
                  prose-img:rounded-lg prose-img:shadow-md"
                                dangerouslySetInnerHTML={{ __html: post.content.html }}
                            />
                        </div>
                    </article>

                    {/* Back to Blog Button */}
                    <div className="mb-12">
                        <Link href="/blog">
                            <button className="bg-white border border-[#31372B] text-[#31372B] rounded-md px-6 py-2 text-sm font-medium hover:bg-[#31372B] hover:text-[#FAF7EE] transition-colors">
                                ← Back to Blog
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
