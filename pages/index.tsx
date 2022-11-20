import React, { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { prisma } from "../lib/prisma";
import Head from "next/head";
import Image from "next/image";
import { Posts } from "@prisma/client";
import Post from "../components/Post";

interface PostsProps {
  posts: Posts[];
}

export default function Home({ posts }: PostsProps) {
  const { data: session } = useSession({ required: true });
  const [newPost, setNewPost] = useState();

  async function handleCreatePost(event: FormEvent) {
    event.preventDefault();

    await fetch("http://localhost:3000/api/posts/create", {
      method: "POST",
      body: JSON.stringify({ text: newPost, email: session.user.email }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return (
    <div>
      <Head>
        <title>Next JS Social Network</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-gray-200 h-screen">
        <div className="h-16 text-transparent">a</div>
        <div>
          <h1>Posts</h1>
          <form onSubmit={handleCreatePost}>
            <input
              type="text"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="bg-gray-300"
            />
            <button type="submit">Submit</button>
          </form>
        </div>
        <div className="mt-24">
          {posts.map((item) => (
            <div key={item.id}>
              <Post
                ownerEmail={item.email}
                ownerName={item.ownerName}
                ownerImage={item.ownerImage}
                text={item.text}
                date={item.createdAt}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const posts = await prisma.posts.findMany({
    include: { User: true },
  });

  const data = posts.map((post) => {
    return {
      id: post.id,
      text: post.text,
      date: post.createdAt.toISOString(),
      ownerName: post.User?.name,
      ownerImage: post.User?.image,
    };
  });

  return {
    props: {
      posts: data,
    },
  };
};
