// Hashnode GraphQL API utilities

const HASHNODE_API_URL = "https://gql.hashnode.com";
const PUBLICATION_HOST = "codewars.hashnode.dev"; // Remove https:// and trailing slash

export interface HashnodePost {
  id: string;
  title: string;
  brief: string;
  slug: string;
  coverImage?: {
    url: string;
  };
  publishedAt: string;
  author: {
    name: string;
    profilePicture?: string;
  };
  content: {
    html: string;
  };
  readTimeInMinutes: number;
  tags?: Array<{
    name: string;
    slug: string;
  }>;
}

export interface HashnodePublication {
  posts: {
    edges: Array<{
      node: HashnodePost;
    }>;
  };
}

// Fetch all blog posts
export async function fetchHashnodePosts(): Promise<HashnodePost[]> {
  const query = `
    query Publication {
      publication(host: "${PUBLICATION_HOST}") {
        posts(first: 20) {
          edges {
            node {
              id
              title
              brief
              slug
              coverImage {
                url
              }
              publishedAt
              author {
                name
                profilePicture
              }
              readTimeInMinutes
              tags {
                name
                slug
              }
            }
          }
        }
      }
    }
  `;

  try {
    console.log("🔍 Fetching Hashnode posts from:", PUBLICATION_HOST);
    console.log("📝 GraphQL Query:", query);

    const response = await fetch(HASHNODE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    console.log("📡 Response status:", response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("📦 Full API Response:", JSON.stringify(result, null, 2));

    if (result.errors) {
      console.error("❌ GraphQL errors:", result.errors);
      throw new Error("Failed to fetch posts from Hashnode");
    }

    console.log("📊 Publication data:", result.data?.publication);

    const posts = result.data?.publication?.posts?.edges?.map(
      (edge: { node: HashnodePost }) => edge.node
    ) || [];

    console.log(`✅ Successfully fetched ${posts.length} posts`);
    if (posts.length > 0) {
      console.log("📄 First post:", posts[0]);
    }

    return posts;
  } catch (error) {
    console.error("💥 Error fetching Hashnode posts:", error);
    return [];
  }
}

// Fetch a single blog post by slug
export async function fetchHashnodePost(slug: string): Promise<HashnodePost | null> {
  const query = `
    query Publication {
      publication(host: "${PUBLICATION_HOST}") {
        post(slug: "${slug}") {
          id
          title
          brief
          slug
          coverImage {
            url
          }
          publishedAt
          author {
            name
            profilePicture
          }
          content {
            html
          }
          readTimeInMinutes
          tags {
            name
            slug
          }
        }
      }
    }
  `;

  try {
    console.log("🔍 Fetching single post with slug:", slug);
    console.log("📝 GraphQL Query:", query);

    const response = await fetch(HASHNODE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    console.log("📡 Response status:", response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("📦 Full API Response:", JSON.stringify(result, null, 2));

    if (result.errors) {
      console.error("❌ GraphQL errors:", result.errors);
      throw new Error("Failed to fetch post from Hashnode");
    }

    const post = result.data?.publication?.post || null;
    console.log(post ? "✅ Post found:" : "❌ Post not found", post?.title || "N/A");

    return post;
  } catch (error) {
    console.error("💥 Error fetching Hashnode post:", error);
    return null;
  }
}
