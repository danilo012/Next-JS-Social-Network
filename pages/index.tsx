import React, { FormEvent, useState } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { prisma } from "../lib/prisma";
import Post from "../components/Post";
import api from "../lib/axios";

export default function Home({ posts }: any) {
  const { data: session }: any = useSession({ required: true });
  const [newPost, setNewPost] = useState("");

  async function handleCreatePost(event: FormEvent) {
    event.preventDefault();

    await api.post("/api/posts/create", {
      text: newPost,
      email: session.user.email,
    });

    setNewPost("");
  }

  return (
    <div>
      <Head>
        <title>Next JS Social Network</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-gray-200 min-h-screen">
        <main className="pt-20 mx-auto max-w-7xl">
          <div className="flex px-4">
            <form onSubmit={handleCreatePost} className="mx-auto">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="bg-gray-white h-[15vh] xl:h-32 sm:w-96 md:w-96 w-[90vw] mx-auto xl:w-96 py-2 px-3 rounded-md outline-0 border focus:border-gray-400 resize-none"
                placeholder="Post something..."
              />
              <button
                type="submit"
                className="block my-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-md transition-all duration-250 ease-in"
              >
                Post
              </button>
            </form>
          </div>
          <div>
            {posts
              .sort((a: any, b: any) => (a.date < b.date ? 1 : -1))
              .map((item: any) => (
                <div key={item.id}>
                  <Post
                    id={item.id}
                    ownerId={item.ownerId}
                    ownerEmail={item.ownerEmail}
                    ownerName={item.ownerName}
                    ownerImage={item.ownerImage}
                    text={item.text}
                    date={item.date}
                    comments={item.comments}
                    likes={item.likes}
                  />
                </div>
              ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const posts = await prisma.posts.findMany({
    include: {
      User: true,
      _count: {
        select: {
          Likes: true,
        },
      },
      postComments: {
        select: {
          id: true,
          email: true,
          text: true,
          createdAt: true,
          User: {
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });

  const postsData: any = posts.map((post: any) => {
    return {
      id: post.id,
      text: post.text,
      date: post.createdAt.toISOString(),
      ownerId: post.User?.id,
      ownerName: post.User?.name,
      ownerImage: post.User?.image,
      ownerEmail: post.email,

      comments: post.postComments.map((i: any) => {
        const dia = [
          i.User?.name,
          i.User?.image,
          i.createdAt.toISOString(),
          i.text,
          i.User?.email,
          i.id,
        ];
        return dia;
      }),

      likes: post._count.Likes,
    };
  });

  return {
    props: {
      posts: postsData,
    },
  };
};
